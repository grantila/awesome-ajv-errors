import { RequiredParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const {
		styleManager: { style, pathDescription },
		printCode,
		dataPath,
		error: { params: { missingProperty } },
	} =
		getTypedContext< RequiredParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'value' );

	const title =
		style.title( `The ${prePath}` ) +
		pathExpr +
		style.title( `${postPath} is missing required property ` ) +
		style.pathDescription( missingProperty );

	const codeFrame = printCode(
		'add missing property ' +
			style.pathDescription( missingProperty )
		,
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
