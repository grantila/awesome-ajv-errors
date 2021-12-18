import { EnumParams } from "ajv"

import {
	PrettifyContext,
	PrettyResult,
	getTypedValue,
	getTypedContext,
} from "../../types.js"
import {
	style,
	pathDescription,
	formatValue,
	formatTypedValue,
} from "../../style.js"
import { printCode } from "../../code/index.js"
import {
	suggest,
	formatSuggestions,
	formatBestSuggestion,
} from "../../suggest.js"
import { getValueByPath } from "../../json.js"

// This is missing in AJV typings
interface ConstParams
{
	allowedValue: any;
}


export function prettify( context: PrettifyContext ): PrettyResult
{
	const { dataPath, error: { params: { allowedValue, allowedValues } } } =
		getTypedContext< EnumParams & ConstParams >( context );

	const options = allowedValues ?? [ allowedValue ];

	const value = getValueByPath( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'value' );

	const suggestionResult = suggest(
		value,
		options,
		{ referenceValue: value }
	);

	const isConst =
		options.length === 1 &&
		( options[ 0 ] === null || typeof options[ 0 ] !== 'object' );

	const title =
		style.title( `The ${prePath}`, context ) +
		pathExpr +
		style.title( `${postPath} cannot be `, context ) +
		formatValue( value, context ) +
		formatSuggestions(
			suggestionResult,
			context,
			{ isSuggestion: true, isConst }
		);

	const codeFrame = printCode(
		'replace this with ' +
		( isConst
		? formatTypedValue( getTypedValue( options[ 0 ] ), context )
		: (
			'an allowed value' +
			(
				!suggestionResult.best ? '' :
				' e.g. ' + formatBestSuggestion( suggestionResult, context )
			)
		) ),
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
