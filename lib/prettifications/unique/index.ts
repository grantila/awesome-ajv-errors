import { UniqueItemsParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types.js"
import { style, pathDescription, formatValue } from "../../style.js"
import { printCode } from "../../code/index.js"
import { getValueByPath } from "../../json.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const { dataPath, error: { params: { i, j } } } =
		getTypedContext< UniqueItemsParams >( context );

	const [ a, b ] = [ i, j ].sort( );

	const valueA = getValueByPath( context, dataPath.dotOnly + `.${a}` );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'array' );

	const title =
		style.title( `The ${prePath}`, context ) +
		pathExpr +
		style.title(
			`${postPath} should have unique items, but element `,
			context
		) +
		style.number( `${a}`, context ) +
		style.title( " and ", context ) +
		style.number( `${b}`, context ) +
		style.title( " are identical: ", context ) +
		formatValue( valueA, context );

	const codeFrame = printCode(
		'Remove element ' +
		style.number( `${a}`, context ) +
		' or ' +
		style.number( `${b}`, context ),
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
