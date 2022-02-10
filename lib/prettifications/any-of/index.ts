import { TypeParams, NoParams } from "ajv"

import {
	PrettifyContext,
	PrettyResult,
	getTypedValue,
	getTypedContext,
} from "../../types.js"
import { suggestTypedValue, formatSuggestions } from "../../suggest.js"
import { getValueByPath } from "../../json.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const {
		styleManager: { style, pathDescription },
		printCode,
		dataPath,
		error: { keyword, typeErrors = [ ] },
	} =
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
		style.title( `The type of the ${prePath}` ) +
		pathExpr +
		style.title( `${postPath} should ` ) +
		(
			keyword === 'not'
			?
				style.title( 'NOT be ' ) +
				style.pathDescription( getTypedValue( value ).type )
			:
				style.title( `be ` ) + instead
		);

	const codeFrame = printCode(
		keyword === 'not'
		? 'change this type'
		: `change this value` +
			(
				!suggestion ? '' :
				' to ' + suggestion.value +
				' (as ' + style.pathDescription( suggestion.type ) +
				') perhaps?'
			),
		context.parsedJson,
		{ path: dataPath.simplePath, markIdentifier: false }
	);

	return { title, codeFrame };
}
