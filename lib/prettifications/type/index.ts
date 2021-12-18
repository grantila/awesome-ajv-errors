import { TypeParams } from "ajv"

import {
	PrettifyContext,
	PrettyResult,
	suggestAnotherType,
	SimpleValueTypeName,
	getTypedContext,
} from "../../types.js"
import { style, pathDescription, formatTypedValue } from "../../style.js"
import { printCode } from "../../code/index.js"
import { getValueByPath } from "../../json.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const { dataPath, error: { params: { type } } } =
		getTypedContext< TypeParams >( context );

	const value = getValueByPath( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'value' );

	const suggestionValue =
		suggestAnotherType( value, type as SimpleValueTypeName );
	const suggestion =
		suggestionValue === undefined
		? ''
		: formatTypedValue( suggestionValue, context, { includeType: true } );

	const title =
		style.title( `The type of the ${prePath}`, context ) +
		pathExpr +
		style.title( `${postPath} should be `, context ) +
		style.pathDescription( type, context ) +
		( suggestion ? style.title( ', e.g. ', context ) + suggestion : '' );

	const codeFrame = printCode(
		'Replace this' +
		(
			suggestion
			? ' with e.g. ' + suggestion
			: ''
		),
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
