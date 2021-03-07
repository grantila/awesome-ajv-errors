import { readdirSync, existsSync } from 'fs'
import * as path from 'path'

import * as Ajv from 'ajv'

import { prettify } from '../prettification'
import { ensureArray } from '../util'


export interface JsonTest
{
	schema: any;
	data: any;
	fail?: boolean;
	example?: {
		title?: string;
		description?: string;
	}
}

export interface JsonTestFile
{
	tests: Array< JsonTest >;
	dir: string;
}

export interface TestData
{
	files: Array< JsonTestFile >;
	ajv: Ajv.Ajv;
}

const prettificationsDir = path.join( __dirname, '..', 'prettifications' );

export function getTestData( ): TestData
{
	const dirs =
		readdirSync( prettificationsDir, { withFileTypes: true } )
		.filter( dirent => dirent.isDirectory( ) )
		.map( dirent => dirent.name )
		.sort( );

	const ajv = new Ajv( { allErrors: true, validateSchema: true } );

	const validateTests = ajv.compile( {
		definitions: {
			testSchemaPair: {
				type: "object",
				properties: {
					schema: {
						$ref: "http://json-schema.org/draft-07/schema"
					},
					data: { type: "object" },
					fail: { type: "boolean" },
					example: { oneOf: [
						{ type: "boolean" },
						{
							type: "object",
							properties: {
								title: { type: "string" },
								description: { type: "string" },
							},
							additionalProperties: false,
						},
					] },
					exampleTitle: { type: "string" }
				},
				required: [ "schema", "data" ],
				additionalProperties: false
			},
		},
		oneOf: [
			{ $ref: "#/definitions/testSchemaPair" },
			{
				type: "array",
				items: { $ref: "#/definitions/testSchemaPair" }
			},
		]
	} );

	const files = dirs
		.map( ( dir ): JsonTestFile | undefined =>
		{
			const fullDirname = path.join( prettificationsDir, dir );
			const testFilename = path.join( fullDirname, 'test.json' );
			if ( !existsSync( testFilename ) )
				return;

			const testData = ensureArray( require( testFilename ) );

			const testsValid = validateTests( testData );
			if ( !testsValid )
			{
				let message = JSON.stringify( validateTests.errors, null, 4 );
				try
				{
					message = prettify( validateTests, { data: testData } );
				}
				catch ( err ) { }
				console.error( "The tests are incorrectly formatted!" );
				console.error( message );
			}

			const tests =
				ensureArray( testData )
				.map( test => ( {
					...test,
					...( test.example === true ? { example: { } } : { } ),
				} ) as JsonTest );

			return { tests, dir };
		} )
		.filter( < T >( t: T ): t is NonNullable< T > => !!t );

	return { ajv, files };
}
