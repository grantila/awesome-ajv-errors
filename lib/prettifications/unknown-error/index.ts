import { PrettifyContext, PrettyResult } from "../../types"
import { printCode } from "../../code"
import { pathDescription, style } from "../../style"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const { dataPath, error: { message, keyword } } = context;

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'property' );

	const title =
		style.expr( `[${keyword}] `, context ) +
		style.title( `The ${prePath}`, context ) +
		pathExpr +
		style.title( `${postPath} ${message}`, context );

	const codeFrame = printCode(
		message,
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
