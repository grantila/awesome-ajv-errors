import { spawnSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import * as path from 'path'

import tempWrite from 'temp-write'

import { getTestData, JsonTest } from '../lib/test/iterate-test-data'


const tempWriteSync = tempWrite.sync;

const gitHubImageBaseUrl =
	'https://raw.githubusercontent.com/grantila/awesome-ajv-errors/master/';

const relToRoot = ( ...paths: Array< string > ) =>
	path.normalize( path.join( __dirname, '..', ...paths ) );

const assetsExamplesDir = relToRoot( 'assets', 'examples' );

async function takeTerminalShots( )
{
	const { files } = await getTestData( );

	let totMarkdown = '';

	for ( const { dir, tests } of files )
	{
		let dirMarkdown = '';
		for ( const test of tests )
		{
			if ( test.example )
			{
				const md = handleTest( dir, test );
				dirMarkdown += md;
			}
		}
		if ( dirMarkdown )
			totMarkdown += dirMarkdown;
	}
	/*
	<!-- BEGIN EXAMPLES -->

	<!-- END EXAMPLES -->
	*/
	const markdownBefore = readFileSync( './README.md', 'utf8' );

	const markdownBeforeLines = markdownBefore.split( "\n" );
	const iBefore = markdownBeforeLines
		.findIndex( line => line.includes( "BEGIN EXAMPLES" ) );
	const iAfter = markdownBeforeLines
		.findIndex( line => line.includes( "END EXAMPLES" ) );

	const markdownAfter = [
		...markdownBeforeLines.slice( 0, iBefore + 1 ),
		...totMarkdown.split( "\n" ),
		...markdownBeforeLines.slice( iAfter ),
	]
	.join( "\n" );

	writeFileSync( "./README.md", markdownAfter, 'utf8' );
}

await takeTerminalShots( );

function recordTerminal( schemaFile: string, dataFile: string, imageFile: string )
{
	const program = relToRoot( 'scripts', 'record-error.ts' );
	spawnSync(
		"termtosvg",
		[
			'-c',
			`node_modules/.bin/ts-node ${program} ${schemaFile} ${dataFile}`,
			'-g',
			'100x40',
			imageFile
		],
		{
			stdio: [ 'inherit', 'inherit', 'inherit' ],
		}
	);
}

function handleTest( dir: string, test: JsonTest )
{
	console.log( "Making test in", dir );
	const schemaFile = writeTempJson( 'schema.json', test.schema );
	const dataFile = writeTempJson( 'data.json', test.data );
	const title = test.example?.title ?? test.schema.title;
	const description = test.example?.description;
	const outputFile = title
		.replace( /[^a-zA-Z0-9]/g, '-' )
		.toLowerCase( );

	if ( !outputFile )
		throw new Error( `Test in ${dir} has missing schema title` );

	const svgFile = `${assetsExamplesDir}/${outputFile}.svg`;
	recordTerminal( schemaFile, dataFile, svgFile );

	fixSvgFile( svgFile );

	const imageFilename = path.relative( relToRoot( ), svgFile );

	const imageTag =
		process.env.LOCAL
		? `<img src="${imageFilename}" />`
		: `<img src="${gitHubImageBaseUrl}${imageFilename}" />`;

	return `## ${title}
${description && ( "\n" + description + "\n" ) || ''}
<details style="padding-left: 32px;border-left: 4px solid gray;">
<summary>JSON Schema and data</summary>
<p>

\`schema.json\`
\`\`\`json
${stringify(test.schema)}
\`\`\`

\`data.json\`
\`\`\`json
${stringify(test.data)}
\`\`\`

</p>
</details>

${imageTag}

`;
}

function writeTempJson( file: string, data: any )
{
	return tempWriteSync( stringify( data ), file );

}

function stringify( data: any )
{
	return JSON.stringify( data, null, 2 );
}

function fixSvgFile( svgFile: string )
{
	const svg = readFileSync( svgFile, 'utf8' );

	const lines = svg.split( "\n" );

	const height = findSvgHeight( svg );

	const data = lines
		.map( line => rewriteHeight( line, height ) )
		.map( line => rewriteColors( line ) )
		.join( "\n" );

	writeFileSync( svgFile, data, 'utf8' );
}

function rewriteHeight( line: string, height: number ): string
{
	const re1 = /^(.*)height="([^"]+)"(.*)viewBox="([^ "]+) ([^ "]+) ([^ "]+) ([^ "]+)"(.*)$/;
	const re2 = /^(.*)viewBox="([^ "]+) ([^ "]+) ([^ "]+) ([^ "]+)"(.*)$/;

	const m1 = line.match( re1 );
	if ( m1 )
		return `${m1[1]}height="${height}"${m1[3]}viewBox="${m1[4]} ${m1[5]} ${m1[6]} ${height}"${m1[8]}`;

	const m2 = line.match( re2 );
	if ( m2 )
		return `${m2[1]}viewBox="${m2[2]} ${m2[3]} ${m2[4]} ${height}"${m2[6]}`;

	return line;
}

function rewriteColors( line: string ): string
{
	const regexes: Array< [ RegExp, string ] > = [
		[ /^(.*\.background \{fill: )(.*)(;}.*)$/, '#323232' ],
		[ /^(.*\.color4 \{fill: )(.*)(;}.*)$/, '#608aff' ],
		[ /^(.*\.color5 \{fill: )(.*)(;}.*)$/, '#c02ec5' ],
		[ /^(.*\.color13 \{fill: )(.*)(;}.*)$/, '#c02ec5' ],
		[ /^(.*\.color9 \{fill: )(.*)(;}.*)$/, '#e76d48' ],
	];

	for ( const [ re, color ] of regexes )
	{
		const m = line.match( re );
		if ( m )
			return `${m[1]}${color}${m[3]}`;
	}
	return line;
}

function findSvgHeight( svg: string )
{
	let m: RegExpExecArray | null = null;
	let y = 0;
	const svgAsOneLiner = svg.replace( /\n/g, '' );
	const reIter = /<use xlink:href="[^"]*" y="([^"]+)"/g;
	const reY = /<use xlink:href="[^"]*" y="([^"]+)"/;

	while ( m = reIter.exec( svgAsOneLiner ) )
	{
		const match = m[ 0 ].match( reY );
		y = Math.max( y, parseInt( match![ 1 ], 10 ) );
	}

	return y;
}
