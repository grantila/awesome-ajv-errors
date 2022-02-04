import { ValidateFunction } from "ajv"
import { getAstByObject } from "jsonpos"

import {
	ValidationError,
	PrettificationCore,
	PrettifyContext,
	PrettyResult,
} from "./types"
import { ensureArray } from "./util.js"
import { parseDataPath } from "./data-path.js"
import { prepareText } from "./big-numbers/index.js"

import { ManagerOptions, StyleManager } from "./style/interface.js"
import { makeManager } from "./style/manager.js"
import { managerOptions as plainOptions } from "./style/style-plain.js"
import { makePrintCode, PrintCode } from "./code/types.js"

import { handlers } from "./prettifications/index.js"


export interface PrettifyOptions extends PrettificationCore
{
	/**
	 * Defaults to what stdout is detected to support, but can be forced to
	 * true or false.
	 */
	colors?: boolean;
}

export interface Prettify< Ret >
{
	( opts: PrettifyOptions ): Ret;
	(
		validate: ValidateFunction,
		opts: Omit< PrettifyOptions, 'errors' | 'schema' >
	): Ret;
}

export function makePrettify(
	managerOptions: ManagerOptions,
	printCode: PrintCode
)
: Prettify< string >
{
	const styleManager = makeManager( managerOptions );
	const styleManagerPlain = makeManager( plainOptions );

	const getManager = ( colors?: boolean ) =>
		styleManager.ensureColorUsage( colors )
		? styleManager
		: styleManagerPlain;

	return function prettify(
		validate: ValidateFunction | PrettifyOptions,
		opts?: Omit< PrettifyOptions, 'errors' | 'schema' >
	): string
	{
		if ( typeof validate === 'function' )
		{
			const styleManager = getManager( opts?.colors );

			return _prettify( {
				errors: ensureArray( validate.errors ),
				schema: validate.schema as object,
				data: opts?.data,
				styleManager,
				printCode: makePrintCode( styleManager.support, printCode ),
			} );
		}
		else
		{
			const styleManager =
				getManager( ( validate as PrettifyOptions )?.colors );

			return _prettify( {
				...( validate as PrettifyOptions ),
				styleManager,
				printCode: makePrintCode( styleManager.support, printCode ),
			} );
		}
	}
}

interface InternalPrettifyOptions extends Omit< PrettifyOptions, 'color' >
{
	styleManager: StyleManager;
	printCode: PrintCode;
}

function _prettify( opts: InternalPrettifyOptions ): string
{
	const { styleManager, printCode } = opts;

	const errors = mergeTypeErrors( ensureArray( opts.errors ) );

	if ( errors.length === 0 )
		return styleManager.style.good( "No errors" );

	const parsedJson = getAstByObject( opts.data, 2 );

	const preparedText = prepareText( { maxNumber: errors.length + 1 } );

	return errors.map( ( error, index ) =>
	{
		const context: PrettifyContext = {
			errors: opts.errors,
			schema: opts.schema,
			data: opts.data,
			styleManager,
			printCode,
			error,
			dataPath: parseDataPath( error ),
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

function getPrettyError( context: PrettifyContext ): PrettyResult
{
	const handler = handlers[ context.error.keyword as keyof typeof handlers ];

	return handler
		? handler( context )
		: handlers.unknownError( context );
}

function prettifyOne( context: PrettifyContext ): string
{
	return context.styleManager.printError( getPrettyError( context ) );
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
