import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow'
import { config } from '../../../../config'
import {
	hyperflowApiRequest,
	resolveRecipient,
	handleOperationError,
	safeJsonParse,
} from '../../GenericFunctions'

interface TemplateHeaderFields {
	headerParameter: string
	headerImageUrl: string
	headerVideoUrl: string
	headerDocumentUrl: string
}

const HEADER_FIELD_MAP: Record<keyof TemplateHeaderFields, string> = {
	headerParameter: 'headerParameter',
	headerImageUrl: 'imageUrl',
	headerVideoUrl: 'videoUrl',
	headerDocumentUrl: 'documentUrl',
}

export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = []

	for (let i = 0; i < items.length; i++) {
		try {
			const to = resolveRecipient(this, i)
			const payload = buildTemplatePayload(this, i)

			const response = await hyperflowApiRequest.call(
				this,
				'POST',
				config.endpoints.sendMessage,
				{ to, type: 'template', payload },
			)

			returnData.push({ json: response, pairedItem: { item: i } })
		} catch (error) {
			handleOperationError(this, error, i, returnData)
		}
	}

	return returnData
}

function buildTemplatePayload(ctx: IExecuteFunctions, i: number): IDataObject {
	const payload: IDataObject = {
		name: ctx.getNodeParameter('templateName', i) as string,
		language: ctx.getNodeParameter('templateLanguage', i) as string,
		parameters: safeJsonParse(ctx.getNodeParameter('templateParameters', i, '[]') as string, []),
	}

	for (const [paramName, payloadKey] of Object.entries(HEADER_FIELD_MAP)) {
		const value = ctx.getNodeParameter(paramName, i, '') as string
		if (value) payload[payloadKey] = value
	}

	const buttons = safeJsonParse<IDataObject[]>(
		ctx.getNodeParameter('templateButtons', i, '[]') as string,
		[],
	)
	if (buttons.length > 0) payload.buttons = buttons

	return payload
}
