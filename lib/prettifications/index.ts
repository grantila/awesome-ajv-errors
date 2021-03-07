import { CustomPrettify } from "../types"

import { prettify as unknownError } from "./unknown-error"
import { prettify as additionalProperties } from "./additional-properties"
import { prettify as anyOf } from "./any-of"
import { prettify as arraySize } from "./array-size"
import { prettify as comparison } from "./comparison"
import { prettify as _enum } from "./enum"
import { prettify as format } from "./format"
import { prettify as ifThenElse } from "./if-then-else"
import { prettify as multipleOf } from "./multiple-of"
import { prettify as pattern } from "./pattern"
import { prettify as required } from "./required"
import { prettify as stringSize } from "./string-size"
import { prettify as type } from "./type"
import { prettify as unique } from "./unique"


const allHandlers = {
	unknownError,
	additionalProperties,
	anyOf,
	not: anyOf,
	maxItems: arraySize,
	minItems: arraySize,
	maximum: comparison,
	exclusiveMaximum: comparison,
	minimum: comparison,
	exclusiveMinimum: comparison,
	const: _enum,
	enum: _enum,
	format,
	if: ifThenElse,
	multipleOf,
	pattern,
	required,
	maxLength: stringSize,
	minLength: stringSize,
	type,
	uniqueItems: unique,
};

export type Handlers =
	{ [ keyword in keyof typeof allHandlers ]: CustomPrettify };
export const handlers: Handlers = allHandlers;
