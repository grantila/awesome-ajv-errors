import type {
	PrettifyContext,
	PrettificationCore,
	PrettyResult,
	TypedValue,
	SimpleValueType,
} from "../types.js"
import type { DataPath } from "../data-path.js"


export type StyleFunctions =
	| 'title'
	| 'pathDescription'
	| 'expr'
	| 'type'
	| 'string'
	| 'number'
	| 'primitive'
	| 'dimmed'
	| 'good'
	| 'operator'
	| 'link'
	| 'regex';

export type Style = {
	[ key in StyleFunctions ]: ( text: string ) => string;
}

export type StyleContext = Omit<
	PrettifyContext,
	keyof PrettificationCore | 'error' | 'parsedJson'
>;

export interface PrintEnumOptions
{
	indent?: number;
	bullet?: boolean;
}

export interface FormatTypedValueOptions
{
	untyped?: boolean
	includeType?: boolean
}

export type TerminalLink = ( text: string, url: string ) => string;

export interface ManagerOptions
{
	support: boolean;
	terminalLink: TerminalLink;
	style: Style;
}

export interface StyleManager
{
	readonly support: boolean;

	style: Style;

	link( title: string, url: string ): string;

	ensureColorUsage( useColors?: boolean | undefined ): boolean;

	formatDataPath( dataPath: DataPath, context: PrettifyContext ): string;

	pathDescription(
		context: PrettifyContext,
		pathType: string
	): [ string, string, string ];

	printEnum(
		lines: Array< string >,
		options?: PrintEnumOptions
	): Array< string >;

	printError( result: PrettyResult ): string;

	formatTypedValue(
		typedValue: TypedValue,
		options?: FormatTypedValueOptions
	): string;

	formatValue(
		value: SimpleValueType,
		opts?: FormatTypedValueOptions
	): string;
}
