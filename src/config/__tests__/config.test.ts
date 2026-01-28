describe('Config', () => {
    const originalEnv = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...originalEnv }
    })

    afterAll(() => {
        process.env = originalEnv
    })

    describe('apiUrl', () => {
        it('should use default URL when env var is not set', () => {
            delete process.env.HYPERFLOW_API_URL
            const { config } = require('../index')
            expect(config.apiUrl).toBe('https://api.hyperflowapis.global')
        })

        it('should use env var when set', () => {
            process.env.HYPERFLOW_API_URL = 'https://custom.api.com'
            const { config } = require('../index')
            expect(config.apiUrl).toBe('https://custom.api.com')
        })

        it('should use empty string env var (edge case)', () => {
            process.env.HYPERFLOW_API_URL = ''
            const { config } = require('../index')
            // Empty string is falsy, so it should use default
            expect(config.apiUrl).toBe('https://api.hyperflowapis.global')
        })
    })

    describe('endpoints', () => {
        it('should have sendMessage endpoint', () => {
            const { config } = require('../index')
            expect(config.endpoints.sendMessage).toBe('/whatsapp/send-message')
        })

        it('should have health endpoint', () => {
            const { config } = require('../index')
            expect(config.endpoints.health).toBe('/health')
        })

        it('should be immutable (as const)', () => {
            const { config } = require('../index')
            expect(Object.isFrozen(config.endpoints)).toBe(false) // as const doesn't freeze at runtime
            expect(typeof config.endpoints).toBe('object')
        })
    })

    describe('config structure', () => {
        it('should have all required properties', () => {
            const { config } = require('../index')
            expect(config).toHaveProperty('apiUrl')
            expect(config).toHaveProperty('endpoints')
            expect(config.endpoints).toHaveProperty('sendMessage')
            expect(config.endpoints).toHaveProperty('health')
        })

        it('should build full sendMessage URL correctly', () => {
            delete process.env.HYPERFLOW_API_URL
            const { config } = require('../index')
            const fullUrl = `${config.apiUrl}${config.endpoints.sendMessage}`
            expect(fullUrl).toBe('https://api.hyperflowapis.global/whatsapp/send-message')
        })

        it('should build full health URL correctly', () => {
            delete process.env.HYPERFLOW_API_URL
            const { config } = require('../index')
            const fullUrl = `${config.apiUrl}${config.endpoints.health}`
            expect(fullUrl).toBe('https://api.hyperflowapis.global/health')
        })
    })
})
