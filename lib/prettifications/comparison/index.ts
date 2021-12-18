import { ComparisonParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types.js"
import { style, pathDescription } from "../../style.js"
import { printCode } from "../../code/index.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const { dataPath, error: { params: { comparison, limit } } } =
		getTypedContext< ComparisonParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'value' );

	const compHuman =
		comparison === '<='
		? style.expr( "less than or equal to", context )
		: comparison === '<'
		? style.expr( "strictly less than", context )
		: comparison === '>='
		? style.expr( "greater than or equal to", context )
		: comparison === '>'
		? style.expr( "strictly greater than", context )
		: style.operator( `${comparison}`, context );

	const validStatement =
		compHuman +
		style.number( ` ${limit}`, context );

	const title =
		style.title( `The ${prePath}`, context ) +
		pathExpr +
		style.title( `${postPath} should be `, context ) +
		validStatement;

	const codeFrame = printCode(
		'Ensure this is ' + validStatement,
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
