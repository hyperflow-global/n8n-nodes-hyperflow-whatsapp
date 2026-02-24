import {
    safeJsonParse,
    isValidPhoneNumber,
    sanitizePhoneNumber,
    buildButton,
    isNonEmptyString,
} from '../../nodes/HyperflowWhatsApp/GenericFunctions'

describe('Utils', () => {
    describe('safeJsonParse', () => {
        it('should parse valid JSON string', () => {
            const result = safeJsonParse('{"name": "test"}', {})
            expect(result).toEqual({ name: 'test' })
        })

        it('should parse valid JSON array', () => {
            const result = safeJsonParse('[1, 2, 3]', [])
            expect(result).toEqual([1, 2, 3])
        })

        it('should return fallback for invalid JSON', () => {
            const result = safeJsonParse('invalid json', { default: true })
            expect(result).toEqual({ default: true })
        })

        it('should return fallback for empty string', () => {
            const result = safeJsonParse('', [])
            expect(result).toEqual([])
        })

        it('should return value as-is if not a string', () => {
            const obj = { already: 'parsed' }
            const result = safeJsonParse(obj, { already: '' })
            expect(result).toBe(obj)
        })

        it('should return array fallback for malformed array string', () => {
            const result = safeJsonParse('[1, 2, ', [])
            expect(result).toEqual([])
        })

        it('should handle nested JSON objects', () => {
            const json = '{"user": {"name": "John", "age": 30}}'
            const result = safeJsonParse(json, {})
            expect(result).toEqual({ user: { name: 'John', age: 30 } })
        })

        it('should handle JSON with special characters', () => {
            const json = '{"message": "Hello\\nWorld"}'
            const result = safeJsonParse(json, {})
            expect(result).toEqual({ message: 'Hello\nWorld' })
        })
    })

    describe('isValidPhoneNumber', () => {
        it('should return true for valid phone number with country code', () => {
            expect(isValidPhoneNumber('5511999999999')).toBe(true)
        })

        it('should return true for valid international number', () => {
            expect(isValidPhoneNumber('14155552671')).toBe(true)
        })

        it('should return true for phone with formatting', () => {
            expect(isValidPhoneNumber('+55 11 99999-9999')).toBe(true)
        })

        it('should return true for phone with parentheses', () => {
            expect(isValidPhoneNumber('(11) 99999-9999')).toBe(true)
        })

        it('should return false for too short number', () => {
            expect(isValidPhoneNumber('1234567')).toBe(false)
        })

        it('should return false for too long number', () => {
            expect(isValidPhoneNumber('1234567890123456')).toBe(false)
        })

        it('should return false for empty string', () => {
            expect(isValidPhoneNumber('')).toBe(false)
        })

        it('should return false for null/undefined', () => {
            expect(isValidPhoneNumber(null as unknown as string)).toBe(false)
            expect(isValidPhoneNumber(undefined as unknown as string)).toBe(false)
        })

        it('should return false for non-numeric string', () => {
            expect(isValidPhoneNumber('abcdefghij')).toBe(false)
        })

        it('should return false for mixed alphanumeric', () => {
            expect(isValidPhoneNumber('55119abc9999')).toBe(false)
        })
    })

    describe('sanitizePhoneNumber', () => {
        it('should remove spaces', () => {
            expect(sanitizePhoneNumber('55 11 99999 9999')).toBe('5511999999999')
        })

        it('should remove dashes', () => {
            expect(sanitizePhoneNumber('55-11-99999-9999')).toBe('5511999999999')
        })

        it('should remove parentheses', () => {
            expect(sanitizePhoneNumber('(55)(11)999999999')).toBe('5511999999999')
        })

        it('should remove plus sign', () => {
            expect(sanitizePhoneNumber('+5511999999999')).toBe('5511999999999')
        })

        it('should handle complex formatting', () => {
            expect(sanitizePhoneNumber('+55 (11) 99999-9999')).toBe('5511999999999')
        })

        it('should return empty string for null', () => {
            expect(sanitizePhoneNumber(null as unknown as string)).toBe('')
        })

        it('should return empty string for undefined', () => {
            expect(sanitizePhoneNumber(undefined as unknown as string)).toBe('')
        })

        it('should return empty string for non-string', () => {
            expect(sanitizePhoneNumber(12345 as unknown as string)).toBe('')
        })

        it('should keep already clean number unchanged', () => {
            expect(sanitizePhoneNumber('5511999999999')).toBe('5511999999999')
        })
    })

    describe('buildButton', () => {
        it('should build postback button with JSON data string', () => {
            const btn = {
                type: 'postback',
                id: 'btn1',
                label: 'Click me',
                data: '{"action": "click"}',
            }
            const result = buildButton(btn)
            expect(result).toEqual({
                type: 'postback',
                id: 'btn1',
                label: 'Click me',
                data: { action: 'click' },
            })
        })

        it('should build postback button with object data', () => {
            const btn = {
                type: 'postback',
                id: 'btn1',
                label: 'Click me',
                data: { action: 'click' },
            }
            const result = buildButton(btn)
            expect(result).toEqual({
                type: 'postback',
                id: 'btn1',
                label: 'Click me',
                data: { action: 'click' },
            })
        })

        it('should build postback button with invalid JSON data', () => {
            const btn = {
                type: 'postback',
                id: 'btn1',
                label: 'Click me',
                data: 'invalid json',
            }
            const result = buildButton(btn)
            expect(result).toEqual({
                type: 'postback',
                id: 'btn1',
                label: 'Click me',
                data: {},
            })
        })

        it('should build URL button', () => {
            const btn = {
                type: 'url',
                id: 'btn2',
                label: 'Visit',
                url: 'https://example.com',
            }
            const result = buildButton(btn)
            expect(result).toEqual({
                type: 'url',
                id: 'btn2',
                label: 'Visit',
                url: 'https://example.com',
            })
        })

        it('should build voice call button', () => {
            const btn = {
                type: 'voice_call',
                id: 'btn3',
                label: 'Call',
                ttlMinutes: 30,
            }
            const result = buildButton(btn)
            expect(result).toEqual({
                type: 'voice_call',
                id: 'btn3',
                label: 'Call',
                ttlMinutes: 30,
            })
        })

        it('should handle unknown button type', () => {
            const btn = {
                type: 'unknown',
                id: 'btn4',
                label: 'Unknown',
            }
            const result = buildButton(btn)
            expect(result).toEqual({
                type: 'unknown',
                id: 'btn4',
                label: 'Unknown',
            })
        })
    })

    describe('isNonEmptyString', () => {
        it('should return true for non-empty string', () => {
            expect(isNonEmptyString('hello')).toBe(true)
        })

        it('should return true for string with spaces', () => {
            expect(isNonEmptyString('  hello  ')).toBe(true)
        })

        it('should return false for empty string', () => {
            expect(isNonEmptyString('')).toBe(false)
        })

        it('should return false for whitespace-only string', () => {
            expect(isNonEmptyString('   ')).toBe(false)
        })

        it('should return false for null', () => {
            expect(isNonEmptyString(null)).toBe(false)
        })

        it('should return false for undefined', () => {
            expect(isNonEmptyString(undefined)).toBe(false)
        })

        it('should return false for number', () => {
            expect(isNonEmptyString(123)).toBe(false)
        })

        it('should return false for object', () => {
            expect(isNonEmptyString({})).toBe(false)
        })

        it('should return false for array', () => {
            expect(isNonEmptyString([])).toBe(false)
        })
    })
})
