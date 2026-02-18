import type {
    IDataObject,
    INodeType,
    INodeTypeDescription,
    IWebhookFunctions,
    IWebhookResponseData,
} from 'n8n-workflow'
import { safeJsonParse, sanitizePhoneNumber } from './GenericFunctions'

function extractEventType(body: IDataObject): string {
    if (body.status && typeof body.status === 'object') {
        const status = body.status as IDataObject
        const statusType = status.type as string
        if (statusType === 'status' || statusType === 'delivery' || statusType === 'read' || statusType === 'sent') {
            return 'status'
        }
    }

    if (body.type) {
        const type = body.type as string
        if (type === 'message' || type === 'text' || type === 'image' || type === 'video' ||
            type === 'audio' || type === 'document' || type === 'sticker' || type === 'location' ||
            type === 'contact' || type === 'voice') {
            return 'message'
        }
        if (type === 'status' || type === 'delivery' || type === 'read' || type === 'sent') {
            return 'status'
        }
        if (type === 'button' || type === 'postback') {
            return 'button'
        }
        if (type === 'list' || type === 'list_reply') {
            return 'list'
        }
        if (type === 'flow' || type === 'nfm_reply') {
            return 'flow'
        }
    }

    if (body.entry && Array.isArray(body.entry)) {
        const entry = body.entry[0] as IDataObject
        if (entry && entry.changes && Array.isArray(entry.changes)) {
            const change = (entry.changes as IDataObject[])[0]
            if (change && change.value) {
                const value = change.value as IDataObject
                if (value.messages) return 'message'
                if (value.statuses) return 'status'
            }
        }
    }

    if (body.message || body.messages || body.text || body.from) {
        return 'message'
    }

    if (body.statuses || body.delivery) {
        return 'status'
    }

    if (body.button || body.postback || body.interactive) {
        const interactive = body.interactive as IDataObject
        if (interactive) {
            if (interactive.type === 'button_reply') return 'button'
            if (interactive.type === 'list_reply') return 'list'
            if (interactive.type === 'nfm_reply') return 'flow'
        }
        return 'button'
    }

    return 'message'
}

function extractFromNumber(body: IDataObject): string | null {
    if (body.from) return body.from as string
    if (body.sender) return body.sender as string
    if (body.phone) return body.phone as string

    if (body.entry && Array.isArray(body.entry)) {
        const entry = body.entry[0] as IDataObject
        if (entry && entry.changes && Array.isArray(entry.changes)) {
            const change = (entry.changes as IDataObject[])[0]
            if (change && change.value) {
                const value = change.value as IDataObject
                if (value.messages && Array.isArray(value.messages)) {
                    const message = (value.messages as IDataObject[])[0]
                    if (message && message.from) return message.from as string
                }
                if (value.contacts && Array.isArray(value.contacts)) {
                    const contact = (value.contacts as IDataObject[])[0]
                    if (contact && contact.wa_id) return contact.wa_id as string
                }
            }
        }
    }

    if (body.message && typeof body.message === 'object') {
        const message = body.message as IDataObject
        if (message.from) return message.from as string
    }

    return null
}

function extractCloudApiMessage(body: IDataObject): IDataObject {
    const result: IDataObject = {}

    try {
        const entry = (body.entry as IDataObject[])[0]
        const change = (entry.changes as IDataObject[])[0]
        const value = change.value as IDataObject

        if (value.messages && Array.isArray(value.messages)) {
            const message = (value.messages as IDataObject[])[0]
            result.messageId = message.id
            result.messageType = message.type

            if (message.text && typeof message.text === 'object') {
                result.text = (message.text as IDataObject).body
            }
            if (message.image) result.media = message.image
            if (message.video) result.media = message.video
            if (message.audio) result.media = message.audio
            if (message.document) result.media = message.document
            if (message.sticker) result.media = message.sticker
            if (message.location) result.location = message.location
            if (message.contacts) result.contacts = message.contacts
            if (message.interactive) result.interactive = message.interactive
        }

        if (value.contacts && Array.isArray(value.contacts)) {
            const contact = (value.contacts as IDataObject[])[0]
            result.contactName = (contact.profile as IDataObject)?.name
            result.from = contact.wa_id
        }

        if (value.metadata) {
            result.phoneNumberId = (value.metadata as IDataObject).phone_number_id
        }
    } catch {
        void 0
    }

    return result
}

