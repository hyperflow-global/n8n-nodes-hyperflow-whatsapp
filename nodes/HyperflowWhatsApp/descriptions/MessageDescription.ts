import type { INodeProperties } from 'n8n-workflow'

export const messageTypeField: INodeProperties = {
	displayName: 'Message Type',
	name: 'messageType',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['message'],
			operation: ['send'],
		},
	},
	options: [
		{
			name: 'Text',
			value: 'text',
			description: 'Send a simple text message. Supports up to 4096 characters, with an optional footer and up to 3 interactive buttons.',
		},
		{
			name: 'Image',
			value: 'image',
			description: 'Send an image with an optional caption. Supported formats: JPEG, PNG. Maximum size: 5 MB. The URL must be public and accessible.',
		},
		{
			name: 'Video',
			value: 'video',
			description: 'Send a video with an optional caption. Supported formats: MP4, 3GPP. Maximum size: 16 MB. Video codec: H.264, audio codec: AAC.',
		},
		{
			name: 'Audio',
			value: 'audio',
			description: 'Send an audio file. Supported formats: MP3, OGG (with Opus codec), AMR. Maximum size: 16 MB.',
		},
		{
			name: 'File',
			value: 'file',
			description: 'Send a document/file. Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, etc. Maximum size: 100 MB.',
		},
		{
			name: 'Sticker',
			value: 'sticker',
			description: 'Send a sticker/figure. The image must be in WebP format with exactly 512x512 pixels. Maximum size: 100 KB for static stickers, 500 KB for animated stickers.',
		},
		{
			name: 'Location',
			value: 'location',
			description: 'Send a location on the map. Requires latitude and longitude in decimal format (e.g., -23.5505, -46.6333).',
		},
		{
			name: 'Contact',
			value: 'contact',
			description: 'Send a contact card (vCard). Includes name, phone with country code and optional email.',
		},
		{
			name: 'List',
			value: 'list',
			description: 'Send an interactive list with selectable sections and options. Maximum of 10 sections, each section with up to 10 items. The body text is required.',
		},
		{
			name: 'Flows',
			value: 'flows',
			description: 'Send an interactive WhatsApp Flow. Requires the registered flow ID or name on the platform. Supports passing initial data and draft mode.',
		},
		{
			name: 'Generic Card',
			value: 'generic',
			description: 'Send a generic card with image, title, subtitle and up to 3 interactive buttons. Ideal for displaying visual information with actions.',
		},
		{
			name: 'Product',
			value: 'product',
			description: 'Send a single product from the Facebook/Meta catalog. Requires the catalog ID and the SKU (retailer ID) of the product.',
		},
		{
			name: 'Product List',
			value: 'productList',
			description: 'Send a list of products organized by sections of the Facebook/Meta catalog. Allows displaying multiple products grouped by categories.',
		},
	],
	default: 'text',
}

export const textMessageFields: INodeProperties[] = [
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['text'],
			},
		},
		description: 'Content of the text message. Maximum of 4096 characters. Supports WhatsApp formatting: *bold*, _italic_, ~strikethrough~, ```monospace```.',
	},
	{
		displayName: 'Footer',
		name: 'footer',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['text', 'generic'],
				includeButtons: [true],
			},
		},
		description: 'Text displayed in the footer of the message, below the buttons. Maximum of 60 characters.',
	},
	{
		displayName: 'Footer',
		name: 'footer',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['list'],
			},
		},
		description: 'Text displayed in the footer of the list message. Maximum of 60 characters.',
	},
	{
		displayName: 'Include Buttons',
		name: 'includeButtons',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['text', 'generic'],
			},
		},
		description: 'Enable to add up to 3 interactive buttons to the message. Available types: Postback, URL and Voice Call.',
	},
	{
		displayName: 'Buttons',
		name: 'buttons',
		placeholder: 'Add Button',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			maxValue: 3,
		},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['text', 'generic'],
				includeButtons: [true],
			},
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
					description: 'Unique identifier of the button (used in the postback return). Maximum of 256 characters.',
				},
				{
					displayName: 'Label',
					name: 'label',
					type: 'string',
					default: '',
					description: 'Text displayed on the button for the user. Maximum of 20 characters.',
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
					description: 'URL that will be opened in the browser when the user clicks on the button. Must start with https://.',
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
					description: 'JSON data sent back to the webhook when the user clicks on the button. Useful to identify the chosen action.',
				},
				{
					displayName: 'TTL in Minutes',
					name: 'ttlMinutes',
					type: 'number',
					default: 60,
					displayOptions: {
						show: {
							type: ['voice_call'],
						},
					},
					description: 'Expiration time in minutes for the voice call button. After this time the button will be unavailable.',
				},
				],
			},
		],
	},
]

