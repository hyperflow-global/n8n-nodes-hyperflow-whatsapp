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
		description: 'Send WhatsApp messages through Hyperflow API',
		defaults: { name: 'Hyperflow WhatsApp' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'HyperflowWhatsAppAccount', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [{ name: 'Mensagem', value: 'message' }],
				default: 'message',
			},
			...message.descriptions,
		],
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return router.call(this)
	}
}
