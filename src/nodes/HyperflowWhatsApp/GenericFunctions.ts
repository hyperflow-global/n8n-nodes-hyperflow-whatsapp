import type {
    IExecuteFunctions,
    INodeExecutionData,
    IDataObject,
    IHttpRequestMethods,
    IHttpRequestOptions,
} from 'n8n-workflow'
import { NodeOperationError } from 'n8n-workflow'
import { config } from '../../config'

const CREDENTIAL_NAME = 'hyperflowWhatsAppAccount'

const PHONE_SANITIZE_REGEX = /[\s\-()+]/g
const PHONE_VALID_REGEX = /^\d{8,15}$/

// ─── Error Handling ──────────────────────────────────────────

interface HttpError extends Error {
    response?: { status?: number; data?: unknown }
    statusCode?: number
}

export function toEnrichedErrorMessage(error: unknown): string {
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

// ─── API ─────────────────────────────────────────────────────

export async function hyperflowApiRequest(
    this: IExecuteFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
): Promise<IDataObject> {
    const options: IHttpRequestOptions = {
        method,
        url: `${config.apiUrl}${endpoint}`,
        body,
        json: true,
    }

    return (await this.helpers.httpRequestWithAuthentication.call(
        this,
        CREDENTIAL_NAME,
        options,
    )) as IDataObject
}

// ─── Execution Helpers ───────────────────────────────────────

export function resolveRecipient(
    ctx: IExecuteFunctions,
    itemIndex: number,
): string {
    const rawTo = ctx.getNodeParameter('to', itemIndex) as string
    const to = sanitizePhoneNumber(rawTo)

    if (!isValidPhoneNumber(to)) {
        throw new NodeOperationError(
            ctx.getNode(),
            `Invalid phone number: "${rawTo}". Use format with country code (e.g., 5511999999999)`,
            { itemIndex },
        )
    }

    return to
}

export function handleOperationError(
    ctx: IExecuteFunctions,
    error: unknown,
    itemIndex: number,
    returnData: INodeExecutionData[],
): void {
    const errorMessage = toEnrichedErrorMessage(error)
    if (ctx.continueOnFail()) {
        returnData.push({
            json: { error: errorMessage },
            pairedItem: { item: itemIndex },
        })
        return
    }
    throw new NodeOperationError(ctx.getNode(), errorMessage, { itemIndex })
}

// ─── Parsing & Validation ────────────────────────────────────

export function safeJsonParse<T>(value: string | T, fallback: T): T {
    if (typeof value !== 'string') return value
    try {
        return JSON.parse(value) as T
    } catch {
        return fallback
    }
}

export function isValidPhoneNumber(phone: string): boolean {
    if (!phone || typeof phone !== 'string') return false
    return PHONE_VALID_REGEX.test(phone.replace(PHONE_SANITIZE_REGEX, ''))
}

export function sanitizePhoneNumber(phone: string): string {
    if (!phone || typeof phone !== 'string') return ''
    return phone.replace(PHONE_SANITIZE_REGEX, '')
}

export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0
}

// ─── Payload Builders ────────────────────────────────────────

export function buildButton(btn: IDataObject): IDataObject {
    const button: IDataObject = {
        type: btn.type,
        id: btn.id,
        label: btn.label,
    }
    switch (btn.type) {
        case 'url':
            button.url = btn.url
            break
        case 'postback':
            button.data = safeJsonParse(btn.data as string, {})
            break
        case 'voice_call':
            button.ttlMinutes = btn.ttlMinutes
            break
    }
    return button
}

export function extractButtonsPayload(
    ctx: IExecuteFunctions,
    itemIndex: number,
): IDataObject[] | undefined {
    const includeButtons = ctx.getNodeParameter('includeButtons', itemIndex, false) as boolean
    if (!includeButtons) return undefined

    const buttonsData = ctx.getNodeParameter('buttons', itemIndex, {}) as IDataObject
    const buttonValues = (buttonsData?.buttonValues as IDataObject[]) ?? []
    return buttonValues.length > 0 ? buttonValues.map(buildButton) : undefined
}
