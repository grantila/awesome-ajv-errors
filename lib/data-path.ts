import { parsePath } from 'jsonpos'

import { ValidationError } from "./types.js"


export interface DataPathItem
{
	key: string;
	type: 'string' | 'number';
}

export interface DataPath
{
	path: Array< DataPathItem >;
	simplePath: Array< string >;
}

export function parseDataPath( error: ValidationError ): DataPath
{
	// Ajv 6 and 7 differ. In 6 the dataPath separator is `.`, in 7 it's `/`.
	// The dot-form may also use brackets: ['foo'].bar for /foo/bar
	// Since Ajv 8, it's called "instancePath"

	if ( !( error.dataPath ?? ( error as any ).instancePath ) )
		return { path: [ ], simplePath: [ ] };

	const isDotPath = ( path: string ) =>
		path.charAt( 0 ) === '.' || path.charAt( 0 ) === '[';

	const value =
		!!( error as any ).instancePath
		? parsePath( { pointerPath: ( error as any ).instancePath } )
		: isDotPath( error.dataPath )
		? parsePath( { dotPath: error.dataPath } )
		: parsePath( { pointerPath: error.dataPath } );

	const path =
		value
		.map( ( entry ): DataPathItem =>
			typeof entry === 'number'
			? ( { key: `${entry}`, type: 'number' } )
			: ( { key: entry, type: 'string' } )
		)
		.filter( val => val.key !== '' );

	const simplePath = path.map( ( { key } ) => key );

	return { path, simplePath };
}
