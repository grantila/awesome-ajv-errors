import { readFileSync } from 'fs'
import * as Ajv from 'ajv'
import { prettify } from '../'


function readFiles( )
{
	const [ schemaFile, dataFile ] = process.argv.slice( 2 );

	const schema = JSON.parse( readFileSync( schemaFile, 'utf8' ) );
	const data = JSON.parse( readFileSync( dataFile, 'utf8' ) );

	return { schema, data };
}

function runValidation( schema: any, data: any )
{
	const ajv = new Ajv( { allErrors: true } );

	const validate = ajv.compile( schema );
	validate( data );

	const prettyError = prettify( validate, { data } );
	console.log( prettyError );
}

const { schema, data } = readFiles( );
runValidation( schema, data );
