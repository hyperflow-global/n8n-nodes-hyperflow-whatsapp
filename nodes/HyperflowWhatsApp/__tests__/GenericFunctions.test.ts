import type { IExecuteFunctions, INode, INodeExecutionData } from 'n8n-workflow'
import { NodeApiError, NodeOperationError } from 'n8n-workflow'
import {
    safeJsonParse,
    isValidPhoneNumber,
    sanitizePhoneNumber,
    buildButton,
    isNonEmptyString,
    handleOperationError,
} from '../GenericFunctions'

const mockNode = {
    name: 'Test',
    type: 'test',
    typeVersion: 1,
    position: [0, 0],
    parameters: {},
} as INode

describe('GenericFunctions', () => {
    describe('handleOperationError', () => {
        it('should re-throw NodeApiError when continueOnFail is false', () => {
            const apiError = new NodeApiError(mockNode, {
                message: 'Bad request',
                httpCode: '400',
            })
            const ctx = {
                continueOnFail: () => false,
                getNode: () => mockNode,
            } as unknown as IExecuteFunctions
            const returnData: INodeExecutionData[] = []
            expect(() => handleOperationError(ctx, apiError, 0, returnData)).toThrow(apiError)
            expect(returnData).toHaveLength(0)
        })

        it('should push error item when continueOnFail is true', () => {
            const apiError = new NodeApiError(mockNode, {
                message: 'Bad request',
                httpCode: '400',
            })
            const ctx = {
                continueOnFail: () => true,
                getNode: () => mockNode,
            } as unknown as IExecuteFunctions
            const returnData: INodeExecutionData[] = []
            handleOperationError(ctx, apiError, 2, returnData)
            expect(returnData).toHaveLength(1)
            const item = returnData[0]
            expect(item).toBeDefined()
            expect(item!.pairedItem).toEqual({ item: 2 })
            expect(item!.json).toMatchObject({ error: expect.any(String) })
        })

        it('should wrap non-API errors in NodeOperationError when continueOnFail is false', () => {
            const ctx = {
                continueOnFail: () => false,
                getNode: () => mockNode,
            } as unknown as IExecuteFunctions
            expect(() =>
                handleOperationError(ctx, new Error('plain failure'), 0, []),
            ).toThrow(NodeOperationError)
        })
    })

    describe('safeJsonParse', () => {
        it('should parse valid JSON string', () => {
            const result = safeJsonParse('{"key": "value"}', {})
            expect(result).toEqual({ key: 'value' })
        })

        it('should return fallback for invalid JSON', () => {
            const result = safeJsonParse('invalid json', { default: true })
            expect(result).toEqual({ default: true })
        })

        it('should return value directly if not a string', () => {
            const obj = { key: 'value' }
            const result = safeJsonParse(obj, { key: '' })
            expect(result).toBe(obj)
        })

        it('should parse JSON array', () => {
            const result = safeJsonParse('["a", "b", "c"]', [])
            expect(result).toEqual(['a', 'b', 'c'])
        })
    })

    describe('isValidPhoneNumber', () => {
        it('should return true for valid phone with country code', () => {
            expect(isValidPhoneNumber('5511999999999')).toBe(true)
        })

        it('should return true for phone with formatting', () => {
            expect(isValidPhoneNumber('+55 11 99999-9999')).toBe(true)
        })

        it('should return false for too short number', () => {
            expect(isValidPhoneNumber('1234567')).toBe(false)
        })

        it('should return false for too long number', () => {
            expect(isValidPhoneNumber('1234567890123456')).toBe(false)
        })

        it('should return false for non-numeric string', () => {
            expect(isValidPhoneNumber('invalid')).toBe(false)
        })

        it('should return false for empty string', () => {
            expect(isValidPhoneNumber('')).toBe(false)
        })

        it('should return false for null/undefined', () => {
            expect(isValidPhoneNumber(null as any)).toBe(false)
            expect(isValidPhoneNumber(undefined as any)).toBe(false)
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
            expect(sanitizePhoneNumber('55(11)999999999')).toBe('5511999999999')
        })

        it('should remove plus sign', () => {
            expect(sanitizePhoneNumber('+5511999999999')).toBe('5511999999999')
        })

        it('should handle combined formatting', () => {
            expect(sanitizePhoneNumber('+55 (11) 99999-9999')).toBe('5511999999999')
        })

        it('should return empty string for null/undefined', () => {
            expect(sanitizePhoneNumber(null as any)).toBe('')
            expect(sanitizePhoneNumber(undefined as any)).toBe('')
        })
    })

    describe('buildButton', () => {
        it('should build postback button', () => {
            const btn = {
                type: 'postback',
                id: 'btn1',
                label: 'Click Me',
                data: '{"action": "click"}',
            }

            const result = buildButton(btn)

            expect(result).toEqual({
                type: 'postback',
                id: 'btn1',
                label: 'Click Me',
                data: { action: 'click' },
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
                label: 'Call Us',
                ttlMinutes: 30,
            }

            const result = buildButton(btn)

            expect(result).toEqual({
                type: 'voice_call',
                id: 'btn3',
                label: 'Call Us',
                ttlMinutes: 30,
            })
        })

        it('should handle invalid JSON in postback data', () => {
            const btn = {
                type: 'postback',
                id: 'btn1',
                label: 'Click Me',
                data: 'invalid json',
            }

            const result = buildButton(btn)

            expect(result.data).toEqual({})
        })
    })

    describe('isNonEmptyString', () => {
        it('should return true for non-empty string', () => {
            expect(isNonEmptyString('hello')).toBe(true)
        })

        it('should return false for empty string', () => {
            expect(isNonEmptyString('')).toBe(false)
        })

        it('should return false for whitespace only string', () => {
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
    })
})
