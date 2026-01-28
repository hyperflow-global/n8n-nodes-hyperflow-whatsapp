/**
 * Hyperflow WhatsApp Node for n8n
 *
 * This package provides integration with Hyperflow WhatsApp API
 * for sending various types of WhatsApp messages.
 */

// Nodes
export { HyperflowWhatsApp } from './nodes/HyperflowWhatsApp/HyperflowWhatsApp.node'
export { HyperflowWhatsAppTrigger } from './nodes/HyperflowWhatsApp/HyperflowWhatsAppTrigger.node'

// Credentials
export { HyperflowWhatsAppAccount } from './credentials/HyperflowWhatsAppAccount.credentials'

// Config (for advanced usage)
export { config } from './config'

// Generic functions (for advanced usage)
export * from './nodes/HyperflowWhatsApp/GenericFunctions'
