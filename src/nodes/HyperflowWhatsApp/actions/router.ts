import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow'
import { NodeOperationError } from 'n8n-workflow'
import * as message from './message'

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData()
	const resource = this.getNodeParameter('resource', 0) as string
	const operation = this.getNodeParameter('operation', 0) as string
	let returnData: INodeExecutionData[] = []

	switch (resource) {
		case 'message':
			returnData = await executeMessageOperation.call(this, items, operation)
			break
		default:
			throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`)
	}

	return [returnData]
}

async function executeMessageOperation(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	operation: string,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'send':
			return message.operations.send.execute.call(this, items)
		case 'sendTemplate':
			return message.operations.sendTemplate.execute.call(this, items)
		default:
			throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`)
	}
}
