import { codeFrameColumns } from '@babel/code-frame'
import { getLocation } from 'jsonpos'

import type { PrintCode } from './types'


export const printCode: PrintCode =
	(
		message,
		parsedJson,
		{
			dataPath,
			markIdentifier,
			linesAbove = 5,
			linesBelow = 3,
			colors,
		}
	) =>
{
	const { start, end } =
		getLocation( parsedJson, { dataPath, markIdentifier } );

	if ( !start )
		return `{The path ${dataPath} cannot be found in json}`;

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
