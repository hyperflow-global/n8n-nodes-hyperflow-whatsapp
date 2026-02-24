export const config = {
	apiUrl: 'https://messaging.hyperflowapis.global',
	endpoints: {
		sendMessage: '/whatsapp/send-message',
		health: '/whatsapp/templates',
	},
} as const

export type Config = typeof config
