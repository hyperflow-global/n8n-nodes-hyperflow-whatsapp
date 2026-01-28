/**
 * Hyperflow WhatsApp Node
 *
 * Send WhatsApp messages via Hyperflow API
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow'
import { router } from './actions/router'
import * as message from './actions/message'

export class HyperflowWhatsApp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hyperflow WhatsApp',
		name: 'hyperflowWhatsApp',
		icon: 'file:hyperflow.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Enviar mensagens do WhatsApp via API Hyperflow',
		defaults: {
			name: 'Hyperflow WhatsApp',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'hyperflowWhatsAppAccount',
				required: true,
			},
		],
		properties: [
			// Resource selector
			{
				displayName: 'Recurso',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Mensagem',
						value: 'message',
					},
				],
				default: 'message',
			},
			// Message resource descriptions (operations + fields)
			...message.descriptions,
		],
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return router.call(this)
	}
}
