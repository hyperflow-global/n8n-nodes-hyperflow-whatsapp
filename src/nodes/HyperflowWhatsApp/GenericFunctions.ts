/**
 * Generic functions for Hyperflow WhatsApp node
 */

import type {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow'
import { config } from '../../config'

/**
 * Make an authenticated API request to Hyperflow
 */
export async function hyperflowApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
): Promise<IDataObject> {
	const url = `${config.apiUrl}${endpoint}`

	const options: IHttpRequestOptions = {
		method,
		url,
		body,
		json: true,
	}

	return this.helpers.httpRequestWithAuthentication.call(
		this,
		'hyperflowWhatsAppAccount',
		options,
	) as Promise<IDataObject>
}

/**
 * Safely parse JSON string with fallback value
 * Prevents JSON.parse exceptions from crashing the workflow
 */
export function safeJsonParse<T>(value: string | T, fallback: T): T {
	if (typeof value !== 'string') {
		return value
	}

	try {
		return JSON.parse(value) as T
	} catch {
		return fallback
	}
}

/**
 * Validate phone number format
 * Accepts numbers with country code (e.g., 5511999999999)
 */
export function isValidPhoneNumber(phone: string): boolean {
	if (!phone || typeof phone !== 'string') {
		return false
	}

	// Remove common formatting characters
	const cleaned = phone.replace(/[\s\-()+"]/g, '').replace(/\+/g, '')

	// Check if it's a valid number (8 to 15 digits)
	return /^\d{8,15}$/.test(cleaned)
}

/**
 * Sanitize phone number by removing formatting characters
 */
export function sanitizePhoneNumber(phone: string): string {
	if (!phone || typeof phone !== 'string') {
		return ''
	}

	return phone.replace(/[\s\-()]/g, '').replace(/\+/g, '')
}

/**
 * Build button object from raw data with proper validation
 */
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

/**
 * Check if a value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0
}
