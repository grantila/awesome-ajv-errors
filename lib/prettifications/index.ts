import { CustomPrettify } from "../types.js"

import { prettify as unknownError } from "./unknown-error/index.js"
import { prettify as additionalProperties } from "./additional-properties/index.js"
import { prettify as anyOf } from "./any-of/index.js"
import { prettify as arraySize } from "./array-size/index.js"
import { prettify as comparison } from "./comparison/index.js"
import { prettify as _enum } from "./enum/index.js"
import { prettify as format } from "./format/index.js"
import { prettify as ifThenElse } from "./if-then-else/index.js"
import { prettify as multipleOf } from "./multiple-of/index.js"
import { prettify as pattern } from "./pattern/index.js"
import { prettify as required } from "./required/index.js"
import { prettify as stringSize } from "./string-size/index.js"
import { prettify as type } from "./type/index.js"
import { prettify as unique } from "./unique/index.js"


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
