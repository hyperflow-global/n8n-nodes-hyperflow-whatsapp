/**
 * Message resource definition for Hyperflow WhatsApp node
 */

import type { INodeProperties } from 'n8n-workflow'

/**
 * Operations available for the Message resource
 */
export const messageOperations: INodeProperties = {
	displayName: 'Operação',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['message'],
		},
	},
	options: [
		{
			name: 'Enviar',
			value: 'send',
			description: 'Enviar uma mensagem (texto, imagem, vídeo, áudio, arquivo, localização, contato, lista, fluxos, etc.)',
			action: 'Enviar uma mensagem',
		},
		{
			name: 'Enviar Template',
			value: 'sendTemplate',
			description: 'Enviar uma mensagem de template HSM pré-aprovado',
			action: 'Enviar uma mensagem de template',
		},
	],
	default: 'send',
}

/**
 * Phone number field - common to all message operations
 */
export const phoneNumberField: INodeProperties = {
	displayName: 'Número de Telefone do Destinatário',
	name: 'to',
	type: 'string',
	required: true,
	default: '',
	placeholder: '5511999999999',
	description: 'Número de telefone com código de país (ex: 5511999999999)',
	displayOptions: {
		show: {
			resource: ['message'],
		},
	},
}
