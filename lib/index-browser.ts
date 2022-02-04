import { managerOptions } from './style/style-plain.js'
import { printCode } from './code/impl-none.js'
import { makePrettify } from './prettification.js'

export const prettify = makePrettify( managerOptions, printCode );
