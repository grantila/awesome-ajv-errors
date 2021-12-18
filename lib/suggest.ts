import leven from 'leven'

import {
	PrettifyContext,
	TypedValue,
	SimpleValueType,
	getValueType,
	getTypedValueKey,
	getTypedValue,
} from './types.js'
import { style, printEnum, formatTypedValue } from './style.js'
import { uniq } from './util.js'


export interface SuggestOptions
{
	limit?: number | ( ( length: number ) => number );
	referenceValue?: SimpleValueType;
}

export interface SuggestResult
{
	suggestions: Array< TypedValue >;
	rest: Array< TypedValue >;
	best?: TypedValue;
	referenceValue?: SimpleValueType;
}

const defaultLimit = ( length: number ) => length < 3 ? 1 : length < 5 ? 2 : 3;

export function suggest< T extends Array< any > | undefined >(
	value: string,
	possibles: T,
	opts: SuggestOptions = { }
)
: T extends Array< any > ? SuggestResult : undefined
{
	if ( !possibles )
		return undefined as any;

	value = `${value}`;
	const { length } = value;

	const {
		limit = defaultLimit,
		referenceValue
	} = opts;

	const distanceLimit = typeof limit === 'number' ? limit : limit( length );

	const suggestions: Array< TypedValue > = [ ];
	const rest: Array< TypedValue > = [ ];

	possibles
		.map( possible => getTypedValue( possible ) )
		.map( valueType => ( {
			...valueType,
			distance: valueType.isSimple
				? leven( value, `${valueType.value}` )
				: Infinity,
		} ) )
		.sort( ( a, b ) =>
			a.distance === b.distance ? 0 : a.distance < b.distance ? -1 : 1
		)
		.forEach( ( { distance, type, value, isSimple } ) =>
		{
			const suggest = distanceLimit === -1 || distance <= distanceLimit;
			if ( suggest )
				suggestions.push( { type, value, isSimple } );
			else
				rest.push( { type, value, isSimple } );
		} );

	// The rest should be alphabetically ordered, it's easier to grasp
	rest.sort( ( a, b ) => `${a.value}`.localeCompare( `${b.value}` ) );

	const ret: SuggestResult = {
		suggestions,
		rest,
		referenceValue,
		best: suggestions?.[ 0 ],
	};

	return ret as any;
}

export interface FormatSuggestionsOptions
{
	untyped?: boolean;
	referenceValue?: SimpleValueType;
	isSuggestion?: boolean;
	isConst?: boolean;
}

export function formatSuggestions(
	list: SuggestResult | Array< TypedValue > | undefined,
	context: PrettifyContext,
	opts: FormatSuggestionsOptions = { }
)
{
	if ( !list )
		return '';

	const ifSuggestResult =
		Array.isArray( ( list as SuggestResult )?.rest )
		? list as SuggestResult
		: undefined;

	const rest = ifSuggestResult?.rest ?? [ ];

	const suggestions =
		ifSuggestResult?.suggestions ?? list as Array< TypedValue >;

	const {
		untyped: defaultUntyped,
		referenceValue = ifSuggestResult?.referenceValue,
		isSuggestion,
		isConst = false,
	} = opts;

	const referenceType =
		referenceValue === undefined
		? undefined
		: getValueType( referenceValue );

	const useUntyped = ( ) => defaultUntyped ?? false;

	const useType = ( suggestion: TypedValue ) =>
		referenceValue === undefined
		? false
		: referenceType !== suggestion.type;

	const formatUntyped = ( suggestion: TypedValue ) =>
		formatTypedValue(
			suggestion,
			context,
			{
				untyped: useUntyped( ),
				includeType: useType( suggestion ),
			}
		);

	const uniqSuggestions = uniq( suggestions, getTypedValueKey );
	const allSuggestions = [ ...uniqSuggestions, ...rest];

	const styledSuggestion =
		allSuggestions.length === 1
		? formatUntyped( allSuggestions[ 0 ] )
		: allSuggestions.length === 2
		?
			formatUntyped( allSuggestions[ 0 ] ) +
			style.title( " or ", context ) +
			formatUntyped( allSuggestions[ 1 ] )
		:
			style.title( "any of:", context ) + "\n" +
			printEnum(
				[
					...uniqSuggestions.map( suggestion =>
						formatUntyped( suggestion )
					),
					...( rest.length === 0 ? [ ] : [
						"other available values:",
						...printEnum(
							rest.map( suggestion =>
								formatUntyped( suggestion )
							),
							{ indent: 2, bullet: false }
						)
					] )
				]
			)
			.join( "\n" );

	const isQuestion = allSuggestions.length !== 1 && !isConst;

	return (
		!isSuggestion ? '' :
			style.title(
				`, ${isQuestion ? 'did you mean' : 'it must be'} `,
				context
			)
		) +
		styledSuggestion +
		(
			isQuestion && isSuggestion && uniqSuggestions.length < 3
			? style.title( '?', context )
			: ''
		);
}

export function formatBestSuggestion(
	{ best, referenceValue }: SuggestResult,
	context: PrettifyContext
)
{
	if ( !best ) return undefined;

	const includeType =
		referenceValue === undefined
		? false
		: getValueType( referenceValue ) !== best.type;

	return formatTypedValue( best, context, { untyped: false, includeType } );
}

export interface SuggestedType
{
	type: string;
	value: string;
}

export function suggestTypedValue< T extends string | number >(
	value: T,
	types: Array< string >,
	context: PrettifyContext
): SuggestedType | undefined
{
	if ( typeof value === 'string' && types.includes( "number" ) )
		return {
			type: "number",
			value: formatTypedValue(
				{ value, type: 'number', isSimple: true },
				context
			),
		};
	else if ( typeof value === 'number' && types.includes( "string" ) )
		return {
			type: "string",
			value: formatTypedValue(
				{ value: `${value}`, type: 'string', isSimple: true },
				context
			),
		};
	else
		return undefined;
}
