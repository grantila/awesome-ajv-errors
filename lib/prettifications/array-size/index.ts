import { LimitParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types"
import { style, pathDescription } from "../../style"
import { printCode } from "../../code"
import { getValueByPath } from "../../json"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const { dataPath, error: { keyword, params: { limit } } } =
		getTypedContext< LimitParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'array' );

	const value = getValueByPath( context ) as Array< unknown >;

	const plural = ( text: string, num = Math.abs( value.length - limit ) ) =>
		text + ( num > 1 ? 's' : '' );

	const limitOperation =
		keyword === 'maxItems'
		? style.expr( 'should NOT have more than ', context )
		: style.expr( 'should have at least ', context );

	const validStatement =
		limitOperation +
		style.number( `${limit}`, context ) +
		style.expr( plural( ' item', limit ), context );

	const title =
		style.title( `The ${prePath}`, context ) +
		pathExpr +
		style.title( `${postPath} should be `, context ) +
		validStatement;

	const shortMessage =
		keyword === 'maxItems'
		?
			style.title( 'Remove ', context ) +
			style.number( `${value.length - limit}`, context ) +
			style.title( plural( ' item' ), context )
		:
			style.title( 'Ensure the array has ', context ) +
			style.number( `${limit - value.length}`, context ) +
			style.title( plural( ' more item' ), context );

	const codeFrame = printCode(
		shortMessage,
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
