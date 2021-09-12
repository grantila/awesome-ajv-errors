import { DataPath } from "./data-path"

export function getPossibleProperties( schema: any, identifiedPath: DataPath )
: Array< string > | undefined
{
	let cur = schema;
	for ( const part of identifiedPath.path )
	{
		if ( !cur.properties || ( cur.type && cur.type !== 'object' ) )
			return undefined;

		if ( part.type === 'number' )
			cur = cur.items[ Number( part.key ) ];
		else
			cur = cur.properties[ part.key ];
	}

	if ( cur && typeof cur.properties === 'object' )
		return Object.keys( cur.properties );
	return undefined;
}