export const mediaMessageFields: INodeProperties[] = [
	{
		displayName: 'Media URL',
		name: 'mediaUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['image', 'video', 'audio', 'file', 'sticker'],
			},
		},
		description: 'Public and accessible URL of the media file. Limits by type: Image (JPEG/PNG, max 5 MB), Video (MP4/3GPP, max 16 MB), Audio (MP3/OGG/AMR, max 16 MB), File (max 100 KB), Sticker (WebP 512x512, max 100 KB static / 500 KB animated).',
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['image', 'video', 'file'],
			},
		},
		description: 'Text displayed alongside the media. Maximum of 1024 characters. Supports WhatsApp formatting (*bold*, _italic_, ~strikethrough~). Not available for audio and sticker.',
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['file'],
			},
		},
		description: 'Name of the file with extension that will be displayed to the recipient (e.g., report.pdf, spreadsheet.xlsx). If not provided, the name of the file from the URL will be used.',
	},
]

export const locationFields: INodeProperties[] = [
	{
		displayName: 'Latitude',
		name: 'latitude',
		type: 'string',
		required: true,
		default: '',
		placeholder: '-23.5505',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['location'],
			},
		},
		description: 'Latitude coordinate in decimal format (e.g., -23.5505 for São Paulo). Values between -90 and 90.',
	},
	{
		displayName: 'Longitude',
		name: 'longitude',
		type: 'string',
		required: true,
		default: '',
		placeholder: '-46.6333',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['location'],
			},
		},
		description: 'Longitude coordinate in decimal format (e.g., -46.6333 for São Paulo). Values between -180 and 180.',
	},
	{
		displayName: 'Location Name',
		name: 'locationName',
		type: 'string',
		default: '',
		placeholder: 'Hyperflow Office',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['location'],
			},
		},
		description: 'Name of the location displayed on the map (e.g., name of the establishment or reference point)',
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		default: '',
		placeholder: 'Paulista Avenue, 1000 - São Paulo, SP',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['location'],
			},
		},
		description: 'Complete address of the location displayed below the name on the map',
	},
]

export const contactFields: INodeProperties[] = [
	{
		displayName: 'Contact Name',
		name: 'contactName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'John Doe',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['contact'],
			},
		},
		description: 'Complete name of the contact that will be displayed on the vCard shared card',
	},
	{
		displayName: 'Contact Phone',
		name: 'contactPhone',
		type: 'string',
		required: true,
		default: '',
		placeholder: '11999999999',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['contact'],
			},
		},
		description: 'Phone number of the contact without the country code (e.g., 11999999999). The country code is defined in the separate field.',
	},
	{
		displayName: 'Contact Email',
		name: 'contactEmail',
		type: 'string',
		default: '',
		placeholder: 'john@email.com',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['contact'],
			},
		},
		description: 'Email address of the contact (optional). Will be included in the vCard.',
	},
	{
		displayName: 'Country Code',
		name: 'countryCode',
		type: 'string',
		default: '55',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['contact'],
			},
		},
		description: 'Country code for the phone number. Default: 55 (Brazil). Examples: 1 (USA), 351 (Portugal), 54 (Argentina).',
	},
]

