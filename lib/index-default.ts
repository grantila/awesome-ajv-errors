import { managerOptions } from './style/style-ansi.js'
import { printCode } from './code/impl-code-frame.js'
import { makePrettify } from './prettification.js'

export const prettify = makePrettify( managerOptions, printCode, 'node' );
