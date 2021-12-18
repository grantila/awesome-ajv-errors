import * as pointer from 'jsonpointer'

import { PrettifyContext } from './types.js'


export function getValueByPath(
	context: PrettifyContext,
	path = context.dataPath.dotOnly
): any
{
	if ( context.data === null || typeof context.data !== 'object' )
		return context.data;
	return pointer.get( context.data, path.replace( /\./g, '/' ) );
}
