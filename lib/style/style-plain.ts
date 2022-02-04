import type { ManagerOptions, Style, TerminalLink } from "./interface.js"


const style: Style = {
	title: text => text,
	pathDescription: text => text,
	expr: text => text,
	type: text => text,
	string: text => text,
	number: text => text,
	primitive: text => text,
	dimmed: text => text,
	good: text => text,
	operator: text => text,
	link: text => text,
	regex: text => text,
};

const support = false;

const terminalLink: TerminalLink = ( text, url ) => `${text} (${url})`;

export const managerOptions: ManagerOptions = { support, terminalLink, style };
