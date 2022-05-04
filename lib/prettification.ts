import type { ValidateFunction } from "ajv"
import { getParsedByObject } from "jsonpos"

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

	/**
	 * Include (if possible) the location of the error using a pretty-printed
	 * code-frame.
	 *
	 * Defaults to `true`
	 */
	location?: boolean;

	/**
	 * When pretty-printing (if `location` is enabled), print big numbers
	 * before each error if there are multiple errors.
	 *
	 * Defaults to `true` in Node.js (if location is enabled) and `false`
	 * otherwise.
	 */
	bigNumbers?: boolean;
}

export interface Prettify< Ret >
{
	( opts: PrettifyOptions ): Ret;
	(
		validate: ValidateFunction,
		opts: Omit< PrettifyOptions, 'errors' | 'schema' >
	): Ret;
}

type Environment = 'node' | 'browser';

export function makePrettify(
	managerOptions: ManagerOptions,
	printCode: PrintCode,
	environment: Environment
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
				printCode,
				location: opts?.location,
				bigNumbers: opts?.bigNumbers,
				environment,
			} );
		}
		else
		{
			const styleManager =
				getManager( ( validate as PrettifyOptions )?.colors );

			return _prettify( {
				location: undefined,
				bigNumbers: undefined,
				...( validate as PrettifyOptions ),
				styleManager,
				printCode,
				environment,
			} );
		}
	}
}

interface InternalPrettifyOptions extends Omit< PrettifyOptions, 'colors' >
{
	styleManager: StyleManager;
	printCode: PrintCode;
	environment: Environment;
}

type InitializedPrettifyOptions = Required< InternalPrettifyOptions >;

function initOptionsWithDefaults(
	options: InternalPrettifyOptions
)
: InitializedPrettifyOptions
{
	const location = options.location ?? ( options.environment === 'node' );
	const bigNumbers =
		location &&
		( options.bigNumbers ?? ( options.environment === 'node' ) );

	const printCode = makePrintCode(
		location,
		options.styleManager.support,
		options.printCode
	);

	return { ...options, location, bigNumbers, printCode };
}

function _prettify( _opts: InternalPrettifyOptions ): string
{
	const opts = initOptionsWithDefaults( _opts );

	const { styleManager, printCode, bigNumbers } = opts;

	const errors = mergeTypeErrors( ensureArray( opts.errors ) );

	if ( errors.length === 0 )
		return styleManager.style.good( "No errors" );

	const parsedJson = getParsedByObject( opts.data, 2 );

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

		if ( !bigNumbers || errors.length === 1 )
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
