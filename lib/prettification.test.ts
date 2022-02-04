import Ajv from "ajv"

import { setupTests } from "./test/test-prettification.js"
import { getTestData } from "./test/iterate-test-data.js"


const { ajv, files } = await getTestData( Ajv );

describe( "prettifications", ( ) =>
{
	setupTests( ajv, files );
} );
