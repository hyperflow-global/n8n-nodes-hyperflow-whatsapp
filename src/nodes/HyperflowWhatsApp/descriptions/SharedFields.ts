import type { INodeProperties } from 'n8n-workflow'

export const phoneNumberField: INodeProperties = {
	displayName: 'Recipient Phone Number',
	name: 'to',
	type: 'string',
	required: true,
	default: '',
	placeholder: '5511999999999',
	description: 'Phone number with country code (e.g., 5511999999999)',
}

export const footerField: INodeProperties = {
	displayName: 'Footer',
	name: 'footer',
	type: 'string',
	default: '',
	description: 'Optional footer text',
}

export const includeButtonsField: INodeProperties = {
	displayName: 'Include Buttons',
	name: 'includeButtons',
	type: 'boolean',
	default: false,
	description: 'Whether to include interactive buttons',
}

export const buttonsField: INodeProperties = {
	displayName: 'Buttons',
	name: 'buttons',
	placeholder: 'Add Button',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
		maxValue: 3,
	},
	default: {},
	options: [
		{
			name: 'buttonValues',
			displayName: 'Button',
			values: [
				{
					displayName: 'Type',
					name: 'type',
					type: 'options',
					options: [
						{ name: 'Postback', value: 'postback' },
						{ name: 'URL', value: 'url' },
						{ name: 'Voice Call', value: 'voice_call' },
					],
					default: 'postback',
				},
				{
					displayName: 'Button ID',
					name: 'id',
					type: 'string',
					default: '',
					description: 'Unique identifier for the button',
				},
				{
					displayName: 'Label',
					name: 'label',
					type: 'string',
					default: '',
					description: 'Button text displayed to user',
				},
				{
					displayName: 'URL',
					name: 'url',
					type: 'string',
					default: '',
					displayOptions: {
						show: {
							type: ['url'],
						},
					},
					description: 'URL to open when button is clicked',
				},
				{
					displayName: 'Postback Data (JSON)',
					name: 'data',
					type: 'json',
					default: '{}',
					displayOptions: {
						show: {
							type: ['postback'],
						},
					},
					description: 'Data sent back when button is clicked',
				},
				{
					displayName: 'TTL Minutes',
					name: 'ttlMinutes',
					type: 'number',
					default: 60,
					displayOptions: {
						show: {
							type: ['voice_call'],
						},
					},
					description: 'Time to live in minutes for voice call button',
				},
			],
		},
	],
}
