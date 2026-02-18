import type { IDataObject } from 'n8n-workflow'

const PHONE_CLEAN_REGEX = /[\s\-()+]/g
const PHONE_VALID_REGEX = /^\d{8,15}$/

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
	return PHONE_VALID_REGEX.test(phone.replace(PHONE_CLEAN_REGEX, ''))
}

export function sanitizePhoneNumber(phone: string): string {
	if (!phone || typeof phone !== 'string') return ''
	return phone.replace(PHONE_CLEAN_REGEX, '')
}

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

export function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0
}
