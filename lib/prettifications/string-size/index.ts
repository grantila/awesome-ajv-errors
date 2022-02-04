import { LimitParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types.js"


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
		pathDescription( context, 'string' );

	const limitOperation =
		keyword === 'maxLength'
		? style.expr( 'at most' )
		: keyword === 'minLength'
		? style.expr( 'at least' )
		: '{unknown}';

	const validStatement =
		`${limitOperation} ` +
		style.number( `${limit}` ) +
		style.expr( ' characters long' );

	const title =
		style.title( `The ${prePath}` ) +
		pathExpr +
		style.title( `${postPath} should be ` ) +
		validStatement;

	const codeFrame = printCode(
		'Ensure this is ' + validStatement,
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
