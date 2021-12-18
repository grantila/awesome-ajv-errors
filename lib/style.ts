import chalk from "chalk"
import terminalLink from "terminal-link"

import {
	PrettifyContext,
	PrettificationCore,
	PrettyResult,
	TypedValue,
	SimpleValueType,
	getTypedValue,
} from "./types.js"
import { enquote } from "./util.js"
import { DataPath } from "./data-path.js"


const {
	supportsColor,
	dim,
	red,
	blue,
	green,
	yellow,
	magenta,
	white,
} = chalk;

const styles = {
	title: red.bold,
	pathDescription: blue.italic,
	expr: white.italic,
	type: blue.bold,
	string: green,
	number: magenta,
	primitive: yellow,
	dimmed: dim,
	good: green,
	operator: white,
	link: blue,
	regex: magenta.italic
};

export type StyleContext = Omit<
	PrettifyContext,
	keyof PrettificationCore | 'error' | 'parsedJson'
>;

type Style = {
	[ key in keyof typeof styles ]:
		( text: string, context: StyleContext ) => string;
}

export const style = { } as Style;
for ( const key of Object.keys( styles ) )
	style[ key as keyof typeof style ] =
		( text: string, context: StyleContext ) =>
			context.colors
				? styles[ key as keyof typeof style ]( text )
				: text;

export function link( title: string, url: string, context: StyleContext )
: string
{
	return terminalLink( style.link( title, context ), url );
}

export const support = Boolean( supportsColor && supportsColor.hasBasic );

export const ensureColorUsage = ( useColors?: boolean | undefined ) =>
	useColors == null ? support : useColors;


export function formatDataPath( dataPath: DataPath, context: PrettifyContext )
: string
{
	return dataPath.path
		.map( ( { key, type } ) =>
			type === 'number'
			?
				style.operator( '[', context ) +
				style.number( key, context ) +
				style.operator( ']', context )
			:
				style.operator( '.', context ) +
				style.string( key, context )
		)
		.join( '' );
}

export function pathDescription( context: PrettifyContext, pathType: string )
: [ string, string, string ]
{
	const { dataPath } = context;

	if ( dataPath.path.length === 0 )
		return [ '', style.expr( "root object", context ), '' ];

	const humanify = ( dataPath: DataPath ): [ string, string, string ] =>
		dataPath.path.length === 1
		? [ '', formatDataPath( dataPath, context ), ` ${pathType}` ]
		: [ `${pathType} at `, formatDataPath( dataPath, context ), '' ];

	return humanify( dataPath );
}

export interface PrintEnumOptions
{
	indent?: number;
	bullet?: boolean;
}

export function printEnum(
	lines: Array< string >,
	{ indent = 0, bullet = true }: PrintEnumOptions = { }
)
{
	const prefix = indent === 0 ? '' : ' '.repeat( indent );
	const bulletChar = bullet ? '∙ ' : '';
	return lines.map( line => `${prefix}    ${bulletChar}${line}` );
}

export function printError( result: PrettyResult )
{
	return result.title + "\n\n" + result.codeFrame;
}

export interface FormatTypedValueOptions
{
	untyped?: boolean
	includeType?: boolean
}

export function formatTypedValue(
	typedValue: TypedValue,
	context: PrettifyContext,
	{
		untyped = false,
		includeType = false,
	}: FormatTypedValueOptions = {}
): string
{
	const type = typedValue.type;
	const value = `${typedValue.value}`;

	const styledValue =
		type === 'string'
		? untyped
			? style.pathDescription( value, context )
			: style.string( enquote( value ), context )
		: type === 'number'
		? style.number( value, context )
		: style.primitive( value, context );

	if ( !includeType && typedValue.isSimple )
		return styledValue;

	return styledValue +
		style.title( ' (as ', context ) +
		style.pathDescription( type, context ) +
		style.title( ')', context );
}

export function formatValue(
	value: SimpleValueType,
	context: PrettifyContext,
	opts?: FormatTypedValueOptions
): string
{
	return formatTypedValue(
		getTypedValue( value ),
		context,
		opts
	);
}
