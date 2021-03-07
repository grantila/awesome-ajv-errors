import { ValidateFunction } from "ajv"

import {
	ValidationError,
	PrettificationCore,
	PrettifyContext,
	PrettyResult,
} from "./types"
import { ensureArray } from "./util"
import { parseDataPath } from "./data-path"
import { style, ensureColorUsage, printError } from "./style"
import { getAstByObject } from "jsonpos"
import { prepareText } from "./big-numbers"

import { handlers } from "./prettifications"


export interface PrettifyOptions extends PrettificationCore
{
	/**
	 * Defaults to what stdout is detected to support, but can be forced to
	 * true or false.
	 */
	colors?: boolean;
}

export function prettify( opts: PrettifyOptions ): string;
export function prettify(
	validate: ValidateFunction,
	opts: Omit< PrettifyOptions, 'errors' | 'schema' >
): string;

export function prettify(
	validate: ValidateFunction | PrettifyOptions,
	opts?: Omit< PrettifyOptions, 'errors' | 'schema' >
): string
{
	if ( typeof validate === 'function' )
		return _prettify( {
			errors: ensureArray( validate.errors ),
			schema: validate.schema as object,
			data: opts?.data,
			colors: opts?.colors,
		} );
	else
		return _prettify( validate as PrettifyOptions );
}

export function _prettify( opts: PrettifyOptions ): string
{
	const errors = mergeTypeErrors( ensureArray( opts.errors ) );

	if ( errors.length === 0 )
		return style.good(
			"No errors",
			{
				colors: ensureColorUsage( opts.colors ),
				dataPath: { orig: '', dotOnly: '', path: [ ] }
			}
		);

	const parsedJson = getAstByObject( opts.data, 2 );

	const preparedText = prepareText( { maxNumber: errors.length + 1 } );

	return errors.map( ( error, index ) =>
	{
		const context: PrettifyContext = {
			errors: opts.errors,
			schema: opts.schema,
			data: opts.data,
			colors: ensureColorUsage( opts.colors ),
			error,
			dataPath: parseDataPath( error.dataPath ),
			parsedJson,
		};

		const errorLines = prettifyOne( context ).split( "\n" );

		if ( errors.length === 1 )
			return errorLines.join( "\n" );

		return preparedText.printAsPrefix(
			index + 1,
			errorLines,
			{ separator: '  ' }
		)
		.join( "\n" );
	} )
	.join( "\n\n" );
}

export function getPrettyError( context: PrettifyContext ): PrettyResult
{
	const handler = handlers[ context.error.keyword as keyof typeof handlers ];

	return handler
		? handler( context )
		: handlers.unknownError( context );
}

export function prettifyOne( context: PrettifyContext ): string
{
	return printError( getPrettyError( context ) );
}

function mergeTypeErrors( errors: Array< ValidationError > )
: Array< ValidationError >
{
	const toRemove = new Set< ValidationError >( );

	errors.filter( error => error.keyword === 'anyOf' ).forEach( error =>
	{
		error.typeErrors =
			( errors as NonNullable< typeof error.typeErrors > )
			.filter( typeError =>
				typeError.dataPath === error.dataPath &&
				typeError.keyword === 'type'
			);
		error.typeErrors.forEach( error => { toRemove.add( error ); } );
	} );

	return errors.filter( error => !toRemove.has( error ) );
}
