import { fileURLToPath } from 'node:url'
import path from 'node:path'

import puppeteer from 'puppeteer'

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const pagePath =
	path.normalize( path.resolve( __dirname, '../dist/index.html' ) );


const expectedText =
	'The .foo object should not have the property baz, ' +
	'did you mean bar or bak?';

const expectedStyled = `
  1 | {
  2 |   "foo": {
  3 |     "bar": "42",
> 4 |     "baz": "33"
    |     ^^^^^ remove or rename "baz"
  5 |   }
  6 | }`;

const expectSame = ( testName, got, expected ) =>
{
	if ( got.trim( ) !== expected )
	{
		console.error( `Test "${testName}" failed!` );
		console.error( `text = [${got}]` );
		console.error( `expected = [${expected}]` );
		throw new Error( 'webpack test failed' );
	}
};

( async ( ) =>
{
	const browser = await puppeteer.launch( );
	const page = await browser.newPage( );

	const consoleLogs = [ ];
	page.on(
		'console',
		msg =>
			{
				if ( msg.type( ) === 'log' )
					consoleLogs.push( msg.text( ) );
			}
	);

	await page.goto( `file://${pagePath}` );

	const text1 = await page.$eval( '#div1', page => page.innerHTML );
	const text2 = await page.$eval( '#div2', page => page.innerHTML );

	await browser.close( );

	expectSame( 'unstyled html', text1.trim( ), `Result:\n${expectedText}` );
	expectSame(
		'styled html',
		text2.trim( ),
		`Result:\n${expectedText}\n${htmlify(expectedStyled)}`
	);

	const unstyled = between( consoleLogs, 'START unstyled', 'END unstyled' );
	const styled = between( consoleLogs, 'START styled', 'END styled' );

	expectSame( 'unstyled console', unstyled.join( '' ), expectedText );
	expectSame(
		'styled console',
		styled.join( '' ),
		`${expectedText}\n${expectedStyled}`
	);
} )( );

function between( arr, start, end )
{
	return arr.slice(
		arr.findIndex( text => text === start ) + 1,
		arr.findIndex( text => text === end )
	);
}

function htmlify( text )
{
	return text.replace( />/g, '&gt;' );
}
