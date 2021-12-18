import { MultipleOfParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types.js"
import { style, pathDescription } from "../../style.js"
import { printCode } from "../../code/index.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const { dataPath, error: { params: { multipleOf } }  } =
		getTypedContext< MultipleOfParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'value' );

	const validStatement =
		style.title( `multiple of `, context ) +
		style.number( `${multipleOf}`, context );

	const title =
		style.title( `The ${prePath}`, context ) +
		pathExpr +
		style.title( `${postPath} should be a `, context ) +
		validStatement + ' ' +
		style.title( '(e.g. ', context ) +
		[ 0, 1, 2, 3 ]
			.map( mul =>
				style.number( `${mul * multipleOf}`, context )
			)
			.concat( [ style.title( 'etc', context ) ] )
			.join( style.operator( ', ', context ) ) +
		style.title( ')', context );

	const codeFrame = printCode(
		'Ensure this is a ' + validStatement,
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