export const listFields: INodeProperties[] = [
	{
		displayName: 'Body Text',
		name: 'listText',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['list'],
			},
		},
		description: 'Main text displayed in the body of the list message. Maximum of 1024 characters. This text appears before the button to open the list.',
	},
	{
		displayName: 'Button Text',
		name: 'listButton',
		type: 'string',
		required: true,
		default: 'View Options',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['list'],
			},
		},
		description: 'Text of the button that the user clicks to open the list of options. Maximum of 20 characters.',
	},
	{
		displayName: 'Sections (JSON)',
		name: 'sections',
		type: 'json',
		required: true,
		default: '[\n  {\n    "title": "Section 1",\n    "buttons": [\n      {\n        "type": "postback",\n        "id": "opt1",\n        "label": "Option 1",\n        "data": {}\n      }\n    ]\n  }\n]',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['list'],
			},
		},
		description: 'JSON Array with the sections of the list. Maximum of 10 sections, each with up to 10 items. Each section must have "title" and "buttons" (array of objects with type, id, label and data).',
	},
]

export const flowsFields: INodeProperties[] = [
	{
		displayName: 'Flow Text',
		name: 'flowText',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['flows'],
			},
		},
		description: 'Main text displayed in the message before the CTA button of the flow. Describe the purpose of the flow to guide the user.',
	},
	{
		displayName: 'CTA Button Text',
		name: 'flowCta',
		type: 'string',
		required: true,
		default: 'Open',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['flows'],
			},
		},
		description: 'Text of the CTA button that opens the flow. Maximum of 20 characters. Examples: "Open", "Start", "Fill".',
	},
	{
		displayName: 'Flow ID or Name',
		name: 'flowIdentifier',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['flows'],
			},
		},
		description: 'Identifier of the WhatsApp Flow. Use the numeric ID (default) or the flow name (enable "Use Flow Name"). The flow must be registered and published on the platform.',
	},
	{
		displayName: 'Use Flow Name',
		name: 'useFlowName',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['flows'],
			},
		},
		description: 'Enable to identify the flow by name instead of the numeric ID. Useful when the name is easier to manage.',
	},
	{
		displayName: 'Flow Action',
		name: 'flowAction',
		type: 'options',
		options: [
			{ name: 'Navigate', value: 'navigate' },
			{ name: 'Data Exchange', value: 'data_exchange' },
		],
		default: 'navigate',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['flows'],
			},
		},
		description: 'Type of action of the flow. "Navigate" opens a specific screen of the flow. "Data Exchange" sends data to the flow endpoint and receives the response screen.',
	},
	{
		displayName: 'Screen',
		name: 'flowScreen',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['flows'],
			},
		},
		description: 'Name of the initial screen of the flow for the "Navigate" action. Must correspond exactly to the ID of the screen defined in the flow JSON.',
	},
	{
		displayName: 'Flow Data (JSON)',
		name: 'flowData',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['flows'],
			},
		},
		description: 'JSON data initially sent to the flow. Can be used to pre-fill fields or customize the flow behavior. The keys must correspond to the parameters expected by the screen.',
	},
	{
		displayName: 'Draft Mode',
		name: 'flowDraft',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['flows'],
			},
		},
		description: 'Enable to use the draft version (not published) of the flow. Useful for testing before publishing. In production, keep disabled.',
	},
]

export const genericCardFields: INodeProperties[] = [
	{
		displayName: 'Card Title',
		name: 'genericTitle',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['generic'],
			},
		},
		description: 'Main title of the card displayed in the highlight. Recommended to keep short and objective.',
	},
	{
		displayName: 'Card Subtitle',
		name: 'genericSubtitle',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['generic'],
			},
		},
		description: 'Descriptive text displayed below the card title. Ideal for additional information.',
	},
	{
		displayName: 'Card Image URL',
		name: 'genericImage',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['generic'],
			},
		},
		description: 'Public and accessible URL of the image displayed at the top of the card. Accepted formats: JPEG, PNG. Recommended aspect ratio 1.91:1 (e.g., 800x418 pixels).',
	},
]

