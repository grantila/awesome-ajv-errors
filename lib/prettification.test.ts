import Ajv from 'ajv'

import { prettify } from './index-node.js'
import { setupTests } from './test/test-prettification.js'
import { getTestData } from './test/iterate-test-data.js'

const { ajv, files } = await getTestData( Ajv );

describe( 'prettifications', ( ) =>
{
	setupTests( ajv, files );
} );

describe( 'special cases', ( ) =>
{
	test( 'undefined value', ( ) =>
	{
		const schema = {
			type: 'object',
			properties: { foo: { type: 'string', const: 'bar' } }
		};

		const validate = ajv.compile( schema );
		const data = undefined;

		expect( validate( data ) ).toBe( false );
		const msg = prettify( validate, { data: data } );
		expect( msg.replace( /\n/g, '' ) ).toMatch(
			/.*The type .* should be object.*undefined.*Replace.*/
		);
	} );
} );
