import { PatternParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types"
import { style, pathDescription } from "../../style"
import { printCode } from "../../code"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const { dataPath, error: { params: { pattern } } } =
		getTypedContext< PatternParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'string' );

	const title =
		style.title( `The ${prePath}`, context ) +
		pathExpr +
		style.title( `${postPath} must match `, context ) +
		style.regex( pattern, context );

	const codeFrame = printCode(
		'Ensure this matches the regex pattern',
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
