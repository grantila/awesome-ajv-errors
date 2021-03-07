import { AdditionalPropertiesParams } from "ajv"

import { PrettifyContext, PrettyResult, getTypedContext } from "../../types"
import { style, pathDescription } from "../../style"
import { printCode } from "../../code";
import { suggest, formatSuggestions } from "../../suggest"
import { getPossibleProperties } from "../../schema"


export function prettify( context: PrettifyContext ): PrettyResult
{
	const { dataPath, error: { params: { additionalProperty } } } =
		getTypedContext< AdditionalPropertiesParams >( context );

	const [ prePath, pathExpr, postPath ] =
		pathDescription( context, 'object' );

	const possibles = getPossibleProperties( context.schema, dataPath );

	const title =
		style.title( `The ${prePath}`, context ) +
		pathExpr +
		style.title( `${postPath} should not have the property `, context ) +
		style.pathDescription( additionalProperty, context ) +
		formatSuggestions(
			suggest( additionalProperty, possibles ),
			context,
			{ untyped: true, isSuggestion: true }
		);

	const codeFrame = printCode(
		'remove or rename ' +
			style.pathDescription( `"${additionalProperty}"`, context ),
		context.parsedJson,
		{
			dataPath: dataPath.dotOnly + "." + additionalProperty,
			markIdentifier: true,
		}
	);

	return { title, codeFrame };
}
