import type { IDataObject } from 'n8n-workflow'
import { safeJsonParse } from './GenericFunctions'

export type WebhookEventCategory = 'message' | 'status' | 'button' | 'list' | 'flow'

const RAW_TYPE_TO_CATEGORY: Readonly<Record<string, WebhookEventCategory>> = {
    message: 'message',
    text: 'message',
    image: 'message',
    video: 'message',
    audio: 'message',
    document: 'message',
    sticker: 'message',
    location: 'message',
    contact: 'message',
    voice: 'message',
    status: 'status',
    delivery: 'status',
    read: 'status',
    sent: 'status',
    button: 'button',
    postback: 'button',
    list: 'list',
    list_reply: 'list',
    flow: 'flow',
    nfm_reply: 'flow',
}

// ─── Event Detection ─────────────────────────────────────────

export function extractEventType(body: IDataObject): WebhookEventCategory {
    if (isStatusObject(body)) return 'status'

    const rawType = body.type
    if (typeof rawType === 'string' && RAW_TYPE_TO_CATEGORY[rawType]) {
        return RAW_TYPE_TO_CATEGORY[rawType]
    }

    if (body.entry && Array.isArray(body.entry)) {
        return extractEventFromCloudApiEntry(body)
    }

    if (body.message || body.messages || body.text || body.from) return 'message'
    if (body.statuses || body.delivery) return 'status'

    if (body.button || body.postback || body.interactive) {
        return extractEventFromInteractive(body)
    }

    return 'message'
}

function isStatusObject(body: IDataObject): boolean {
    if (!body.status || typeof body.status !== 'object') return false
    const status = body.status as IDataObject
    const statusType = status.type as string
    return ['status', 'delivery', 'read', 'sent'].includes(statusType)
}

function extractEventFromCloudApiEntry(body: IDataObject): WebhookEventCategory {
    const entry = (body.entry as IDataObject[])[0]
    if (entry?.changes && Array.isArray(entry.changes)) {
        const change = (entry.changes as IDataObject[])[0]
        if (change?.value) {
            const value = change.value as IDataObject
            if (value.messages) return 'message'
            if (value.statuses) return 'status'
        }
    }
    return 'message'
}

function extractEventFromInteractive(body: IDataObject): WebhookEventCategory {
    const interactive = body.interactive as IDataObject
    if (interactive) {
        if (interactive.type === 'button_reply') return 'button'
        if (interactive.type === 'list_reply') return 'list'
        if (interactive.type === 'nfm_reply') return 'flow'
    }
    return 'button'
}

// ─── Sender Extraction ───────────────────────────────────────

export function extractFromNumber(body: IDataObject): string | null {
    if (body.from) return body.from as string
    if (body.sender) return body.sender as string
    if (body.phone) return body.phone as string

    const cloudApiFrom = extractFromCloudApiPayload(body)
    if (cloudApiFrom) return cloudApiFrom

    if (body.message && typeof body.message === 'object') {
        const message = body.message as IDataObject
        if (message.from) return message.from as string
    }

    return null
}

function extractFromCloudApiPayload(body: IDataObject): string | null {
    if (!body.entry || !Array.isArray(body.entry)) return null

    const entry = body.entry[0] as IDataObject
    if (!entry?.changes || !Array.isArray(entry.changes)) return null

    const change = (entry.changes as IDataObject[])[0]
    if (!change?.value) return null

    const value = change.value as IDataObject

    if (value.messages && Array.isArray(value.messages)) {
        const msg = (value.messages as IDataObject[])[0]
        if (msg?.from) return msg.from as string
    }
    if (value.contacts && Array.isArray(value.contacts)) {
        const contact = (value.contacts as IDataObject[])[0]
        if (contact?.wa_id) return contact.wa_id as string
    }

    return null
}

// ─── Cloud API Message Extraction ────────────────────────────

export function extractCloudApiMessage(body: IDataObject): IDataObject {
    const result: IDataObject = {}

    try {
        const entry = (body.entry as IDataObject[] | undefined)?.[0]
        const change = (entry?.changes as IDataObject[] | undefined)?.[0]
        const value = change?.value as IDataObject | undefined
        if (!value) return result

        if (value.messages && Array.isArray(value.messages)) {
            const message = (value.messages as IDataObject[])[0]
            if (message) {
                result.messageId = message.id
                result.messageType = message.type

                if (message.text && typeof message.text === 'object') {
                    result.text = (message.text as IDataObject).body
                }

                const mediaTypes = ['image', 'video', 'audio', 'document', 'sticker'] as const
                for (const mediaType of mediaTypes) {
                    if (message[mediaType]) {
                        result.media = message[mediaType]
                        break
                    }
                }

                if (message.location) result.location = message.location
                if (message.contacts) result.contacts = message.contacts
                if (message.interactive) result.interactive = message.interactive
            }
        }

        if (value.contacts && Array.isArray(value.contacts)) {
            const contact = (value.contacts as IDataObject[])[0]
            if (contact) {
                result.contactName = (contact.profile as IDataObject)?.name
                result.from = contact.wa_id
            }
        }

        if (value.metadata) {
            result.phoneNumberId = (value.metadata as IDataObject).phone_number_id
        }
    } catch {
        void 0
    }

    return result
}

// ─── Webhook Data Parsing ────────────────────────────────────

export function parseWebhookData(body: IDataObject, eventType: WebhookEventCategory): IDataObject {
    const result: IDataObject = {}
    result.from = extractFromNumber(body)

    const messageId = body.id ?? body.messageId ?? body.wamid
    if (messageId) result.messageId = messageId

    switch (eventType) {
        case 'message':
            parseMessageEvent(body, result)
            break
        case 'status':
            parseStatusEvent(body, result)
            break
        case 'button':
        case 'list':
            parseInteractiveEvent(body, result)
            break
        case 'flow':
            parseFlowEvent(body, result)
            break
    }

    return result
}

function parseMessageEvent(body: IDataObject, result: IDataObject): void {
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
        Object.assign(result, extractCloudApiMessage(body))
    }
}

function parseStatusEvent(body: IDataObject, result: IDataObject): void {
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
}

function parseInteractiveEvent(body: IDataObject, result: IDataObject): void {
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
}

function parseFlowEvent(body: IDataObject, result: IDataObject): void {
    if (body.response_json) {
        result.flowResponse = safeJsonParse(body.response_json as string, body.response_json)
    }
    if (body.data) result.flowResponse = body.data
}
