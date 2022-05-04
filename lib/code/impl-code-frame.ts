import { codeFrameColumns } from 'awesome-code-frame'
import { getLocation } from 'jsonpos'

import type { PrintCode } from './types'


export const printCode: PrintCode =
	(
		message,
		parsedJson,
		{
			path,
			markIdentifier,
			linesAbove = 5,
			linesBelow = 3,
			colors,
		}
	) =>
{
	const { start, end } = getLocation( parsedJson, { path, markIdentifier } );

	if ( !start )
		return `{The path ${path} cannot be found in json}`;

	return codeFrameColumns(
		parsedJson.jsonString,
		{ start, end },
		{
			highlightCode: colors,
			message,
			linesAbove,
			linesBelow,
		}
	);
}
