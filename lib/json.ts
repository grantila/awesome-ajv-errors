import * as pointer from 'jsonpointer'

import { PrettifyContext } from './types.js'


export function getValueByPath(
	context: PrettifyContext,
	path = context.dataPath.simplePath
): any
{
	if ( context.data === null || typeof context.data !== 'object' )
		return context.data;
	return pointer.get( context.data, encodeJsonPointerPath( path ) );
}

function encodeJsonPointerPath( path: Array< string > ): string
{
	return '/' +
		path
		.map( segment => encodeJsonPointerSegment( segment) )
		.join( '/' );
}

function encodeJsonPointerSegment( segment: string ): string
{
	return segment.replace( /~/g, '~0' ).replace( /\//g, '~1' );
}
