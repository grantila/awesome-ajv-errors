import chalk from "chalk"
import terminalLink from "terminal-link"

import type { StyleContext, ManagerOptions, Style } from "./interface.js"


const {
	supportsColor,
	dim,
	red,
	blue,
	green,
	yellow,
	magenta,
	white,
} = chalk;

const styles = {
	title: red.bold,
	pathDescription: blue.italic,
	expr: white.italic,
	type: blue.bold,
	string: green,
	number: magenta,
	primitive: yellow,
	dimmed: dim,
	good: green,
	operator: white,
	link: blue,
	regex: magenta.italic
};

type InferredStyle = {
	[ key in keyof typeof styles ]:
		( text: string, context: StyleContext ) => string;
}

const style = { } as Style & InferredStyle;
for ( const key of Object.keys( styles ) )
	style[ key as keyof typeof style ] =
		( text: string ) =>
			styles[ key as keyof typeof style ]( text );

const support = Boolean( supportsColor && supportsColor.hasBasic );

export const managerOptions: ManagerOptions = { support, terminalLink, style };
