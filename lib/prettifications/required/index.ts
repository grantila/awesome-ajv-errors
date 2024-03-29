import { RequiredParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types"
import { style, pathDescription } from "../../style"
import { printCode } from "../../code";


export function prettify( context: PrettifyContext ): PrettyResult
{
	const { dataPath, error: { params: { missingProperty } } } =
		getTypedContext< RequiredParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'value' );

	const title =
		style.title( `The ${prePath}`, context ) +
		pathExpr +
		style.title( `${postPath} is missing required property `, context ) +
		style.pathDescription( missingProperty, context );

	const codeFrame = printCode(
		'add missing property ' +
			style.pathDescription( missingProperty, context )
		,
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
