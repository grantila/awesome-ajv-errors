import { UniqueItemsParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types.js"
import { getValueByPath } from "../../json.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const {
		styleManager: { style, pathDescription, formatValue },
		printCode,
		dataPath,
		error: { params: { i, j } },
	} =
		getTypedContext< UniqueItemsParams >( context );

	const [ a, b ] = [ i, j ].sort( );

	const valueA = getValueByPath( context, dataPath.dotOnly + `.${a}` );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'array' );

	const title =
		style.title( `The ${prePath}` ) +
		pathExpr +
		style.title( `${postPath} should have unique items, but element ` ) +
		style.number( `${a}` ) +
		style.title( " and " ) +
		style.number( `${b}` ) +
		style.title( " are identical: " ) +
		formatValue( valueA );

	const codeFrame = printCode(
		'Remove element ' +
		style.number( `${a}` ) +
		' or ' +
		style.number( `${b}` ),
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
