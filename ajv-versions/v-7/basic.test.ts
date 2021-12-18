import _Ajv from 'ajv'
import addFormats from 'ajv-formats'

import { setupTests } from '../../lib/test/test-prettification.js'
import { getTestData } from '../../lib/test/iterate-test-data.js'


const Ajv = ( _Ajv as any ).default as typeof _Ajv;

const { ajv, files } = await getTestData( Ajv as any );
addFormats( ajv as any );

describe( "prettifications", ( ) =>
{
	setupTests( ajv, files );
} );
