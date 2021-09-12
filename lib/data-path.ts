import { ValidationError } from "./types"


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

export function parseDataPath( error: ValidationError ): DataPath
{
	// Since Ajv 8, it's called "instancePath"
	const value: string = error.dataPath ?? ( error as any ).instancePath;

	if ( value === '' )
		return { orig: value, dotOnly: '.', path: [ ] };

	// Ajv 6 and 7 differ. In 6 the path separator is `.`, in 7 it's `/`.
	const sep = value.charAt( 0 );

	const path = ( [ ] as Array< DataPathItem > ).concat(
		...value
		.split( sep )
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
