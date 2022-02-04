import { getTypedValue } from "../types.js"
import { enquote } from "../util.js"
import type { DataPath } from "../data-path.js"

import type { ManagerOptions, StyleManager } from "./interface.js"


export function makeManager(
	{ support, style, terminalLink }: ManagerOptions
)
: StyleManager
{
	type SM = StyleManager;

	const link: SM[ 'link' ] = ( title, url ) =>
	{
		return terminalLink( style.link( title ), url );
	};

	const ensureColorUsage: SM[ 'ensureColorUsage' ] = useColors =>
	{
		return useColors == null ? support : useColors;
	};

	const formatDataPath: SM[ 'formatDataPath' ] = ( dataPath ) =>
	{
		return dataPath.path
			.map( ( { key, type } ) =>
				type === 'number'
				?
					style.operator( '[' ) +
					style.number( key ) +
					style.operator( ']' )
				:
					style.operator( '.' ) +
					style.string( key )
			)
			.join( '' );
	};

	const pathDescription: SM[ 'pathDescription' ] = ( context, pathType ) =>
	{
		const { dataPath } = context;

		if ( dataPath.path.length === 0 )
			return [ '', style.expr( "root object" ), '' ];

		const humanify = ( dataPath: DataPath ): [ string, string, string ] =>
			dataPath.path.length === 1
			? [ '', formatDataPath( dataPath, context ), ` ${pathType}` ]
			: [ `${pathType} at `, formatDataPath( dataPath, context ), '' ];

		return humanify( dataPath );
	};

	const printEnum: SM[ 'printEnum' ] =
		( lines, { indent = 0, bullet = true } = { } ) =>
	{
		const prefix = indent === 0 ? '' : ' '.repeat( indent );
		const bulletChar = bullet ? '∙ ' : '';
		return lines.map( line => `${prefix}    ${bulletChar}${line}` );
	};

	const printError: SM[ 'printError' ] = result =>
	{
		return result.title + "\n\n" + result.codeFrame;
	};

	const formatTypedValue: SM[ 'formatTypedValue' ] =
		( typedValue, { untyped = false, includeType = false } = { } ) =>
	{
		const type = typedValue.type;
		const value = `${typedValue.value}`;

		const styledValue =
			type === 'string'
			? untyped
				? style.pathDescription( value )
				: style.string( enquote( value ) )
			: type === 'number'
			? style.number( value )
			: style.primitive( value );

		if ( !includeType && typedValue.isSimple )
			return styledValue;

		return styledValue +
			style.title( ' (as ' ) +
			style.pathDescription( type ) +
			style.title( ')' );
	};

	const formatValue: SM[ 'formatValue' ] = ( value, opts ) =>
	{
		return formatTypedValue(
			getTypedValue( value ),
			opts
		);
	};

	return {
		support,
		style,
		link,
		ensureColorUsage,
		formatDataPath,
		pathDescription,
		printEnum,
		printError,
		formatTypedValue,
		formatValue,
	};
}
