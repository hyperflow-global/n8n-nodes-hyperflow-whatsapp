import type { INodeProperties } from 'n8n-workflow'

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
		{
			name: 'Texto',
			value: 'text',
			description: 'Enviar uma mensagem de texto simples. Suporta até 4096 caracteres, com opção de rodapé e até 3 botões interativos.',
		},
		{
			name: 'Imagem',
			value: 'image',
			description: 'Enviar uma imagem com legenda opcional. Formatos aceitos: JPEG, PNG. Tamanho máximo: 5 MB. A URL deve ser pública e acessível.',
		},
		{
			name: 'Vídeo',
			value: 'video',
			description: 'Enviar um vídeo com legenda opcional. Formatos aceitos: MP4, 3GPP. Tamanho máximo: 16 MB. Codec de vídeo: H.264, codec de áudio: AAC.',
		},
		{
			name: 'Áudio',
			value: 'audio',
			description: 'Enviar um arquivo de áudio. Formatos aceitos: MP3, OGG (com codec Opus), AMR. Tamanho máximo: 16 MB.',
		},
		{
			name: 'Arquivo',
			value: 'file',
			description: 'Enviar um documento/arquivo. Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, entre outros. Tamanho máximo: 100 MB.',
		},
		{
			name: 'Figurinha',
			value: 'sticker',
			description: 'Enviar uma figurinha/sticker. A imagem deve estar no formato WebP com tamanho exato de 512x512 pixels. Tamanho máximo: 100 KB para stickers estáticos, 500 KB para animados.',
		},
		{
			name: 'Localização',
			value: 'location',
			description: 'Enviar uma localização no mapa. Requer latitude e longitude em formato decimal (ex: -23.5505, -46.6333).',
		},
		{
			name: 'Contato',
			value: 'contact',
			description: 'Enviar um cartão de contato (vCard). Inclui nome, telefone com código de país e e-mail opcional.',
		},
		{
			name: 'Lista',
			value: 'list',
			description: 'Enviar uma lista interativa com seções e opções selecionáveis. Máximo de 10 seções, cada seção com até 10 itens. O texto do corpo é obrigatório.',
		},
		{
			name: 'Fluxos',
			value: 'flows',
			description: 'Enviar um WhatsApp Flow interativo. Requer o ID ou nome do fluxo cadastrado na plataforma. Suporta passagem de dados iniciais e modo rascunho.',
		},
		{
			name: 'Cartão Genérico',
			value: 'generic',
			description: 'Enviar um cartão com imagem, título, subtítulo e até 3 botões interativos. Ideal para exibir informações visuais com ações.',
		},
		{
			name: 'Produto',
			value: 'product',
			description: 'Enviar um único produto do catálogo do Facebook/Meta. Requer o ID do catálogo e o SKU (retailer ID) do produto.',
		},
		{
			name: 'Lista de Produtos',
			value: 'productList',
			description: 'Enviar uma lista de produtos organizados por seções do catálogo do Facebook/Meta. Permite exibir múltiplos produtos agrupados por categorias.',
		},
	],
	default: 'text',
}

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
		description: 'Conteúdo de texto da mensagem. Máximo de 4096 caracteres. Suporta formatação WhatsApp: *negrito*, _itálico_, ~tachado~, ```monoespacado```.',
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
		description: 'Texto exibido no rodapé da mensagem, abaixo dos botões. Máximo de 60 caracteres.',
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
		description: 'Texto exibido no rodapé da mensagem de lista. Máximo de 60 caracteres.',
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
		description: 'Ativar para adicionar até 3 botões interativos à mensagem. Tipos disponíveis: Postback, URL e Chamada de Voz.',
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
					description: 'Identificador único do botão (usado no retorno do postback). Máximo de 256 caracteres.',
				},
				{
					displayName: 'Rótulo',
					name: 'label',
					type: 'string',
					default: '',
					description: 'Texto exibido no botão para o usuário. Máximo de 20 caracteres.',
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
					description: 'URL que será aberta no navegador quando o usuário clicar no botão. Deve iniciar com https://.',
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
					description: 'Dados JSON enviados de volta ao webhook quando o usuário clicar no botão. Útil para identificar a ação escolhida.',
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
					description: 'Tempo de expiração em minutos para o botão de chamada de voz. Após esse tempo o botão ficará indisponível.',
				},
				],
			},
		],
	},
]

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
		description: 'URL pública e acessível do arquivo de mídia. Limites por tipo: Imagem (JPEG/PNG, máx 5 MB), Vídeo (MP4/3GPP, máx 16 MB), Áudio (MP3/OGG/AMR, máx 16 MB), Arquivo (máx 100 MB), Figurinha (WebP 512x512, máx 100 KB estático / 500 KB animado).',
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
		description: 'Texto exibido junto à mídia. Máximo de 1024 caracteres. Suporta formatação WhatsApp (*negrito*, _itálico_, ~tachado~). Não disponível para áudio e figurinha.',
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
		description: 'Nome do arquivo com extensão que será exibido ao destinatário (ex: relatorio.pdf, planilha.xlsx). Se não informado, será usado o nome do arquivo da URL.',
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
		description: 'Coordenada de latitude em formato decimal (ex: -23.5505 para São Paulo). Valores entre -90 e 90.',
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
		description: 'Coordenada de longitude em formato decimal (ex: -46.6333 para São Paulo). Valores entre -180 e 180.',
	},
	{
		displayName: 'Nome da Localização',
		name: 'locationName',
		type: 'string',
		default: '',
		placeholder: 'Escritório Hyperflow',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['location'],
			},
		},
		description: 'Nome do local exibido no mapa (ex: nome do estabelecimento ou ponto de referência)',
	},
	{
		displayName: 'Endereço',
		name: 'address',
		type: 'string',
		default: '',
		placeholder: 'Av. Paulista, 1000 - São Paulo, SP',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['location'],
			},
		},
		description: 'Endereço completo da localização exibido abaixo do nome no mapa',
	},
]

