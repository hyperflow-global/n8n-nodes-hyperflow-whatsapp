import type {
    IDataObject,
    INodeType,
    INodeTypeDescription,
    IWebhookFunctions,
    IWebhookResponseData,
} from 'n8n-workflow'
import { sanitizePhoneNumber } from './GenericFunctions'
import {
    extractEventType,
    extractFromNumber,
    parseWebhookData,
} from './WebhookHelpers'

export class HyperflowWhatsAppTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Hyperflow WhatsApp Trigger',
        name: 'hyperflowWhatsAppTrigger',
        icon: 'file:hyperflow.svg',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["events"].join(", ")}}',
        description:
            'Start the flow when WhatsApp events occur. The HTTP response (200 OK) is automatically sent when the webhook is received - do not use the "Respond to Webhook" node in this workflow.',
        defaults: {
            name: 'Hyperflow WhatsApp Trigger',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'HyperflowWhatsAppAccount',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [
            {
                displayName: 'Events',
                name: 'events',
                type: 'multiOptions',
                options: [
                    {
                        name: 'Message Received',
                        value: 'message',
                        description: 'Triggered when a message is received',
                    },
                    {
                        name: 'Message Status Update',
                        value: 'status',
                        description: 'Triggered when the message status changes (sent, delivered, read)',
                    },
                    {
                        name: 'Button Click',
                        value: 'button',
                        description: 'Triggered when a button is clicked',
                    },
                    {
                        name: 'List Selection',
                        value: 'list',
                        description: 'Triggered when an item of the list is selected',
                    },
                    {
                        name: 'Flow Response',
                        value: 'flow',
                        description: 'Triggered when a flow response is received',
                    },
                ],
                default: ['message'],
                required: true,
                description: 'Which events to listen to',
            },
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add Option',
                default: {},
                options: [
                    {
                        displayName: 'Ignore Own Message Status Updates',
                        name: 'ignoreOwnStatus',
                        type: 'boolean',
                        default: true,
                        description: 'Whether to ignore status updates for messages sent by this number',
                    },
                    {
                        displayName: 'Only Specific Numbers',
                        name: 'filterNumbers',
                        type: 'string',
                        default: '',
                        placeholder: '5511999999999, 5511888888888',
                        description: 'List of phone numbers separated by comma to filter (leave empty for all)',
                    },
                ],
            },
        ],
    }

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const body = this.getBodyData() as IDataObject
        const events = this.getNodeParameter('events', []) as string[]
        const options = this.getNodeParameter('options', {}) as IDataObject

        if (!body || typeof body !== 'object') {
            return { webhookResponse: { status: 'ok' } }
        }

        const eventType = extractEventType(body)

        if (!events.includes(eventType)) {
            return {
                webhookResponse: { status: 'ok', message: 'Event type not subscribed' },
            }
        }

        if (isFilteredOut(body, options)) {
            return {
                webhookResponse: { status: 'ok', message: 'Number is not in the filter list' },
            }
        }

        const outputData: IDataObject = {
            eventType,
            timestamp: new Date().toISOString(),
            rawData: body,
            ...parseWebhookData(body, eventType),
        }

        return {
            webhookResponse: { status: 'ok' },
            workflowData: [this.helpers.returnJsonArray([outputData])],
        }
    }
}

function isFilteredOut(body: IDataObject, options: IDataObject): boolean {
    if (!options.filterNumbers) return false

    const allowedNumbers = (options.filterNumbers as string)
        .split(',')
        .map((n) => sanitizePhoneNumber(n.trim()))
        .filter(Boolean)

    if (allowedNumbers.length === 0) return false

    const fromNumber = extractFromNumber(body)
    const sanitizedFrom = fromNumber ? sanitizePhoneNumber(fromNumber) : null

    return !!sanitizedFrom && !allowedNumbers.includes(sanitizedFrom)
}
