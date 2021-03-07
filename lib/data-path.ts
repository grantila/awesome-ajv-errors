
export interface DataPathItem
{
	key: string;
	type: 'string' | 'number';
}

export interface DataPath
{
	orig: string;
	dotOnly: string;
	path: Array< DataPathItem >;
}

export function parseDataPath( value: string ): DataPath
{
	const path = ( [ ] as Array< DataPathItem > ).concat(
		...value
		.split( '.' )
		.map( entry =>
			entry
				.split( /\[|\]/g )
				.map( ( key, index ): DataPathItem => ( {
					key,
					type: index === 0 ? 'string' : 'number'
				} ) )
		)
	)
	.filter( val => val.key !== '' );

	const dotOnly = '.' + path.map( ( { key } ) => key ).join( '.' );

	return { orig: value, dotOnly, path };
}
