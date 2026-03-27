import type { INodeProperties } from 'n8n-workflow'

export const messageOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['message'] } },
	options: [
		{
			name: 'Send',
			value: 'send',
			description: 'Send a message (text, image, video, audio, file, location, contact, list, flows, etc.)',
			action: 'Send a message',
		},
		{
			name: 'Send Template',
			value: 'sendTemplate',
			description: 'Send a pre-approved HSM template message',
			action: 'Send a template message',
		},
	],
	default: 'send',
}

export const phoneNumberField: INodeProperties = {
	displayName: 'Recipient Phone Number',
	name: 'to',
	type: 'string',
	required: true,
	default: '',
	placeholder: '5511999999999',
	description: 'Phone number with country code (e.g., 5511999999999)',
	displayOptions: { show: { resource: ['message'] } },
}
