import { PrettifyContext, PrettyResult } from "../../types.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const {
		styleManager: { style, pathDescription },
		printCode,
		dataPath,
		error: { message, keyword },
	} = context;

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'property' );

	const title =
		style.expr( `[${keyword}] ` ) +
		style.title( `The ${prePath}` ) +
		pathExpr +
		style.title( `${postPath} ${message}` );

	const codeFrame = printCode(
		message,
		context.parsedJson,
		{ path: dataPath.simplePath, markIdentifier: false }
	);

	return { title, codeFrame };
}
