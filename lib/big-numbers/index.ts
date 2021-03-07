import { font } from './font'


export interface PrintAsPrefixOpts
{
	separator?: string;
	fill?: ' ' | 0;
}

export interface PreparedText
{
	/**
	 * The width in terms of number of numbers (123 is 3 numbers wide).
	 * Will be -1 if prepareText wasn't configured with a maximum width.
	 */
	numberWidth: number;

	/**
	 * The width in terms of characters/bytes to print on screen.
	 * Will be -1 if prepareText wasn't configured with a maximum width.
	 */
	charWidth: number

	/**
	 * A pure whitespace-only line of length charWidth
	 */
	emptyLine: string;

	/**
	 * Print a number and return the array of lines.
	 *
	 * If the number is not provided (or is undefined), pure whitespace is
	 * returned.
	 *
	 * @param num The number to print.
	 */
	print( num?: number, fill?: ' ' | 0 ): Array< string >;

	printAsPrefix(
		num: number,
		mainLines: Array< string >,
		opts?: PrintAsPrefixOpts
	): Array< string >;
}

export type PrepareTextArg =
	| { maxNumber: number; maxWidth?: never; }
	| { maxNumber?: never; maxWidth: number; };

const getWidth = ( num: number ) => `${~~num}`.length;

const whiteSpacePerChar = ' '.repeat( font.width );

export function prepareText( arg?: PrepareTextArg ): PreparedText
{
	const numberWidth =
		arg == null
		? -1
		: typeof arg.maxNumber === 'number'
		? getWidth( arg.maxNumber )
		: arg.maxWidth as number;

		whiteSpacePerChar
	const charWidth = numberWidth * font.width;
	const emptyLine = ' '.repeat( charWidth );

	const prepareWhitespace = ( width: number ) =>
	{
		if ( width > numberWidth )
			throw new Error( "Too wide text" );

		return whiteSpacePerChar.repeat( numberWidth - width );
	};

	function print( num?: number, fill: ' ' | 0 = ' ' ): Array< string >
	{
		num = num == null ? undefined : ~~num;
		const numAsString =
			num == null
			? fill === 0
				? numberWidth === -1
					? undefined
					: Array( numberWidth ).fill( '0' ).join( '' )
				: `${num}`
			: fill === 0
				? Array( numberWidth - getWidth( num ) ).fill( '0' ).join( '' )
					+ num
				: `${num}`;

		const whitespace =
			numberWidth === -1
			? ''
			: prepareWhitespace(
				numAsString == null
				? 0
				: numAsString.length
			);

		if ( numAsString == null )
			return Array( font.height ).fill( whitespace );

		const charLines = numAsString
			.split( '' )
			.map( char => font.number[ Number(char) ] );

		// Transpose line-by-line number-by-number
		const lines = Array.from( { length: font.height }, ( _, i ) => i )
			.map( ( lineNo ) =>
				whitespace +
				charLines
					.map( char => char.filter( ( _, i ) => i === lineNo ) )
					.join( '' )
			);

		return lines;
	}

	function printAsPrefix(
		num: number,
		mainLines: Array< string >,
		opts: PrintAsPrefixOpts = { }
	): Array< string >
	{
		const { fill, separator = '' } = opts;
		const col1 = print( num, fill );

		const maxHeight = Math.max( col1.length, mainLines.length );

		return Array.from( { length: maxHeight } ).map( ( _, line ) =>
		{
			const prefix = col1.length <= line
				? emptyLine
				: col1[ line ];

			const main = mainLines.length <= line
				? ''
				: mainLines[ line ];

			return prefix + separator + main;
		} );
	}

	return {
		numberWidth,
		charWidth,
		emptyLine,
		print,
		printAsPrefix,
	}
}
