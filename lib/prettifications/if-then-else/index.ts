import { IfParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types.js"
import { style, pathDescription } from "../../style.js"
import { printCode } from "../../code/index.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const { dataPath, error: { params: { failingKeyword } } } =
		getTypedContext< IfParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'value' );

	const title =
		style.title( 'The conditional ', context ) +
		style.expr( `if/${failingKeyword}`, context ) +
		style.title( ` on ${prePath}`, context ) +
		pathExpr +
		style.title(
			`${postPath} is not satisfied (showed in separate error)`,
			context
		) +
		"\n" +
		style.title( 'The ', context ) +
		style.expr( 'if', context ) +
		style.title( ' clause references:', context );

	const codeFrame = printCode(
		'Ensure the corresponding ' +
			style.expr( failingKeyword, context ) +
			' clause is satisfied',
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
