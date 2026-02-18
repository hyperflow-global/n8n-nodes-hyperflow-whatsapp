const DEFAULT_API_URL = 'https://messaging.hyperflowapis.global'

export const config = {
	apiUrl: process.env.HYPERFLOW_API_URL || DEFAULT_API_URL,
	endpoints: {
		sendMessage: '/whatsapp/send-message',
		health: '/whatsapp/templates',
	},
} as const

export type Config = typeof config
