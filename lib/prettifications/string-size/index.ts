import { LimitParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types.js"
import { style, pathDescription } from "../../style.js"
import { printCode } from "../../code/index.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const { dataPath, error: { keyword, params: { limit } } } =
		getTypedContext< LimitParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'string' );

	const limitOperation =
		keyword === 'maxLength'
		? style.expr( 'at most', context )
		: keyword === 'minLength'
		? style.expr( 'at least', context )
		: '{unknown}';

	const validStatement =
		`${limitOperation} ` +
		style.number( `${limit}`, context ) +
		style.expr( ' characters long', context );

	const title =
		style.title( `The ${prePath}`, context ) +
		pathExpr +
		style.title( `${postPath} should be `, context ) +
		validStatement;

	const codeFrame = printCode(
		'Ensure this is ' + validStatement,
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
