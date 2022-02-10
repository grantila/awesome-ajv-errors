import { LimitParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types.js"
import { getValueByPath } from "../../json.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const {
		styleManager: { style, pathDescription },
		printCode,
		dataPath,
		error: { keyword, params: { limit } },
	} =
		getTypedContext< LimitParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'array' );

	const value = getValueByPath( context ) as Array< unknown >;

	const plural = ( text: string, num = Math.abs( value.length - limit ) ) =>
		text + ( num > 1 ? 's' : '' );

	const limitOperation =
		keyword === 'maxItems'
		? style.expr( 'should NOT have more than ' )
		: style.expr( 'should have at least ' );

	const validStatement =
		limitOperation +
		style.number( `${limit}` ) +
		style.expr( plural( ' item', limit ) );

	const title =
		style.title( `The ${prePath}` ) +
		pathExpr +
		style.title( `${postPath} should be ` ) +
		validStatement;

	const shortMessage =
		keyword === 'maxItems'
		?
			style.title( 'Remove ' ) +
			style.number( `${value.length - limit}` ) +
			style.title( plural( ' item' ) )
		:
			style.title( 'Ensure the array has ' ) +
			style.number( `${limit - value.length}` ) +
			style.title( plural( ' more item' ) );

	const codeFrame = printCode(
		shortMessage,
		context.parsedJson,
		{ path: dataPath.simplePath, markIdentifier: false }
	);

	return { title, codeFrame };
}
