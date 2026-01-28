/**
 * Message resource module - exports descriptions and operations
 */

import type { INodeProperties } from 'n8n-workflow'
import { messageOperations, phoneNumberField } from './Message.resource'
import {
	messageTypeField,
	textMessageFields,
	mediaMessageFields,
	locationFields,
	contactFields,
	listFields,
	flowsFields,
	genericCardFields,
	productFields,
	productListFields,
	templateFields,
} from '../../descriptions/MessageDescription'

import * as send from './send.operation'
import * as sendTemplate from './sendTemplate.operation'

/**
 * All descriptions for the Message resource
 */
export const descriptions: INodeProperties[] = [
	messageOperations,
	phoneNumberField,
	messageTypeField,
	...textMessageFields,
	...mediaMessageFields,
	...locationFields,
	...contactFields,
	...listFields,
	...flowsFields,
	...genericCardFields,
	...productFields,
	...productListFields,
	...templateFields,
]

/**
 * Operations map
 */
export const operations = {
	send,
	sendTemplate,
}
