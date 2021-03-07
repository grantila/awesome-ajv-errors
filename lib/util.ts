export function ensureArray< T >( t: T | ArrayLike< T > | null | undefined )
: Array< T >
{
	return t == null ? [ ] : Array.isArray( t ) ? [ ...t ] : [ t ];
}

export const enquote = ( text: string ) => `"${text}"`;

export function uniq< T >( values: Array< T >, keygen: ( t: T ) => string )
: Array< T >
{
	const cache = new Set< string >( );
	return values.filter( value =>
	{
		const key = keygen( value );
		if ( cache.has( key ) )
			return false;
		cache.add( key );
		return true;
	} );
}
