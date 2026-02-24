import { config } from '../index'

describe('Config', () => {
    describe('apiUrl', () => {
        it('should have the correct API URL', () => {
            expect(config.apiUrl).toBe('https://messaging.hyperflowapis.global')
        })
    })

    describe('endpoints', () => {
        it('should have sendMessage endpoint', () => {
            expect(config.endpoints.sendMessage).toBe('/whatsapp/send-message')
        })

        it('should have health endpoint', () => {
            expect(config.endpoints.health).toBe('/whatsapp/templates')
        })
    })

    describe('config structure', () => {
        it('should have all required properties', () => {
            expect(config).toHaveProperty('apiUrl')
            expect(config).toHaveProperty('endpoints')
            expect(config.endpoints).toHaveProperty('sendMessage')
            expect(config.endpoints).toHaveProperty('health')
        })

        it('should build full sendMessage URL correctly', () => {
            const fullUrl = `${config.apiUrl}${config.endpoints.sendMessage}`
            expect(fullUrl).toBe('https://messaging.hyperflowapis.global/whatsapp/send-message')
        })

        it('should build full health URL correctly', () => {
            const fullUrl = `${config.apiUrl}${config.endpoints.health}`
            expect(fullUrl).toBe('https://messaging.hyperflowapis.global/whatsapp/templates')
        })
    })
})
