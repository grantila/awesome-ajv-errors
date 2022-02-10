import { IfParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const {
		styleManager: { style, pathDescription },
		printCode,
		dataPath,
		error: { params: { failingKeyword } },
	} =
		getTypedContext< IfParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'value' );

	const title =
		style.title( 'The conditional ' ) +
		style.expr( `if/${failingKeyword}` ) +
		style.title( ` on ${prePath}` ) +
		pathExpr +
		style.title(
			`${postPath} is not satisfied (showed in separate error)`
		) +
		"\n" +
		style.title( 'The ' ) +
		style.expr( 'if' ) +
		style.title( ' clause references:' );

	const codeFrame = printCode(
		'Ensure the corresponding ' +
			style.expr( failingKeyword ) +
			' clause is satisfied',
		context.parsedJson,
		{ path: dataPath.simplePath, markIdentifier: false }
	);

	return { title, codeFrame };
}
