/**
 * Message-related field descriptions for Hyperflow WhatsApp node
 */

import type { INodeProperties } from 'n8n-workflow'

/**
 * Message type selector for Send operation
 */
export const messageTypeField: INodeProperties = {
	displayName: 'Tipo de Mensagem',
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
		{ name: 'Texto', value: 'text', description: 'Enviar uma mensagem de texto' },
		{ name: 'Imagem', value: 'image', description: 'Enviar uma imagem' },
		{ name: 'Vídeo', value: 'video', description: 'Enviar um vídeo' },
		{ name: 'Áudio', value: 'audio', description: 'Enviar um arquivo de áudio' },
		{ name: 'Arquivo', value: 'file', description: 'Enviar um documento/arquivo' },
		{ name: 'Figurinha', value: 'sticker', description: 'Enviar uma figurinha' },
		{ name: 'Localização', value: 'location', description: 'Enviar uma localização' },
		{ name: 'Contato', value: 'contact', description: 'Enviar um cartão de contato' },
		{ name: 'Lista', value: 'list', description: 'Enviar uma lista interativa' },
		{ name: 'Fluxos', value: 'flows', description: 'Enviar um fluxo interativo' },
		{ name: 'Cartão Genérico', value: 'generic', description: 'Enviar um cartão genérico com imagem e botões' },
		{ name: 'Produto', value: 'product', description: 'Enviar um único produto do catálogo' },
		{ name: 'Lista de Produtos', value: 'productList', description: 'Enviar uma lista de produtos' },
	],
	default: 'text',
}

// ==================== TEXT MESSAGE FIELDS ====================

export const textMessageFields: INodeProperties[] = [
	{
		displayName: 'Texto',
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
		description: 'Conteúdo de texto da mensagem',
	},
	{
		displayName: 'Rodapé',
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
		description: 'Texto do rodapé opcional',
	},
	{
		displayName: 'Rodapé',
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
		description: 'Texto do rodapé opcional',
	},
	{
		displayName: 'Incluir Botões',
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
		description: 'Se deve incluir botões interativos',
	},
	{
		displayName: 'Botões',
		name: 'buttons',
		placeholder: 'Adicionar Botão',
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
				displayName: 'Botão',
				values: [
					{
						displayName: 'Tipo',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Postback', value: 'postback' },
							{ name: 'URL', value: 'url' },
							{ name: 'Chamada de Voz', value: 'voice_call' },
						],
						default: 'postback',
					},
					{
						displayName: 'ID do Botão',
						name: 'id',
						type: 'string',
						default: '',
						description: 'Identificador único para o botão',
					},
					{
						displayName: 'Rótulo',
						name: 'label',
						type: 'string',
						default: '',
						description: 'Texto do botão exibido ao usuário',
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
						description: 'URL a abrir quando o botão é clicado',
					},
					{
						displayName: 'Dados do Postback (JSON)',
						name: 'data',
						type: 'json',
						default: '{}',
						displayOptions: {
							show: {
								type: ['postback'],
							},
						},
						description: 'Dados enviados quando o botão é clicado',
					},
					{
						displayName: 'TTL em Minutos',
						name: 'ttlMinutes',
						type: 'number',
						default: 60,
						displayOptions: {
							show: {
								type: ['voice_call'],
							},
						},
						description: 'Tempo de vida em minutos para o botão de chamada de voz',
					},
				],
			},
		],
	},
]

// ==================== MEDIA MESSAGE FIELDS ====================

export const mediaMessageFields: INodeProperties[] = [
	{
		displayName: 'URL da Mídia',
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
		description: 'URL do arquivo de mídia',
	},
	{
		displayName: 'Legenda',
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
		description: 'Legenda para a mídia (opcional)',
	},
	{
		displayName: 'Nome do Arquivo',
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
		description: 'Nome do arquivo (ex: documento.pdf)',
	},
]

// ==================== LOCATION FIELDS ====================

export const locationFields: INodeProperties[] = [
	{
		displayName: 'Latitude',
		name: 'latitude',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['location'],
			},
		},
		description: 'Coordenada de latitude',
	},
	{
		displayName: 'Longitude',
		name: 'longitude',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['location'],
			},
		},
		description: 'Coordenada de longitude',
	},
	{
		displayName: 'Nome da Localização',
		name: 'locationName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['location'],
			},
		},
		description: 'Nome da localização',
	},
	{
		displayName: 'Endereço',
		name: 'address',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['location'],
			},
		},
		description: 'Endereço da localização',
	},
]

// ==================== CONTACT FIELDS ====================

export const contactFields: INodeProperties[] = [
	{
		displayName: 'Nome do Contato',
		name: 'contactName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['contact'],
			},
		},
		description: 'Nome completo do contato',
	},
	{
		displayName: 'Telefone do Contato',
		name: 'contactPhone',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['contact'],
			},
		},
		description: 'Número de telefone do contato',
	},
	{
		displayName: 'E-mail do Contato',
		name: 'contactEmail',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['contact'],
			},
		},
		description: 'E-mail do contato (opcional)',
	},
	{
		displayName: 'Código do País',
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
		description: 'Código do país para o número de telefone',
	},
]

// ==================== LIST FIELDS ====================

