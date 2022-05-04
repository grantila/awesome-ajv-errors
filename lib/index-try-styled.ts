import { managerOptions } from './style/style-plain.js'
import { printCode } from './code/impl-none.js'
import { makePrettify, Prettify } from './prettification.js'


export const styledPrettify = ( async ( ) =>
{
	const [
		style,
		code,
	] = await Promise.all( [
		import( './style/style-ansi.js' )
			.catch( err => ( { managerOptions } ) ),
		import( './code/impl-code-frame.js' )
			.catch( err => ( { printCode } ) ),
	] );

	return makePrettify( style.managerOptions, code.printCode, 'browser' );
} )( );

export const prettifyTryStyled: Prettify< Promise< string > > =
	async ( a, b? ) =>
	{
		return ( await styledPrettify )(
			...[ a, b ] as Parameters< Prettify< string > >
		);
	}
