import { PatternParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const {
		styleManager: { style, pathDescription },
		printCode,
		dataPath,
		error: { params: { pattern } },
	} =
		getTypedContext< PatternParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'string' );

	const title =
		style.title( `The ${prePath}` ) +
		pathExpr +
		style.title( `${postPath} must match ` ) +
		style.regex( pattern );

	const codeFrame = printCode(
		'Ensure this matches the regex pattern',
		context.parsedJson,
		{ path: dataPath.simplePath, markIdentifier: false }
	);

	return { title, codeFrame };
}
