import type { LocationOptions, ParsedJson } from 'jsonpos'

export interface CodeOptions extends LocationOptions {
	linesAbove?: number;
	linesBelow?: number;
	colors?: boolean;
}

export type PrintCode =
	(
		message: string | undefined,
		parsedJson: ParsedJson,
		options: CodeOptions
	) => string;

export function makePrintCode(
	enabled: boolean,
	colors: boolean | undefined,
	printCode: PrintCode
)
: PrintCode
{
	return ( message, parsedJson, options ) =>
		!enabled
		? ''
		: printCode( message, parsedJson, { colors, ...options } );
}
