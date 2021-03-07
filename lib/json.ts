import * as pointer from 'jsonpointer'

import { PrettifyContext } from './types'


export function getValueByPath(
	context: PrettifyContext,
	path = context.dataPath.dotOnly
): any
{
	return pointer.get( context.data, path.replace( /\./g, '/' ) );
}