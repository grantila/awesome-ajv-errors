import type Ajv from 'ajv'

process.env.FORCE_HYPERLINK = '1';

import { prettify } from '../index-default.js'
import type { JsonTestFile } from './iterate-test-data.js'


interface StyleOptions
{
	location: boolean | undefined;
	bigNumbers: boolean | undefined;
}

function styleSuffix( name: string, style: StyleOptions ): string
{
	const { location, bigNumbers } = style;

	const locationSuffix =
		location === undefined
		? ''
		: location ? ' (w/ location)' : ' (w/o location)';

	const bigNumbersSuffix =
		bigNumbers === undefined
		? ''
		: bigNumbers ? ' (w/ big numbers)' : ' (w/o big numbers)';

	return `${name}${locationSuffix}${bigNumbersSuffix}`;
}

const styles: Array< StyleOptions > = [
	{ location: undefined, bigNumbers: undefined },
	{ location: false, bigNumbers: undefined },
	{ location: undefined, bigNumbers: false },
	{ location: false, bigNumbers: false },
];

export function setupTests( ajv: Ajv.Ajv, files: JsonTestFile[ ] )
{
	for ( const { dir, tests } of files )
	{
		interface TestOptions
		{
			name: string;
			data: any;
			schema: any;
			style: StyleOptions;
			fail?: boolean;
		}

		const test = ( { name, data, schema, style, fail }: TestOptions ) =>
			it( name, ( ) =>
			{
				const validate = ajv.compile( schema );
				expect( validate( data ) ).toBe( !fail );

				if ( !fail )
					return;

				const { location, bigNumbers } = style;

				const prettyError = prettify(
					validate,
					{ data, location, bigNumbers }
				);

				if ( process.env.DEBUG )
				{
					console.log( `Test ${name}` );
					console.log( prettyError );
				}

				expect( prettyError ).toMatchSnapshot( );
			} );

		const testName = ( name: string, schema: any ) =>
			schema.title ? `${name}: ${schema.title}` : name;

		if( tests.length > 0 )
			styles.forEach( style =>
				describe( styleSuffix( dir, style ), ( ) =>
				{
					for ( let i = 0; i < tests.length; ++i )
					{
						const { data, schema, fail } = tests[ i ];
						const testNo = `${i + 1}/${tests.length}`;
						test( {
							name: testName( testNo, schema ),
							data,
							schema,
							style,
							fail: fail ?? true,
						} );
					}
				} )
			);
		else
			styles.forEach( style =>
				test( {
					name: styleSuffix(
						testName( dir, tests[ 0 ].schema ),
						style
					),
					data: tests[ 0 ].data,
					schema: tests[ 0 ].schema,
					style,
					fail: tests[ 0 ].fail ?? true,
				} )
			);
	}

	describe( "simple types", ( ) =>
	{
		const tests: Array<{ data: any; type: string }> = [
			{ type: 'string', data: 42 },
			{ type: 'string', data: false },
			{ type: 'string', data: null },
			{ type: 'string', data: { foo: 'bar' } },
			{ type: 'number', data: "42" },
			{ type: 'number', data: true },
			{ type: 'number', data: null },
			{ type: 'number', data: { foo: 'bar' } },
			{ type: 'boolean', data: 42 },
			{ type: 'boolean', data: "false" },
			{ type: 'boolean', data: null },
			{ type: 'boolean', data: { foo: 'bar' } },
			{ type: 'null', data: 42 },
			{ type: 'null', data: "null" },
			{ type: 'null', data: false },
			{ type: 'null', data: { foo: 'bar' } },
		];

		for ( const { type, data } of tests )
			it( `should handle ${type} and data = ${data}`, ( ) =>
			{
				const validate = ajv.compile( { type } );
				expect( validate( data ) ).toBe( false );

				const prettyError = prettify( validate, { data } );
				expect( prettyError ).toMatchSnapshot( );
			} );
	} );
}
