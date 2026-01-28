/**
 * Send message operation for Hyperflow WhatsApp node
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow'
import { NodeOperationError } from 'n8n-workflow'
import {
	hyperflowApiRequest,
	safeJsonParse,
	buildButton,
	isValidPhoneNumber,
	sanitizePhoneNumber,
} from '../../GenericFunctions'
import { config } from '../../../../config'

/**
 * Execute the send message operation
 */
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

			let payload: IDataObject = {}

			// Build payload based on message type
			switch (messageType) {
				case 'text': {
					const text = this.getNodeParameter('text', i) as string
					const footer = this.getNodeParameter('footer', i, '') as string
					const includeButtons = this.getNodeParameter('includeButtons', i, false) as boolean

					payload = { text }
					if (footer) payload.footer = footer

					if (includeButtons) {
						const buttonsData = this.getNodeParameter('buttons', i, {}) as IDataObject
						const buttonValues = (buttonsData.buttonValues as IDataObject[]) || []

						if (buttonValues.length > 0) {
							payload.buttons = buttonValues.map(buildButton)
						}
					}
					break
				}

				case 'image':
				case 'video':
				case 'audio':
				case 'sticker': {
					const mediaUrl = this.getNodeParameter('mediaUrl', i) as string
					payload = { url: mediaUrl }

					if (messageType !== 'audio' && messageType !== 'sticker') {
						const caption = this.getNodeParameter('caption', i, '') as string
						if (caption) payload.text = caption
					}
					break
				}

				case 'file': {
					const mediaUrl = this.getNodeParameter('mediaUrl', i) as string
					const caption = this.getNodeParameter('caption', i, '') as string
					const fileName = this.getNodeParameter('fileName', i, '') as string

					payload = { url: mediaUrl }
					if (caption) payload.text = caption
					if (fileName) payload.name = fileName
					break
				}

				case 'location': {
					payload = {
						latitude: this.getNodeParameter('latitude', i) as string,
						longitude: this.getNodeParameter('longitude', i) as string,
						name: this.getNodeParameter('locationName', i, '') as string,
						address: this.getNodeParameter('address', i, '') as string,
					}
					break
				}

				case 'contact': {
					payload = {
						name: this.getNodeParameter('contactName', i) as string,
						phone: this.getNodeParameter('contactPhone', i) as string,
						email: this.getNodeParameter('contactEmail', i, '') as string,
						country: this.getNodeParameter('countryCode', i, '55') as string,
					}
					break
				}

				case 'list': {
					const sectionsJson = this.getNodeParameter('sections', i) as string
					payload = {
						text: this.getNodeParameter('listText', i) as string,
						button: this.getNodeParameter('listButton', i) as string,
						sections: safeJsonParse(sectionsJson, []),
					}

					const footer = this.getNodeParameter('footer', i, '') as string
					if (footer) payload.footer = footer
					break
				}

				case 'flows': {
					const flowDataJson = this.getNodeParameter('flowData', i, '{}') as string
					const useFlowName = this.getNodeParameter('useFlowName', i, false) as boolean
					const flowIdentifier = this.getNodeParameter('flowIdentifier', i) as string

					payload = {
						text: this.getNodeParameter('flowText', i) as string,
						cta: this.getNodeParameter('flowCta', i) as string,
						flowAction: this.getNodeParameter('flowAction', i) as string,
						screen: this.getNodeParameter('flowScreen', i, '') as string,
						data: safeJsonParse(flowDataJson, {}),
						draft: this.getNodeParameter('flowDraft', i, false) as boolean,
					}

					if (useFlowName) {
						payload.flowName = flowIdentifier
					} else {
						payload.flowId = flowIdentifier
					}
					break
				}

				case 'generic': {
					payload = {
						title: this.getNodeParameter('genericTitle', i, '') as string,
						subtitle: this.getNodeParameter('genericSubtitle', i, '') as string,
					}

					const image = this.getNodeParameter('genericImage', i, '') as string
					if (image) payload.image = image

					const footer = this.getNodeParameter('footer', i, '') as string
					if (footer) payload.footer = footer

					const includeButtons = this.getNodeParameter('includeButtons', i, false) as boolean
					if (includeButtons) {
						const buttonsData = this.getNodeParameter('buttons', i, {}) as IDataObject
						const buttonValues = (buttonsData.buttonValues as IDataObject[]) || []

						if (buttonValues.length > 0) {
							payload.buttons = buttonValues.map(buildButton)
						}
					}
					break
				}

				case 'product': {
					payload = {
						text: this.getNodeParameter('productText', i, '') as string,
						catalogId: this.getNodeParameter('catalogId', i) as string,
						productRetailerId: this.getNodeParameter('productRetailerId', i) as string,
					}
					break
				}

				case 'productList': {
					const sectionsJson = this.getNodeParameter('productSections', i) as string
					payload = {
						text: this.getNodeParameter('productListText', i, '') as string,
						header: this.getNodeParameter('productListHeader', i, '') as string,
						catalogId: this.getNodeParameter('catalogId', i) as string,
						sections: safeJsonParse(sectionsJson, []),
					}
					break
				}
			}

			// Build request body
			const requestBody = {
				to,
				type: messageType,
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