export const productFields: INodeProperties[] = [
	{
		displayName: 'Product Text',
		name: 'productText',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['product'],
			},
		},
		description: 'Optional text displayed in the body of the message along with the product. Can contain description, promotion or additional instructions.',
	},
	{
		displayName: 'Catalog ID',
		name: 'catalogId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['product', 'productList'],
			},
		},
		description: 'Facebook/Meta Commerce catalog ID. Find the ID in the Meta Business Suite Commerce Manager (e.g., 123456789012345).',
	},
	{
		displayName: 'Product Retailer ID',
		name: 'productRetailerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['product'],
			},
		},
		description: 'Retailer ID (product ID) of the product in the catalog. This is the unique identifier of the product defined in the Commerce Manager.',
	},
]

export const productListFields: INodeProperties[] = [
	{
		displayName: 'Product List Text',
		name: 'productListText',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['productList'],
			},
		},
		description: 'Optional text displayed in the body of the product list message. Can contain an introduction or instructions for the user.',
	},
	{
		displayName: 'Product List Header',
		name: 'productListHeader',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['productList'],
			},
		},
		description: 'Text of the header displayed at the top of the product list. Maximum of 60 characters.',
	},
	{
		displayName: 'Product Sections (JSON)',
		name: 'productSections',
		type: 'json',
		required: true,
		default: '[\n  {\n    "title": "Section 1",\n    "products": [\n      { "productRetailerId": "SKU123" }\n    ]\n  }\n]',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['productList'],
			},
		},
		description: 'JSON Array with the product sections. Maximum of 10 sections, with up to 30 products in total. Each section must have "title" and "products" (array with objects containing "productRetailerId").',
	},
]

export const templateFields: INodeProperties[] = [
	{
		displayName: 'Template Name',
		name: 'templateName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'my_approved_template',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'Exact name of the approved HSM template by Meta/WhatsApp. The name must correspond exactly to the one registered in the WhatsApp Business Manager. Lowercase letters and underscores.',
	},
	{
		displayName: 'Template Language',
		name: 'templateLanguage',
		type: 'string',
		required: true,
		default: 'en_US',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'Language code of the template as registered in Meta. Examples: pt_BR (Portuguese Brazil), en_US (English USA), es (Spanish). Must correspond to the approved language.',
	},
	{
		displayName: 'Template Parameters (JSON Array)',
		name: 'templateParameters',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'JSON Array with the values of the variable parameters of the template body, in the order they appear ({{1}}, {{2}}, etc.). Ex: ["John", "Order #123", "$99.90"].',
	},
	{
		displayName: 'Header Parameter',
		name: 'headerParameter',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'Variable parameter of the text header of the template (if there is {{1}} in the header). Fill only if the template has a text header with variable.',
	},
	{
		displayName: 'Header Image URL',
		name: 'headerImageUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'Public and accessible URL of the image for the template header. Fill only if the template has a header of type image. Accepted formats: JPEG, PNG. Maximum size: 5 MB.',
	},
	{
		displayName: 'Header Video URL',
		name: 'headerVideoUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'Public and accessible URL of the video for the template header. Fill only if the template has a header of type video. Accepted format: MP4. Maximum size: 16 MB.',
	},
	{
		displayName: 'Header Document URL',
		name: 'headerDocumentUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'Public and accessible URL of the document for the template header. Fill only if the template has a header of type document. Accepted formats: PDF, DOC, DOCX, etc. Maximum size: 100 MB.',
	},
	{
		displayName: 'Template Buttons (JSON)',
		name: 'templateButtons',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'JSON Array with the dynamic button configuration of the template. Used for buttons with variable parameters (e.g., URL with dynamic suffix or verification code button).',
	},
]
