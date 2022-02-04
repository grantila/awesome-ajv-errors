import { TypeParams } from "ajv"

import {
	PrettifyContext,
	PrettyResult,
	suggestAnotherType,
	SimpleValueTypeName,
	getTypedContext,
} from "../../types.js"
import { getValueByPath } from "../../json.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const {
		styleManager: { style, pathDescription, formatTypedValue },
		printCode,
		dataPath,
		error: { params: { type } },
	} =
		getTypedContext< TypeParams >( context );

	const value = getValueByPath( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'value' );

	const suggestionValue =
		suggestAnotherType( value, type as SimpleValueTypeName );
	const suggestion =
		suggestionValue === undefined
		? ''
		: formatTypedValue( suggestionValue, { includeType: true } );

	const title =
		style.title( `The type of the ${prePath}` ) +
		pathExpr +
		style.title( `${postPath} should be ` ) +
		style.pathDescription( type ) +
		( suggestion ? style.title( ', e.g. ' ) + suggestion : '' );

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
