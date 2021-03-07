import { getError, PrettifyContext } from './types'

describe( "types", ( ) =>
{
	it( "getError", ( ) =>
	{
		const error = {
			keyword: 'test'
		};
		expect( getError( { error } as PrettifyContext ) ).toBe( error );
	} );
} );
