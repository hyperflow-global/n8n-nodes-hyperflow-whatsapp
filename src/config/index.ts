/**
 * Configuration constants for Hyperflow WhatsApp nodes
 *
 * Environment variables can be used to override default values
 * when running in different environments.
 */

const DEFAULT_API_URL = 'https://messaging.hyperflowapis.global'

export const config = {
    /**
     * Base URL for the Hyperflow WhatsApp API
     * Can be overridden via HYPERFLOW_API_URL environment variable
     */
    apiUrl: process.env.HYPERFLOW_API_URL || DEFAULT_API_URL,

    /**
     * Endpoints
     */
    endpoints: {
        sendMessage: '/whatsapp/send-message',
        health: '/whatsapp/templates',
    },
} as const

export type Config = typeof config
