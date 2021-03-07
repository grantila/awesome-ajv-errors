import { prettify } from './prettification'
import { getTestData } from './test/iterate-test-data'


describe( "prettifications", ( ) =>
{
	const { ajv, files } = getTestData( );

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
} );
