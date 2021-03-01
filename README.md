[![npm version][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build status][build-image]][build-url]
[![coverage status][coverage-image]][coverage-url]
[![Language grade: JavaScript][lgtm-image]][lgtm-url]
[![Node.JS version][node-version]][node-url]


<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/logo.svg" width="100%" />

**awesome-ajv-errors** pretty-prints ajv errors

It has a gorgeous human-understandable output, predicts human errors and suggests fixes.


# Contents

 * [Examples](#examples)
 * [Usage](#usage)


# Examples

<!-- BEGIN EXAMPLES -->
## Similar property name

Suggest similar properties

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "Second-level two similar properties",
  "type": "object",
  "properties": {
    "foo": {
      "type": "object",
      "properties": {
        "bar": {},
        "bak": {}
      },
      "additionalProperties": false
    }
  }
}
```

`data.json`
```json
{
  "foo": {
    "bar": "42",
    "baz": "33"
  }
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/similar-property-name.svg" />

## Multiple similar property names

Suggests multiple valid property names

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "Second-level three similar properties",
  "type": "object",
  "properties": {
    "foo": {
      "type": "object",
      "properties": {
        "bar": {},
        "bak": {},
        "bam": {}
      },
      "additionalProperties": false
    }
  }
}
```

`data.json`
```json
{
  "foo": {
    "bar": "42",
    "baz": "33"
  }
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/multiple-similar-property-names.svg" />

## Type typo

Suggests the valid value type when mistaken

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "One option (number to string)",
  "type": "object",
  "properties": {
    "foo": {
      "anyOf": [
        {
          "type": "string"
        }
      ]
    }
  }
}
```

`data.json`
```json
{
  "foo": 42
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/type-typo.svg" />

## Type typo (reverse)

Suggests the valid value type when mistaken

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "One option (string to number)",
  "type": "object",
  "properties": {
    "foo": {
      "anyOf": [
        {
          "type": "number"
        }
      ]
    }
  }
}
```

`data.json`
```json
{
  "foo": "42"
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/type-typo--reverse-.svg" />

## Type typo (one much better option)

When the type mismatch, and one type is much "better" than the rest (as in probably the right solution), it will be suggested for conversion

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "Two options",
  "type": "object",
  "properties": {
    "foo": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "boolean"
        }
      ]
    }
  }
}
```

`data.json`
```json
{
  "foo": 42
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/type-typo--one-much-better-option-.svg" />

## Type typo (one much better option out of multiple)

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "Three options",
  "type": "object",
  "properties": {
    "foo": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

`data.json`
```json
{
  "foo": 42
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/type-typo--one-much-better-option-out-of-multiple-.svg" />

## Array too small

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "2 too few",
  "type": "object",
  "properties": {
    "foo": {
      "type": "array",
      "minItems": 3
    }
  }
}
```

`data.json`
```json
{
  "foo": [
    1
  ]
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/array-too-small.svg" />

## Number too big

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "Less than or equal to",
  "type": "object",
  "properties": {
    "foo": {
      "type": "number",
      "maximum": 17
    }
  }
}
```

`data.json`
```json
{
  "foo": 42
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/number-too-big.svg" />

## Not in enum set

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "One value of same type",
  "type": "object",
  "properties": {
    "foo": {
      "enum": [
        41
      ]
    }
  }
}
```

`data.json`
```json
{
  "foo": 42
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/not-in-enum-set.svg" />

## Almost in enum set (wrong convertible type)

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "Two options (one of different type)",
  "type": "object",
  "properties": {
    "foo": {
      "enum": [
        41,
        "42"
      ]
    }
  }
}
```

`data.json`
```json
{
  "foo": 42
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/almost-in-enum-set--wrong-convertible-type-.svg" />

## Almost in enum set (wrong convertible type), multiple options

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "Four options (one of different type)",
  "type": "object",
  "properties": {
    "foo": {
      "enum": [
        "falso",
        "other",
        "False",
        false
      ]
    }
  }
}
```

`data.json`
```json
{
  "foo": "false"
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/almost-in-enum-set--wrong-convertible-type---multiple-options.svg" />

## Invalid format (time)

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "time invalid",
  "type": "object",
  "properties": {
    "foo": {
      "type": "string",
      "format": "time"
    }
  }
}
```

`data.json`
```json
{
  "foo": "11:22:334"
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/invalid-format--time-.svg" />

## Invalid format (e-mail)

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "email invalid",
  "type": "object",
  "properties": {
    "foo": {
      "type": "string",
      "format": "email"
    }
  }
}
```

`data.json`
```json
{
  "foo": "quite@invalid@email.com"
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/invalid-format--e-mail-.svg" />

## if-then not satisfied

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "if-then on first-level object",
  "properties": {
    "foo": {
      "if": {
        "properties": {
          "firstName": {
            "const": true
          }
        }
      },
      "then": {
        "required": [
          "lastName"
        ]
      }
    }
  }
}
```

`data.json`
```json
{
  "foo": {
    "firstName": true
  }
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/if-then-not-satisfied.svg" />

## Multiple of

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "Multiple of",
  "type": "object",
  "properties": {
    "foo": {
      "type": "number",
      "multipleOf": 4
    }
  }
}
```

`data.json`
```json
{
  "foo": 17
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/multiple-of.svg" />

## Required property

<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

`schema.json`
```json
{
  "title": "Root-level required",
  "type": "object",
  "properties": {
    "foo": {}
  },
  "required": [
    "foo"
  ]
}
```

`data.json`
```json
{
  "bar": 42
}
```

</p>
</details>

<img src="https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/assets/examples/required-property.svg" />


<!-- END EXAMPLES -->

# Usage

Import the `ajv` package, and `prettify` from `awesome-ajv-errors`:

```ts
import * as Ajv from 'ajv'
import { prettify } from '../'
```

Create an ajv instance and validate objects:

```ts
const ajv = new Ajv( { allErrors: true } ); // allErrors is optional

let data, schema; // Get the JSON schema and the JSON data from somewhere

const validate = ajv.compile( schema );
validate( data );
```

Now, the validation error is stored on the `validate` function. Use `prettify` to pretty-print the errors, and provide the data so that awesome-ajv-errors can suggest fixes:

```ts
console.log( prettify( validate, { data } ) );
```


[npm-image]: https://img.shields.io/npm/v/awesome-ajv-errors.svg
[npm-url]: https://npmjs.org/package/awesome-ajv-errors
[downloads-image]: https://img.shields.io/npm/dm/awesome-ajv-errors.svg
[build-image]: https://img.shields.io/github/workflow/status/grantila/awesome-ajv-errors/Master.svg
[build-url]: https://github.com/grantila/awesome-ajv-errors/actions?query=workflow%3AMaster
[coverage-image]: https://coveralls.io/repos/github/grantila/awesome-ajv-errors/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/grantila/awesome-ajv-errors?branch=master
[lgtm-image]: https://img.shields.io/lgtm/grade/javascript/g/grantila/awesome-ajv-errors.svg?logo=lgtm&logoWidth=18
[lgtm-url]: https://lgtm.com/projects/g/grantila/awesome-ajv-errors/context:javascript
[node-version]: https://img.shields.io/node/v/awesome-ajv-errors
[node-url]: https://nodejs.org/en/
