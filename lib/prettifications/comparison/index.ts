import { ComparisonParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const {
		styleManager: { style, pathDescription },
		printCode,
		dataPath,
		error: { params: { comparison, limit } },
	} =
		getTypedContext< ComparisonParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'value' );

	const compHuman =
		comparison === '<='
		? style.expr( "less than or equal to" )
		: comparison === '<'
		? style.expr( "strictly less than" )
		: comparison === '>='
		? style.expr( "greater than or equal to" )
		: comparison === '>'
		? style.expr( "strictly greater than" )
		: style.operator( `${comparison}` );

	const validStatement =
		compHuman +
		style.number( ` ${limit}` );

	const title =
		style.title( `The ${prePath}` ) +
		pathExpr +
		style.title( `${postPath} should be ` ) +
		validStatement;

	const codeFrame = printCode(
		'Ensure this is ' + validStatement,
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