function parseWebhookData(body: IDataObject, eventType: string): IDataObject {
    const result: IDataObject = {}
    result.from = extractFromNumber(body)

    if (body.id) result.messageId = body.id
    if (body.messageId) result.messageId = body.messageId
    if (body.wamid) result.messageId = body.wamid

    switch (eventType) {
        case 'message':
            result.messageType = body.type || 'text'
            if (body.text) result.text = body.text
            if (body.body) result.text = body.body
            if (body.message && typeof body.message === 'object') {
                const msg = body.message as IDataObject
                if (msg.text) result.text = msg.text
                if (msg.body) result.text = msg.body
                if (msg.type) result.messageType = msg.type
            }
            if (body.entry && Array.isArray(body.entry)) {
                const extracted = extractCloudApiMessage(body)
                Object.assign(result, extracted)
            }
            break

        case 'status':
            if (body.status && typeof body.status === 'object') {
                const status = body.status as IDataObject
                if (status.type) result.status = status.type
                if (status.id) result.messageId = status.id
                if (status.externalId) result.externalId = status.externalId
                Object.assign(result, status)
            } else if (body.status) {
                result.status = body.status
            }
            if (body.delivery) result.status = 'delivered'
            if (body.read) result.status = 'read'
            break

        case 'button':
        case 'list':
            if (body.payload) result.payload = body.payload
            if (body.data) result.data = body.data
            if (body.id) result.buttonId = body.id
            if (body.title) result.buttonTitle = body.title
            if (body.interactive && typeof body.interactive === 'object') {
                const interactive = body.interactive as IDataObject
                if (interactive.button_reply) {
                    const reply = interactive.button_reply as IDataObject
                    result.buttonId = reply.id
                    result.buttonTitle = reply.title
                }
                if (interactive.list_reply) {
                    const reply = interactive.list_reply as IDataObject
                    result.listId = reply.id
                    result.listTitle = reply.title
                    result.listDescription = reply.description
                }
            }
            break

        case 'flow':
            if (body.response_json) {
                result.flowResponse = safeJsonParse(body.response_json as string, body.response_json)
            }
            if (body.data) result.flowResponse = body.data
            break
    }

    return result
}

export class HyperflowWhatsAppTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Hyperflow WhatsApp Trigger',
        name: 'hyperflowWhatsAppTrigger',
        icon: 'file:hyperflow.svg',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["events"].join(", ")}}',
        description: 'Inicia o fluxo quando eventos do WhatsApp ocorrem',
        defaults: {
            name: 'Hyperflow WhatsApp Trigger',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'hyperflowWhatsAppAccount',
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
                displayName: 'Eventos',
                name: 'events',
                type: 'multiOptions',
                options: [
                    {
                        name: 'Mensagem Recebida',
                        value: 'message',
                        description: 'Acionado quando uma mensagem é recebida',
                    },
                    {
                        name: 'Atualização de Status da Mensagem',
                        value: 'status',
                        description: 'Acionado quando o status da mensagem muda (enviada, entregue, lida)',
                    },
                    {
                        name: 'Clique em Botão',
                        value: 'button',
                        description: 'Acionado quando um botão é clicado',
                    },
                    {
                        name: 'Seleção de Lista',
                        value: 'list',
                        description: 'Acionado quando um item da lista é selecionado',
                    },
                    {
                        name: 'Resposta de Fluxo',
                        value: 'flow',
                        description: 'Acionado quando uma resposta de fluxo é recebida',
                    },
                ],
                default: ['message'],
                required: true,
                description: 'Quais eventos escutar',
            },
            {
                displayName: 'Opções',
                name: 'options',
                type: 'collection',
                placeholder: 'Adicionar Opção',
                default: {},
                options: [
                    {
                        displayName: 'Ignorar Atualizações de Status de Mensagens Próprias',
                        name: 'ignoreOwnStatus',
                        type: 'boolean',
                        default: true,
                        description: 'Se deve ignorar atualizações de status para mensagens enviadas por este número',
                    },
                    {
                        displayName: 'Apenas de Números Específicos',
                        name: 'filterNumbers',
                        type: 'string',
                        default: '',
                        placeholder: '5511999999999, 5511888888888',
                        description: 'Lista separada por vírgula de números de telefone para filtrar (deixe vazio para todos)',
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
            return {
                webhookResponse: { status: 'ok' },
            }
        }

        const eventType = extractEventType(body)

        if (!events.includes(eventType)) {
            return {
                webhookResponse: { status: 'ok', message: 'Tipo de evento não inscrito' },
            }
        }

        if (options.filterNumbers) {
            const allowedNumbers = (options.filterNumbers as string)
                .split(',')
                .map((n) => sanitizePhoneNumber(n.trim()))
                .filter(Boolean)

            const fromNumber = extractFromNumber(body)
            const sanitizedFromNumber = fromNumber ? sanitizePhoneNumber(fromNumber) : null
            if (allowedNumbers.length > 0 && sanitizedFromNumber && !allowedNumbers.includes(sanitizedFromNumber)) {
                return {
                    webhookResponse: { status: 'ok', message: 'Número não está na lista de filtros' },
                }
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
