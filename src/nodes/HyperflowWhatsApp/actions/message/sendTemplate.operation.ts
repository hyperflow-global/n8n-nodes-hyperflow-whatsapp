import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow'
import { NodeOperationError } from 'n8n-workflow'
import { config } from '../../../../config'
import {
	hyperflowApiRequest,
	isValidPhoneNumber,
	safeJsonParse,
	sanitizePhoneNumber,
} from '../../GenericFunctions'

interface HttpError extends Error {
	response?: { status?: number; data?: unknown }
	statusCode?: number
}

function toEnrichedErrorMessage(error: unknown): string {
	const base = error instanceof Error ? error.message : String(error)
	const err = error as HttpError
	if (err.response?.status !== undefined) {
		const body = err.response.data
		const bodyStr =
			body != null ? (typeof body === 'string' ? body : JSON.stringify(body)) : ''
		return `[${err.response.status}] ${base}${bodyStr ? ` — ${bodyStr}` : ''}`
	}
	if (err.statusCode !== undefined) return `[${err.statusCode}] ${base}`
	return base
}

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

			const headerParameter = this.getNodeParameter('headerParameter', i, '') as string
			if (headerParameter) payload.headerParameter = headerParameter

			const headerImageUrl = this.getNodeParameter('headerImageUrl', i, '') as string
			if (headerImageUrl) payload.imageUrl = headerImageUrl

			const headerVideoUrl = this.getNodeParameter('headerVideoUrl', i, '') as string
			if (headerVideoUrl) payload.videoUrl = headerVideoUrl

			const headerDocumentUrl = this.getNodeParameter('headerDocumentUrl', i, '') as string
			if (headerDocumentUrl) payload.documentUrl = headerDocumentUrl

			const buttons = safeJsonParse<IDataObject[]>(buttonsJson, [])
			if (buttons.length > 0) payload.buttons = buttons

			const requestBody: IDataObject = {
				to,
				type: 'template',
				payload,
			}

			const response = await hyperflowApiRequest.call(
				this,
				'POST',
				config.endpoints.sendMessage,
				requestBody,
			)

			returnData.push({ json: response, pairedItem: { item: i } })
		} catch (error) {
			const errorMessage = toEnrichedErrorMessage(error)
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: errorMessage },
					pairedItem: { item: i },
				})
				continue
			}
			throw new NodeOperationError(this.getNode(), errorMessage, { itemIndex: i })
		}
	}

	return returnData
}
