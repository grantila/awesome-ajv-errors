import { AdditionalPropertiesParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types.js"
import { suggest, formatSuggestions } from "../../suggest.js"
import { getPossibleProperties } from "../../schema.js"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const {
		styleManager: { style, pathDescription },
		printCode,
		dataPath,
		error: { params: { additionalProperty } },
	} =
		getTypedContext< AdditionalPropertiesParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'object' );

	const possibles = getPossibleProperties( context.schema, dataPath );

	const title =
		style.title( `The ${prePath}` ) +
		pathExpr +
		style.title( `${postPath} should not have the property ` ) +
		style.pathDescription( additionalProperty ) +
		formatSuggestions(
			suggest( additionalProperty, possibles ),
			context,
			{ untyped: true, isSuggestion: true }
		);

	const codeFrame = printCode(
		'remove or rename ' +
			style.pathDescription( `"${additionalProperty}"` ),
		context.parsedJson,
		{
			dataPath: dataPath.dotOnly + "." + additionalProperty,
			markIdentifier: true,
		}
	);

	return { title, codeFrame };
}
