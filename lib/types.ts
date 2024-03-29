import type { ErrorObject } from "ajv"
import type { ParsedJson } from "jsonpos"

import type { DataPath } from "./data-path.js"
import type { StyleManager } from "./style/interface.js"
import type { PrintCode } from "./code/types.js"
import type { ErrorParameters, TypeParams } from "./ajv-types.js"


export interface ErrorContext
{
}

export type ValidationError =
	ErrorObject &
	{
		typeErrors?: Array< SpecificAjvError< TypeParams > >
	};

export interface PrettificationCore
{
	errors: ValidationError | ArrayLike< ValidationError >;
	schema: { }; // JSON
	data: any; // JSON
}

export interface PrettifyContext< Params = any > extends PrettificationCore
{
	styleManager: StyleManager;
	printCode: PrintCode;
	error: SpecificAjvError< Params >;
	dataPath: DataPath;
	parsedJson: ParsedJson;
}

export interface PrettyResult
{
	title: string;
	codeFrame?: string;
}

export type CustomPrettify = ( context: PrettifyContext ) => PrettyResult;

export type EnsureErrorType< T > = T extends ErrorParameters ? T : never;

export type SpecificAjvError< T > =
	Omit< ValidationError, 'params' > & { params: T };

export function getError< T >( context: PrettifyContext )
: SpecificAjvError< EnsureErrorType< T > >
{
	return context.error as SpecificAjvError< EnsureErrorType< T > >;
}

export function getTypedContext< T >( context: PrettifyContext )
: PrettifyContext< EnsureErrorType< T > >
{
	return context as PrettifyContext< EnsureErrorType< T > >;
}

export type SimpleValueType = null | boolean | number | string;
export type SimpleValueTypeName = 'null' | 'boolean' | 'number' | 'string';

export interface TypedValue
{
	value: SimpleValueType;
	type: 'boolean' | 'number' | 'null' | 'string' | 'object' | 'array';
	isSimple: boolean;
}

export const getValueType =
	( value: SimpleValueType ): TypedValue[ 'type' ] =>
		value === null ? 'null' : typeof value as TypedValue[ 'type' ];

export const getTypedValue = ( value: any ): TypedValue =>
	value == null || typeof value !== 'object'
	? { value, type: getValueType( value ), isSimple: true }
	: Array.isArray( value )
	? { value: '[...]', type: 'array', isSimple: false }
	: { value: '{...}', type: 'object', isSimple: false };

export const getTypedValueKey = ( { type, value }: TypedValue ) =>
	type + "::" + value;

export const isSimpleValue =
	< T extends SimpleValueType >( possible: T | any ): possible is T =>
		possible === null ||
		typeof possible === 'boolean' ||
		typeof possible === 'number' ||
		typeof possible === 'string';

export function suggestAnotherType( value: any, toType: SimpleValueTypeName )
: TypedValue | undefined
{
	const { isSimple, type: fromType } = getTypedValue( value );

	if ( !isSimple )
		return;

	const convert = ( ) =>
	{
		if ( fromType === 'null' )
		{
			if ( toType === 'string' )
				return 'null';
			else if ( toType === 'number' )
				return 0;
			else if ( toType === 'boolean' )
				return false;
		}
		else if ( fromType === 'boolean' )
		{
			if ( toType === 'string' )
				return `${value}`;
			else if ( toType === 'number' )
				return value ? 1 : 0;
			else if ( toType === 'null' )
				return value ? undefined : null;
		}
		else if ( fromType === 'number' )
		{
			if ( toType === 'string' )
				return `${value}`;
			else if ( toType === 'boolean' )
				return value === 0 ? false : value === 1 ? true : undefined;
			else if ( toType === 'null' )
				return value === 0 ? null : undefined;
		}
		else if ( fromType === 'string' )
		{
			if ( toType === 'number' )
				return isNaN( Number( value ) ) ? undefined : Number( value );
			else if ( toType === 'boolean' )
				return value === "true"
					? true
					: value === "false"
					? false
					: undefined;
			else if ( toType === 'null' )
				return value === "null" ? null : undefined;
		}

		return;
	};

	const ret = convert( );
	if ( ret === undefined )
		return undefined;
	return getTypedValue( ret );
}