export const contactFields: INodeProperties[] = [
	{
		displayName: 'Nome do Contato',
		name: 'contactName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'João da Silva',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['contact'],
			},
		},
		description: 'Nome completo do contato que será exibido no cartão vCard compartilhado',
	},
	{
		displayName: 'Telefone do Contato',
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
		description: 'Número de telefone do contato sem o código do país (ex: 11999999999). O código do país é definido no campo separado.',
	},
	{
		displayName: 'E-mail do Contato',
		name: 'contactEmail',
		type: 'string',
		default: '',
		placeholder: 'joao@email.com',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				messageType: ['contact'],
			},
		},
		description: 'Endereço de e-mail do contato (opcional). Será incluído no cartão vCard.',
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
		description: 'Código DDI do país para o número de telefone. Padrão: 55 (Brasil). Exemplos: 1 (EUA), 351 (Portugal), 54 (Argentina).',
	},
]

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
		description: 'Texto principal exibido no corpo da mensagem de lista. Máximo de 1024 caracteres. Este texto aparece antes do botão de abrir a lista.',
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
		description: 'Texto do botão que o usuário clica para abrir a lista de opções. Máximo de 20 caracteres.',
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
		description: 'Array JSON com as seções da lista. Máximo de 10 seções, cada uma com até 10 itens. Cada seção deve ter "title" e "buttons" (array de objetos com type, id, label e data).',
	},
]

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
		description: 'Texto principal exibido na mensagem antes do botão CTA do fluxo. Descreva o propósito do fluxo para orientar o usuário.',
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
		description: 'Texto do botão de chamada à ação que abre o fluxo. Máximo de 20 caracteres. Exemplos: "Abrir", "Iniciar", "Preencher".',
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
		description: 'Identificador do WhatsApp Flow. Use o ID numérico (padrão) ou o nome do fluxo (ative "Usar Nome do Fluxo"). O fluxo deve estar cadastrado e publicado na plataforma.',
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
		description: 'Ativar para identificar o fluxo pelo nome em vez do ID numérico. Útil quando o nome é mais fácil de gerenciar.',
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
		description: 'Tipo de ação do fluxo. "Navegar" abre uma tela específica do fluxo. "Troca de Dados" envia dados ao endpoint do fluxo e recebe a tela de resposta.',
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
		description: 'Nome da tela inicial do fluxo para ação "Navegar". Deve corresponder exatamente ao ID da tela definido no JSON do fluxo.',
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
		description: 'Dados JSON iniciais enviados ao fluxo. Podem ser usados para pré-preencher campos ou personalizar o comportamento do fluxo. As chaves devem corresponder aos parâmetros esperados pela tela.',
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
		description: 'Ativar para usar a versão rascunho (não publicada) do fluxo. Útil para testes antes de publicar. Em produção, mantenha desativado.',
	},
]

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
		description: 'Título principal do cartão exibido em destaque. Recomendado manter curto e objetivo.',
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
		description: 'Texto descritivo exibido abaixo do título do cartão. Ideal para informações complementares.',
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
		description: 'URL pública da imagem exibida no topo do cartão. Formatos aceitos: JPEG, PNG. Recomendado aspecto 1.91:1 (ex: 800x418 pixels).',
	},
]

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
		description: 'Texto opcional exibido no corpo da mensagem junto ao produto. Pode conter descrição, promoção ou instruções adicionais.',
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
		description: 'ID do catálogo do Facebook/Meta Commerce. Encontre o ID no Gerenciador de Comércio do Meta Business Suite (ex: 123456789012345).',
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
		description: 'SKU ou ID do varejista (retailer ID) do produto no catálogo. Este é o identificador único do produto definido no Gerenciador de Comércio.',
	},
]

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
		description: 'Texto opcional exibido no corpo da mensagem de lista de produtos. Pode conter uma introdução ou instruções para o usuário.',
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
		description: 'Texto do cabeçalho exibido no topo da lista de produtos. Máximo de 60 caracteres.',
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
		description: 'Array JSON com as seções de produtos. Máximo de 10 seções, com até 30 produtos no total. Cada seção deve ter "title" e "products" (array com objetos contendo "productRetailerId").',
	},
]

