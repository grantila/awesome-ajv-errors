// These are taken from Ajv 6. They're gone in 8, but seems compatible, so to
// not depend on the _types_ from 6 when perhaps using later versions, they're
// copy-pasted here.


export interface TypeParams {
	type: string;
}


export type ErrorParameters = RefParams | LimitParams | AdditionalPropertiesParams |
	DependenciesParams | FormatParams | ComparisonParams |
	MultipleOfParams | PatternParams | RequiredParams |
	TypeParams | UniqueItemsParams | CustomParams |
	PatternRequiredParams | PropertyNamesParams |
	IfParams | SwitchParams | NoParams | EnumParams;

export interface RefParams {
	ref: string;
}

export interface LimitParams {
	limit: number;
}

export interface AdditionalPropertiesParams {
	additionalProperty: string;
}

export interface DependenciesParams {
	property: string;
	missingProperty: string;
	depsCount: number;
	deps: string;
}

export interface FormatParams {
	format: string
}

export interface ComparisonParams {
	comparison: string;
	limit: number | string;
	exclusive: boolean;
}

export interface MultipleOfParams {
	multipleOf: number;
}

export interface PatternParams {
	pattern: string;
}

export interface RequiredParams {
	missingProperty: string;
}

export interface TypeParams {
	type: string;
}

export interface UniqueItemsParams {
	i: number;
	j: number;
}

export interface CustomParams {
	keyword: string;
}

export interface PatternRequiredParams {
	missingPattern: string;
}

export interface PropertyNamesParams {
	propertyName: string;
}

export interface IfParams {
	failingKeyword: string;
}

export interface SwitchParams {
	caseIndex: number;
}

export interface NoParams { }

export interface EnumParams {
	allowedValues: Array<any>;
}

