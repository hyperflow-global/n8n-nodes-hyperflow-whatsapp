import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow'
import {
	hyperflowApiRequest,
	resolveRecipient,
	handleOperationError,
	safeJsonParse,
	extractButtonsPayload,
} from '../../GenericFunctions'
import { config } from '../../../../config'

type MessageType =
	| 'text' | 'image' | 'video' | 'audio' | 'sticker' | 'file'
	| 'location' | 'contact' | 'list' | 'flows' | 'generic'
	| 'product' | 'productList'

export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = []

	for (let i = 0; i < items.length; i++) {
		try {
			const messageType = this.getNodeParameter('messageType', i) as MessageType
			const to = resolveRecipient(this, i)
			const payload = buildPayload(this, messageType, i)

			const response = await hyperflowApiRequest.call(
				this,
				'POST',
				config.endpoints.sendMessage,
				{ to, type: messageType, payload },
			)

			returnData.push({ json: response, pairedItem: { item: i } })
		} catch (error) {
			handleOperationError(this, error, i, returnData)
		}
	}

	return returnData
}

// ─── Payload Builders (one per message type) ─────────────────

function getParam<T>(ctx: IExecuteFunctions, name: string, index: number, defaultValue?: T): T {
	return ctx.getNodeParameter(name, index, defaultValue) as T
}

function buildTextPayload(ctx: IExecuteFunctions, i: number): IDataObject {
	const payload: IDataObject = { text: getParam<string>(ctx, 'text', i) }
	const footer = getParam<string>(ctx, 'footer', i, '')
	if (footer) payload.footer = footer
	const buttons = extractButtonsPayload(ctx, i)
	if (buttons) payload.buttons = buttons
	return payload
}

function buildMediaPayload(ctx: IExecuteFunctions, type: MessageType, i: number): IDataObject {
	const payload: IDataObject = { url: getParam<string>(ctx, 'mediaUrl', i) }
	if (type !== 'audio' && type !== 'sticker') {
		const caption = getParam<string>(ctx, 'caption', i, '')
		if (caption) payload.text = caption
	}
	return payload
}

function buildFilePayload(ctx: IExecuteFunctions, i: number): IDataObject {
	const payload: IDataObject = { url: getParam<string>(ctx, 'mediaUrl', i) }
	const caption = getParam<string>(ctx, 'caption', i, '')
	const fileName = getParam<string>(ctx, 'fileName', i, '')
	if (caption) payload.text = caption
	if (fileName) payload.name = fileName
	return payload
}

function buildLocationPayload(ctx: IExecuteFunctions, i: number): IDataObject {
	return {
		latitude: getParam<string>(ctx, 'latitude', i),
		longitude: getParam<string>(ctx, 'longitude', i),
		name: getParam<string>(ctx, 'locationName', i, ''),
		address: getParam<string>(ctx, 'address', i, ''),
	}
}

function buildContactPayload(ctx: IExecuteFunctions, i: number): IDataObject {
	return {
		name: getParam<string>(ctx, 'contactName', i),
		phone: getParam<string>(ctx, 'contactPhone', i),
		email: getParam<string>(ctx, 'contactEmail', i, ''),
		country: getParam<string>(ctx, 'countryCode', i, '55'),
	}
}

function buildListPayload(ctx: IExecuteFunctions, i: number): IDataObject {
	const payload: IDataObject = {
		text: getParam<string>(ctx, 'listText', i),
		button: getParam<string>(ctx, 'listButton', i),
		sections: safeJsonParse(getParam<string>(ctx, 'sections', i), []),
	}
	const footer = getParam<string>(ctx, 'footer', i, '')
	if (footer) payload.footer = footer
	return payload
}

function buildFlowsPayload(ctx: IExecuteFunctions, i: number): IDataObject {
	const useFlowName = getParam<boolean>(ctx, 'useFlowName', i, false)
	const identifierKey = useFlowName ? 'flowName' : 'flowId'

	return {
		text: getParam<string>(ctx, 'flowText', i),
		cta: getParam<string>(ctx, 'flowCta', i),
		flowAction: getParam<string>(ctx, 'flowAction', i),
		screen: getParam<string>(ctx, 'flowScreen', i, ''),
		data: safeJsonParse(getParam<string>(ctx, 'flowData', i, '{}'), {}),
		draft: getParam<boolean>(ctx, 'flowDraft', i, false),
		[identifierKey]: getParam<string>(ctx, 'flowIdentifier', i),
	}
}

function buildGenericPayload(ctx: IExecuteFunctions, i: number): IDataObject {
	const payload: IDataObject = {
		title: getParam<string>(ctx, 'genericTitle', i, ''),
		subtitle: getParam<string>(ctx, 'genericSubtitle', i, ''),
	}
	const image = getParam<string>(ctx, 'genericImage', i, '')
	if (image) payload.image = image
	const footer = getParam<string>(ctx, 'footer', i, '')
	if (footer) payload.footer = footer
	const buttons = extractButtonsPayload(ctx, i)
	if (buttons) payload.buttons = buttons
	return payload
}

function buildProductPayload(ctx: IExecuteFunctions, i: number): IDataObject {
	return {
		text: getParam<string>(ctx, 'productText', i, ''),
		catalogId: getParam<string>(ctx, 'catalogId', i),
		productRetailerId: getParam<string>(ctx, 'productRetailerId', i),
	}
}

function buildProductListPayload(ctx: IExecuteFunctions, i: number): IDataObject {
	return {
		text: getParam<string>(ctx, 'productListText', i, ''),
		header: getParam<string>(ctx, 'productListHeader', i, ''),
		catalogId: getParam<string>(ctx, 'catalogId', i),
		sections: safeJsonParse(getParam<string>(ctx, 'productSections', i), []),
	}
}

const PAYLOAD_BUILDERS: Record<MessageType, (ctx: IExecuteFunctions, i: number) => IDataObject> = {
	text: buildTextPayload,
	image: (ctx, i) => buildMediaPayload(ctx, 'image', i),
	video: (ctx, i) => buildMediaPayload(ctx, 'video', i),
	audio: (ctx, i) => buildMediaPayload(ctx, 'audio', i),
	sticker: (ctx, i) => buildMediaPayload(ctx, 'sticker', i),
	file: buildFilePayload,
	location: buildLocationPayload,
	contact: buildContactPayload,
	list: buildListPayload,
	flows: buildFlowsPayload,
	generic: buildGenericPayload,
	product: buildProductPayload,
	productList: buildProductListPayload,
}

function buildPayload(ctx: IExecuteFunctions, messageType: MessageType, i: number): IDataObject {
	const builder = PAYLOAD_BUILDERS[messageType]
	return builder ? builder(ctx, i) : {}
}
