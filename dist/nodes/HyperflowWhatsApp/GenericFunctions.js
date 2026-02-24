"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEnrichedErrorMessage = toEnrichedErrorMessage;
exports.hyperflowApiRequest = hyperflowApiRequest;
exports.resolveRecipient = resolveRecipient;
exports.handleOperationError = handleOperationError;
exports.safeJsonParse = safeJsonParse;
exports.isValidPhoneNumber = isValidPhoneNumber;
exports.sanitizePhoneNumber = sanitizePhoneNumber;
exports.isNonEmptyString = isNonEmptyString;
exports.buildButton = buildButton;
exports.extractButtonsPayload = extractButtonsPayload;
const n8n_workflow_1 = require("n8n-workflow");
const config_1 = require("../../config");
const CREDENTIAL_NAME = 'hyperflowWhatsAppAccount';
const PHONE_SANITIZE_REGEX = /[\s\-()+]/g;
const PHONE_VALID_REGEX = /^\d{8,15}$/;
function toEnrichedErrorMessage(error) {
    const base = error instanceof Error ? error.message : String(error);
    const err = error;
    if (err.response?.status !== undefined) {
        const body = err.response.data;
        const bodyStr = body != null ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
        return `[${err.response.status}] ${base}${bodyStr ? ` — ${bodyStr}` : ''}`;
    }
    if (err.statusCode !== undefined)
        return `[${err.statusCode}] ${base}`;
    return base;
}
// ─── API ─────────────────────────────────────────────────────
async function hyperflowApiRequest(method, endpoint, body = {}) {
    const options = {
        method,
        url: `${config_1.config.apiUrl}${endpoint}`,
        body,
        json: true,
    };
    return (await this.helpers.httpRequestWithAuthentication.call(this, CREDENTIAL_NAME, options));
}
// ─── Execution Helpers ───────────────────────────────────────
function resolveRecipient(ctx, itemIndex) {
    const rawTo = ctx.getNodeParameter('to', itemIndex);
    const to = sanitizePhoneNumber(rawTo);
    if (!isValidPhoneNumber(to)) {
        throw new n8n_workflow_1.NodeOperationError(ctx.getNode(), `Invalid phone number: "${rawTo}". Use format with country code (e.g., 5511999999999)`, { itemIndex });
    }
    return to;
}
function handleOperationError(ctx, error, itemIndex, returnData) {
    const errorMessage = toEnrichedErrorMessage(error);
    if (ctx.continueOnFail()) {
        returnData.push({
            json: { error: errorMessage },
            pairedItem: { item: itemIndex },
        });
        return;
    }
    throw new n8n_workflow_1.NodeOperationError(ctx.getNode(), errorMessage, { itemIndex });
}
// ─── Parsing & Validation ────────────────────────────────────
function safeJsonParse(value, fallback) {
    if (typeof value !== 'string')
        return value;
    try {
        return JSON.parse(value);
    }
    catch {
        return fallback;
    }
}
function isValidPhoneNumber(phone) {
    if (!phone || typeof phone !== 'string')
        return false;
    return PHONE_VALID_REGEX.test(phone.replace(PHONE_SANITIZE_REGEX, ''));
}
function sanitizePhoneNumber(phone) {
    if (!phone || typeof phone !== 'string')
        return '';
    return phone.replace(PHONE_SANITIZE_REGEX, '');
}
function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
// ─── Payload Builders ────────────────────────────────────────
function buildButton(btn) {
    const button = {
        type: btn.type,
        id: btn.id,
        label: btn.label,
    };
    switch (btn.type) {
        case 'url':
            button.url = btn.url;
            break;
        case 'postback':
            button.data = safeJsonParse(btn.data, {});
            break;
        case 'voice_call':
            button.ttlMinutes = btn.ttlMinutes;
            break;
    }
    return button;
}
function extractButtonsPayload(ctx, itemIndex) {
    const includeButtons = ctx.getNodeParameter('includeButtons', itemIndex, false);
    if (!includeButtons)
        return undefined;
    const buttonsData = ctx.getNodeParameter('buttons', itemIndex, {});
    const buttonValues = buttonsData?.buttonValues ?? [];
    return buttonValues.length > 0 ? buttonValues.map(buildButton) : undefined;
}
//# sourceMappingURL=GenericFunctions.js.map