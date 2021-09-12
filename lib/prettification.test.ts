import { prettify } from './prettification'
import { getTestData } from './test/iterate-test-data'


const { ajv, files } = await getTestData( );

describe( "prettifications", ( ) =>
{
	for ( const { dir, tests } of files )
	{
		const test = ( name: string, data: any, schema: any, fail = true ) =>
			it( name, ( ) =>
			{
				const validate = ajv.compile( schema );
				expect( validate( data ) ).toBe( !fail );

				if ( !fail )
					return;

				const prettyError = prettify( validate, { data } );

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
			describe( dir, ( ) =>
			{
				for ( let i = 0; i < tests.length; ++i )
				{
					const { data, schema, fail } = tests[ i ];
					test(
						testName( `${i + 1}/${tests.length}`, schema ),
						data,
						schema,
						fail
					);
				}
			} );
		else
			test(
				testName( dir, tests[ 0 ].schema ),
				tests[ 0 ].data,
				tests[ 0 ].schema,
				tests[ 0 ].fail
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
} );