export const templateFields: INodeProperties[] = [
	{
		displayName: 'Nome do Template',
		name: 'templateName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'meu_template_aprovado',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTemplate'],
			},
		},
		description: 'Nome exato do template HSM aprovado pelo Meta/WhatsApp. O nome deve corresponder exatamente ao cadastrado no Gerenciador do WhatsApp Business. Letras minúsculas e underscores.',
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
		description: 'Código de idioma do template conforme registrado no Meta. Exemplos: pt_BR (Português Brasil), en_US (Inglês EUA), es (Espanhol). Deve corresponder ao idioma aprovado.',
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
		description: 'Array JSON com os valores dos parâmetros variáveis do corpo do template, na ordem em que aparecem ({{1}}, {{2}}, etc.). Ex: ["João", "Pedido #123", "R$ 99,90"].',
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
		description: 'Valor do parâmetro variável do cabeçalho de texto do template (se houver {{1}} no cabeçalho). Preencha apenas se o template tiver cabeçalho do tipo texto com variável.',
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
		description: 'URL pública da imagem para o cabeçalho do template. Preencha apenas se o template tiver cabeçalho do tipo imagem. Formatos: JPEG, PNG. Tamanho máximo: 5 MB.',
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
		description: 'URL pública do vídeo para o cabeçalho do template. Preencha apenas se o template tiver cabeçalho do tipo vídeo. Formato: MP4. Tamanho máximo: 16 MB.',
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
		description: 'URL pública do documento para o cabeçalho do template. Preencha apenas se o template tiver cabeçalho do tipo documento. Formatos: PDF, DOC, DOCX, etc. Tamanho máximo: 100 MB.',
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
		description: 'Array JSON com a configuração de botões dinâmicos do template. Usado para botões com parâmetros variáveis (ex: URL com sufixo dinâmico ou botão de código de verificação).',
	},
]
