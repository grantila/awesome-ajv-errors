import { TypeParams, NoParams } from "ajv"

import {
	PrettifyContext,
	PrettyResult,
	getTypedValue,
	getTypedContext,
} from "../../types.js"
import { style, pathDescription } from "../../style.js"
import { suggestTypedValue, formatSuggestions } from "../../suggest.js"
import { printCode } from "../../code/index.js"
import { getValueByPath } from "../../json.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const { dataPath, error: { keyword, typeErrors = [ ] } } =
		getTypedContext< TypeParams & NoParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'value' );

	const value = getValueByPath( context );

	const allowedTypes = typeErrors.map( typeError => typeError.params.type );
	const suggestion = suggestTypedValue( value, allowedTypes, context );

	const instead =
		typeErrors.length === 0
		? 'unknown'
		: formatSuggestions(
			allowedTypes.map( value => ( {
				value,
				type: 'string',
				isSimple: true,
			} ) ),
			context,
			{ untyped: true }
		);

	const title =
		style.title( `The type of the ${prePath}`, context ) +
		pathExpr +
		style.title( `${postPath} should `, context ) +
		(
			keyword === 'not'
			?
				style.title( 'NOT be ', context ) +
				style.pathDescription( getTypedValue( value ).type, context )
			:
				style.title( `be `, context ) +
				instead
		);

	const codeFrame = printCode(
		keyword === 'not'
		? 'change this type'
		: `change this value` +
			(
				!suggestion ? '' :
				' to ' + suggestion.value +
				' (as ' + style.pathDescription( suggestion.type, context ) +
				') perhaps?'
			),
		context.parsedJson,
		{ dataPath: dataPath.dotOnly, markIdentifier: false }
	);

	return { title, codeFrame };
}
