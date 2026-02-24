"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractEventType = extractEventType;
exports.extractFromNumber = extractFromNumber;
exports.extractCloudApiMessage = extractCloudApiMessage;
exports.parseWebhookData = parseWebhookData;
const GenericFunctions_1 = require("./GenericFunctions");
const RAW_TYPE_TO_CATEGORY = {
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
};
// ─── Event Detection ─────────────────────────────────────────
function extractEventType(body) {
    if (isStatusObject(body))
        return 'status';
    const rawType = body.type;
    if (typeof rawType === 'string' && RAW_TYPE_TO_CATEGORY[rawType]) {
        return RAW_TYPE_TO_CATEGORY[rawType];
    }
    if (body.entry && Array.isArray(body.entry)) {
        return extractEventFromCloudApiEntry(body);
    }
    if (body.message || body.messages || body.text || body.from)
        return 'message';
    if (body.statuses || body.delivery)
        return 'status';
    if (body.button || body.postback || body.interactive) {
        return extractEventFromInteractive(body);
    }
    return 'message';
}
function isStatusObject(body) {
    if (!body.status || typeof body.status !== 'object')
        return false;
    const status = body.status;
    const statusType = status.type;
    return ['status', 'delivery', 'read', 'sent'].includes(statusType);
}
function extractEventFromCloudApiEntry(body) {
    const entry = body.entry[0];
    if (entry?.changes && Array.isArray(entry.changes)) {
        const change = entry.changes[0];
        if (change?.value) {
            const value = change.value;
            if (value.messages)
                return 'message';
            if (value.statuses)
                return 'status';
        }
    }
    return 'message';
}
function extractEventFromInteractive(body) {
    const interactive = body.interactive;
    if (interactive) {
        if (interactive.type === 'button_reply')
            return 'button';
        if (interactive.type === 'list_reply')
            return 'list';
        if (interactive.type === 'nfm_reply')
            return 'flow';
    }
    return 'button';
}
// ─── Sender Extraction ───────────────────────────────────────
function extractFromNumber(body) {
    if (body.from)
        return body.from;
    if (body.sender)
        return body.sender;
    if (body.phone)
        return body.phone;
    const cloudApiFrom = extractFromCloudApiPayload(body);
    if (cloudApiFrom)
        return cloudApiFrom;
    if (body.message && typeof body.message === 'object') {
        const message = body.message;
        if (message.from)
            return message.from;
    }
    return null;
}
function extractFromCloudApiPayload(body) {
    if (!body.entry || !Array.isArray(body.entry))
        return null;
    const entry = body.entry[0];
    if (!entry?.changes || !Array.isArray(entry.changes))
        return null;
    const change = entry.changes[0];
    if (!change?.value)
        return null;
    const value = change.value;
    if (value.messages && Array.isArray(value.messages)) {
        const msg = value.messages[0];
        if (msg?.from)
            return msg.from;
    }
    if (value.contacts && Array.isArray(value.contacts)) {
        const contact = value.contacts[0];
        if (contact?.wa_id)
            return contact.wa_id;
    }
    return null;
}
// ─── Cloud API Message Extraction ────────────────────────────
function extractCloudApiMessage(body) {
    const result = {};
    try {
        const entry = body.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;
        if (!value)
            return result;
        if (value.messages && Array.isArray(value.messages)) {
            const message = value.messages[0];
            if (message) {
                result.messageId = message.id;
                result.messageType = message.type;
                if (message.text && typeof message.text === 'object') {
                    result.text = message.text.body;
                }
                const mediaTypes = ['image', 'video', 'audio', 'document', 'sticker'];
                for (const mediaType of mediaTypes) {
                    if (message[mediaType]) {
                        result.media = message[mediaType];
                        break;
                    }
                }
                if (message.location)
                    result.location = message.location;
                if (message.contacts)
                    result.contacts = message.contacts;
                if (message.interactive)
                    result.interactive = message.interactive;
            }
        }
        if (value.contacts && Array.isArray(value.contacts)) {
            const contact = value.contacts[0];
            if (contact) {
                result.contactName = contact.profile?.name;
                result.from = contact.wa_id;
            }
        }
        if (value.metadata) {
            result.phoneNumberId = value.metadata.phone_number_id;
        }
    }
    catch {
        void 0;
    }
    return result;
}
// ─── Webhook Data Parsing ────────────────────────────────────
function parseWebhookData(body, eventType) {
    const result = {};
    result.from = extractFromNumber(body);
    const messageId = body.id ?? body.messageId ?? body.wamid;
    if (messageId)
        result.messageId = messageId;
    switch (eventType) {
        case 'message':
            parseMessageEvent(body, result);
            break;
        case 'status':
            parseStatusEvent(body, result);
            break;
        case 'button':
        case 'list':
            parseInteractiveEvent(body, result);
            break;
        case 'flow':
            parseFlowEvent(body, result);
            break;
    }
    return result;
}
function parseMessageEvent(body, result) {
    result.messageType = body.type || 'text';
    if (body.text)
        result.text = body.text;
    if (body.body)
        result.text = body.body;
    if (body.message && typeof body.message === 'object') {
        const msg = body.message;
        if (msg.text)
            result.text = msg.text;
        if (msg.body)
            result.text = msg.body;
        if (msg.type)
            result.messageType = msg.type;
    }
    if (body.entry && Array.isArray(body.entry)) {
        Object.assign(result, extractCloudApiMessage(body));
    }
}
function parseStatusEvent(body, result) {
    if (body.status && typeof body.status === 'object') {
        const status = body.status;
        if (status.type)
            result.status = status.type;
        if (status.id)
            result.messageId = status.id;
        if (status.externalId)
            result.externalId = status.externalId;
        Object.assign(result, status);
    }
    else if (body.status) {
        result.status = body.status;
    }
    if (body.delivery)
        result.status = 'delivered';
    if (body.read)
        result.status = 'read';
}
function parseInteractiveEvent(body, result) {
    if (body.payload)
        result.payload = body.payload;
    if (body.data)
        result.data = body.data;
    if (body.id)
        result.buttonId = body.id;
    if (body.title)
        result.buttonTitle = body.title;
    if (body.interactive && typeof body.interactive === 'object') {
        const interactive = body.interactive;
        if (interactive.button_reply) {
            const reply = interactive.button_reply;
            result.buttonId = reply.id;
            result.buttonTitle = reply.title;
        }
        if (interactive.list_reply) {
            const reply = interactive.list_reply;
            result.listId = reply.id;
            result.listTitle = reply.title;
            result.listDescription = reply.description;
        }
    }
}
function parseFlowEvent(body, result) {
    if (body.response_json) {
        result.flowResponse = (0, GenericFunctions_1.safeJsonParse)(body.response_json, body.response_json);
    }
    if (body.data)
        result.flowResponse = body.data;
}
//# sourceMappingURL=WebhookHelpers.js.map