export const listFields: INodeProperties[] = [
	{
		displayName: 'Texto do Corpo da Lista',
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
		description: 'Texto do corpo da mensagem de lista',
	},
	{
		displayName: 'Texto do Botão',
		name: 'listButton',
		type: 'string',
		required: true,
		default: 'Ver opções',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['list'],
			},
		},
		description: 'Texto para o botão da lista',
	},
	{
		displayName: 'Seções (JSON)',
		name: 'sections',
		type: 'json',
		required: true,
		default: '[\n  {\n    "title": "Seção 1",\n    "buttons": [\n      {\n        "type": "postback",\n        "id": "opt1",\n        "label": "Opção 1",\n        "data": {}\n      }\n    ]\n  }\n]',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['list'],
			},
		},
		description: 'Seções de lista em formato JSON',
	},
]

// ==================== FLOWS FIELDS ====================

export const flowsFields: INodeProperties[] = [
	{
		displayName: 'Texto do Fluxo',
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
		description: 'Texto do corpo para a mensagem de fluxo',
	},
	{
		displayName: 'Texto do Botão CTA',
		name: 'flowCta',
		type: 'string',
		required: true,
		default: 'Abrir',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['flows'],
			},
		},
		description: 'Texto do botão de chamada à ação',
	},
	{
		displayName: 'ID ou Nome do Fluxo',
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
		description: 'ID do Fluxo ou Nome do Fluxo',
	},
	{
		displayName: 'Usar Nome do Fluxo',
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
		description: 'Se deve usar flowName em vez de flowId',
	},
	{
		displayName: 'Ação do Fluxo',
		name: 'flowAction',
		type: 'options',
		options: [
			{ name: 'Navegar', value: 'navigate' },
			{ name: 'Troca de Dados', value: 'data_exchange' },
		],
		default: 'navigate',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['flows'],
			},
		},
	},
	{
		displayName: 'Tela',
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
		description: 'Nome da tela para ação navegar',
	},
	{
		displayName: 'Dados do Fluxo (JSON)',
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
		description: 'Dados a passar para o fluxo',
	},
	{
		displayName: 'Modo Rascunho',
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
		description: 'Se deve usar versão rascunho do fluxo',
	},
]

// ==================== GENERIC CARD FIELDS ====================

export const genericCardFields: INodeProperties[] = [
	{
		displayName: 'Título do Cartão',
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
		description: 'Título do cartão',
	},
	{
		displayName: 'Subtítulo do Cartão',
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
		description: 'Subtítulo/descrição do cartão',
	},
	{
		displayName: 'URL da Imagem do Cartão',
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
		description: 'URL da imagem para o cartão',
	},
]

// ==================== PRODUCT FIELDS ====================

export const productFields: INodeProperties[] = [
	{
		displayName: 'Texto do Produto',
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
		description: 'Texto do corpo para a mensagem de produto',
	},
	{
		displayName: 'ID do Catálogo',
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
		description: 'ID do Catálogo do Facebook',
	},
	{
		displayName: 'ID do Varejista do Produto',
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
		description: 'SKU/ID do Varejista do Produto',
	},
]

// ==================== PRODUCT LIST FIELDS ====================

export const productListFields: INodeProperties[] = [
	{
		displayName: 'Texto da Lista de Produtos',
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
		description: 'Texto do corpo para a lista de produtos',
	},
	{
		displayName: 'Cabeçalho da Lista de Produtos',
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
		description: 'Texto do cabeçalho para a lista de produtos',
	},
	{
		displayName: 'Seções de Produtos (JSON)',
		name: 'productSections',
		type: 'json',
		required: true,
		default: '[\n  {\n    "title": "Categoria 1",\n    "products": [\n      { "productRetailerId": "SKU123" }\n    ]\n  }\n]',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['productList'],
			},
		},
		description: 'Seções de produtos em formato JSON',
	},
]

// ==================== TEMPLATE FIELDS ====================

export const templateFields: INodeProperties[] = [
	{
		displayName: 'Nome do Template',
		name: 'templateName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'Nome do template aprovado',
	},
	{
		displayName: 'Idioma do Template',
		name: 'templateLanguage',
		type: 'string',
		required: true,
		default: 'pt_BR',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'Código de idioma do template (ex: pt_BR, en_US)',
	},
	{
		displayName: 'Parâmetros do Template (Matriz JSON)',
		name: 'templateParameters',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'Matriz de valores de parâmetros para o corpo do template',
	},
	{
		displayName: 'Parâmetro do Cabeçalho',
		name: 'headerParameter',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'Valor do parâmetro para o cabeçalho (se o template tiver cabeçalho)',
	},
	{
		displayName: 'URL da Imagem do Cabeçalho',
		name: 'headerImageUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'URL da imagem para o cabeçalho (se o template tiver cabeçalho de imagem)',
	},
	{
		displayName: 'URL do Vídeo do Cabeçalho',
		name: 'headerVideoUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'URL do vídeo para o cabeçalho (se o template tiver cabeçalho de vídeo)',
	},
	{
		displayName: 'URL do Documento do Cabeçalho',
		name: 'headerDocumentUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'URL do documento para o cabeçalho (se o template tiver cabeçalho de documento)',
	},
	{
		displayName: 'Botões do Template (JSON)',
		name: 'templateButtons',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'Configuração de botões para o template',
	},
]
