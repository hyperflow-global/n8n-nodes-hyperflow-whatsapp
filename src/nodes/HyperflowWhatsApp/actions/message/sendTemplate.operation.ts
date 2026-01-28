/**
 * Send template message operation for Hyperflow WhatsApp node
 */

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow'
import { NodeOperationError } from 'n8n-workflow'
import { config } from '../../../../config'
import {
	hyperflowApiRequest,
	isValidPhoneNumber,
	safeJsonParse,
	sanitizePhoneNumber,
} from '../../GenericFunctions'

/**
 * Execute the send template message operation
 */
export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = []

	for (let i = 0; i < items.length; i++) {
		try {
			const rawTo = this.getNodeParameter('to', i) as string
			const to = sanitizePhoneNumber(rawTo)

			if (!isValidPhoneNumber(to)) {
				throw new NodeOperationError(
					this.getNode(),
					`Invalid phone number: "${rawTo}". Use format with country code (e.g., 5511999999999)`,
					{ itemIndex: i },
				)
			}

			const parametersJson = this.getNodeParameter('templateParameters', i, '[]') as string
			const buttonsJson = this.getNodeParameter('templateButtons', i, '[]') as string

			const payload: IDataObject = {
				name: this.getNodeParameter('templateName', i) as string,
				language: this.getNodeParameter('templateLanguage', i) as string,
				parameters: safeJsonParse(parametersJson, []),
			}

			// Add optional header parameters
			const headerParameter = this.getNodeParameter('headerParameter', i, '') as string
			if (headerParameter) payload.headerParameter = headerParameter

			const headerImageUrl = this.getNodeParameter('headerImageUrl', i, '') as string
			if (headerImageUrl) payload.imageUrl = headerImageUrl

			const headerVideoUrl = this.getNodeParameter('headerVideoUrl', i, '') as string
			if (headerVideoUrl) payload.videoUrl = headerVideoUrl

			const headerDocumentUrl = this.getNodeParameter('headerDocumentUrl', i, '') as string
			if (headerDocumentUrl) payload.documentUrl = headerDocumentUrl

			// Add buttons if configured
			const buttons = safeJsonParse<IDataObject[]>(buttonsJson, [])
			if (buttons.length > 0) payload.buttons = buttons

			// Build request body
			const requestBody = {
				to,
				type: 'template',
				payload,
			}

			// Make API request
			const response = await hyperflowApiRequest.call(
				this,
				'POST',
				config.endpoints.sendMessage,
				requestBody as IDataObject,
			)

			returnData.push({
				json: response,
				pairedItem: { item: i },
			})
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error)
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: errorMessage,
					},
					pairedItem: { item: i },
				})
				continue
			}
			throw new NodeOperationError(this.getNode(), errorMessage, { itemIndex: i })
		}
	}

	return returnData
}
