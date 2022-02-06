import * as Ajv from 'ajv'
import { prettify } from '../../'
import { prettifyTryStyled } from 'awesome-ajv-errors/dist/index-try-styled.js'


const div1 = document.createElement( 'div' );
div1.id = 'div1';
const div2 = document.createElement( 'div' );
div2.id = 'div2';

document.documentElement.appendChild( div1 );
document.documentElement.appendChild( div2 );


const schema = {
	title: "Second-level two similar properties",
	type: "object",
	properties: {
		foo: {
			type: "object",
			properties: {
				bar: {},
				bak: {},
			},
			additionalProperties: false,
		}
	}
};

const ajv = new Ajv( { allErrors: true } );

const validate = ajv.compile( schema );

const data = {
	foo: {
		bar: "42",
		baz: "33",
	}
};

validate( data );

async function printResult( )
{
	const prettyOutput = prettify( validate, { data, colors: true } );

	console.log( 'START unstyled' );
	console.log( prettyOutput );
	console.log( 'END unstyled' );

	div1.innerHTML = `Result:\n${prettyOutput}`;


	const prettyOutputStyled =
		await prettifyTryStyled(
			validate,
			{ data, colors: true, location: true }
		);

	console.log( 'START styled' );
	console.log( prettyOutputStyled );
	console.log( 'END styled' );

	div2.innerHTML = `Result:\n${prettyOutputStyled}`;
}

printResult( );
