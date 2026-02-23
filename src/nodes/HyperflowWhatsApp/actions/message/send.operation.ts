import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow'
import { NodeOperationError } from 'n8n-workflow'
import {
	hyperflowApiRequest,
	toEnrichedErrorMessage,
	safeJsonParse,
	buildButton,
	isValidPhoneNumber,
	sanitizePhoneNumber,
} from '../../GenericFunctions'
import { config } from '../../../../config'

export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = []

	for (let i = 0; i < items.length; i++) {
		try {
			const messageType = this.getNodeParameter('messageType', i) as string
			const rawTo = this.getNodeParameter('to', i) as string
			const to = sanitizePhoneNumber(rawTo)

			if (!isValidPhoneNumber(to)) {
				throw new NodeOperationError(
					this.getNode(),
					`Invalid phone number: "${rawTo}". Use format with country code (e.g., 5511999999999)`,
					{ itemIndex: i },
				)
			}

			const payload = buildPayloadForMessageType.call(this, messageType, i)

			const requestBody: IDataObject = {
				to,
				type: messageType,
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

function buildPayloadForMessageType(
	this: IExecuteFunctions,
	messageType: string,
	i: number,
): IDataObject {
	const getParam = <T>(name: string, defaultValue?: T) =>
		this.getNodeParameter(name, i, defaultValue) as T

	switch (messageType) {
		case 'text': {
			const payload: IDataObject = { text: getParam<string>('text') }
			const footer = getParam<string>('footer', '')
			if (footer) payload.footer = footer
			const includeButtons = getParam<boolean>('includeButtons', false)
			if (includeButtons) {
				const buttonsData = getParam<IDataObject>('buttons', {})
				const buttonValues = (buttonsData?.buttonValues as IDataObject[]) ?? []
				if (buttonValues.length > 0) payload.buttons = buttonValues.map(buildButton)
			}
			return payload
		}

		case 'image':
		case 'video':
		case 'audio':
		case 'sticker': {
			const payload: IDataObject = { url: getParam<string>('mediaUrl') }
			if (messageType !== 'audio' && messageType !== 'sticker') {
				const caption = getParam<string>('caption', '')
				if (caption) payload.text = caption
			}
			return payload
		}

		case 'file': {
			const payload: IDataObject = { url: getParam<string>('mediaUrl') }
			const caption = getParam<string>('caption', '')
			const fileName = getParam<string>('fileName', '')
			if (caption) payload.text = caption
			if (fileName) payload.name = fileName
			return payload
		}

		case 'location':
			return {
				latitude: getParam<string>('latitude'),
				longitude: getParam<string>('longitude'),
				name: getParam<string>('locationName', ''),
				address: getParam<string>('address', ''),
			}

		case 'contact':
			return {
				name: getParam<string>('contactName'),
				phone: getParam<string>('contactPhone'),
				email: getParam<string>('contactEmail', ''),
				country: getParam<string>('countryCode', '55'),
			}

		case 'list': {
			const payload: IDataObject = {
				text: getParam<string>('listText'),
				button: getParam<string>('listButton'),
				sections: safeJsonParse(getParam<string>('sections'), []),
			}
			const footer = getParam<string>('footer', '')
			if (footer) payload.footer = footer
			return payload
		}

		case 'flows': {
			const payload: IDataObject = {
				text: getParam<string>('flowText'),
				cta: getParam<string>('flowCta'),
				flowAction: getParam<string>('flowAction'),
				screen: getParam<string>('flowScreen', ''),
				data: safeJsonParse(getParam<string>('flowData', '{}'), {}),
				draft: getParam<boolean>('flowDraft', false),
			}
			payload[getParam<boolean>('useFlowName', false) ? 'flowName' : 'flowId'] =
				getParam<string>('flowIdentifier')
			return payload
		}

		case 'generic': {
			const payload: IDataObject = {
				title: getParam<string>('genericTitle', ''),
				subtitle: getParam<string>('genericSubtitle', ''),
			}
			const image = getParam<string>('genericImage', '')
			if (image) payload.image = image
			const footer = getParam<string>('footer', '')
			if (footer) payload.footer = footer
			const includeButtons = getParam<boolean>('includeButtons', false)
			if (includeButtons) {
				const buttonsData = getParam<IDataObject>('buttons', {})
				const buttonValues = (buttonsData?.buttonValues as IDataObject[]) ?? []
				if (buttonValues.length > 0) payload.buttons = buttonValues.map(buildButton)
			}
			return payload
		}

		case 'product':
			return {
				text: getParam<string>('productText', ''),
				catalogId: getParam<string>('catalogId'),
				productRetailerId: getParam<string>('productRetailerId'),
			}

		case 'productList':
			return {
				text: getParam<string>('productListText', ''),
				header: getParam<string>('productListHeader', ''),
				catalogId: getParam<string>('catalogId'),
				sections: safeJsonParse(getParam<string>('productSections'), []),
			}

		default:
			return {}
	}
}
