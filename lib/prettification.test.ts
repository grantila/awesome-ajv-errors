import Ajv from 'ajv'

import { setupTests } from './test/test-prettification'
import { getTestData } from './test/iterate-test-data'


const { ajv, files } = await getTestData( Ajv );

describe( "prettifications", ( ) =>
{
	setupTests( ajv, files );
} );
