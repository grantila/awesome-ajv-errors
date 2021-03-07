import { codeFrameColumns } from '@babel/code-frame'
import { LocationOptions, ParsedJson, getLocation } from 'jsonpos'


export interface CodeOptions extends LocationOptions {
	linesAbove?: number
	linesBelow?: number
}

export function printCode(
	message: string | undefined,
	parsedJson: ParsedJson,
	{
		dataPath,
		markIdentifier,
		linesAbove = 5,
		linesBelow = 3,
	}: CodeOptions
)
{
	const { start, end } =
		getLocation( parsedJson, { dataPath, markIdentifier } );

	if ( !start )
		return `{The path ${dataPath} cannot be found in json}`;

	return codeFrameColumns(
		parsedJson.jsonString,
		{ start, end },
		{
			highlightCode: true,
			message,
			linesAbove,
			linesBelow,
		}
	);
}
