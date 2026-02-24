import { HyperflowWhatsAppTrigger } from '../HyperflowWhatsAppTrigger.node'
import type { IWebhookFunctions, IDataObject } from 'n8n-workflow'

describe('HyperflowWhatsAppTrigger Node', () => {
    let node: HyperflowWhatsAppTrigger

    beforeEach(() => {
        node = new HyperflowWhatsAppTrigger()
    })

    describe('description', () => {
        it('should have correct displayName', () => {
            expect(node.description.displayName).toBe('Hyperflow WhatsApp Trigger')
        })

        it('should have correct name', () => {
            expect(node.description.name).toBe('hyperflowWhatsAppTrigger')
        })

        it('should have version 1', () => {
            expect(node.description.version).toBe(1)
        })

        it('should be in trigger group', () => {
            expect(node.description.group).toContain('trigger')
        })

        it('should have no inputs and one output', () => {
            expect(node.description.inputs).toEqual([])
            expect(node.description.outputs).toEqual(['main'])
        })

        it('should have webhook configuration', () => {
            expect(node.description.webhooks).toBeDefined()
            expect(node.description.webhooks).toHaveLength(1)
            expect(node.description.webhooks![0]).toEqual({
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            })
        })

        it('should have events multiOptions property', () => {
            const eventsProperty = node.description.properties.find((p) => p.name === 'events')
            expect(eventsProperty).toBeDefined()
            expect(eventsProperty?.type).toBe('multiOptions')

            const options = (eventsProperty as any)?.options || []
            const optionValues = options.map((o: any) => o.value)

            expect(optionValues).toContain('message')
            expect(optionValues).toContain('status')
            expect(optionValues).toContain('button')
            expect(optionValues).toContain('list')
            expect(optionValues).toContain('flow')
        })
    })

    describe('webhook', () => {
        let mockWebhookFunctions: IWebhookFunctions
        let mockGetBodyData: jest.Mock
        let mockGetNodeParameter: jest.Mock
        let mockReturnJsonArray: jest.Mock

        beforeEach(() => {
            mockGetBodyData = jest.fn()
            mockGetNodeParameter = jest.fn()
            mockReturnJsonArray = jest.fn((data: any) => [{ json: data[0] }])

            mockWebhookFunctions = {
                getBodyData: mockGetBodyData,
                getNodeParameter: mockGetNodeParameter,
                helpers: {
                    returnJsonArray: mockReturnJsonArray,
                },
            } as unknown as IWebhookFunctions
        })

        it('should handle message event', async () => {
            const body: IDataObject = {
                type: 'text',
                from: '5511999999999',
                text: 'Hello',
                id: 'msg123',
            }

            mockGetBodyData.mockReturnValue(body)
            mockGetNodeParameter
                .mockReturnValueOnce(['message']) // events
                .mockReturnValueOnce({}) // options

            const result = await node.webhook.call(mockWebhookFunctions)

            expect(result.webhookResponse).toEqual({ status: 'ok' })
            expect(result.workflowData).toBeDefined()
        })

        it('should handle status event', async () => {
            const body: IDataObject = {
                type: 'status',
                status: 'delivered',
                id: 'msg123',
            }

            mockGetBodyData.mockReturnValue(body)
            mockGetNodeParameter
                .mockReturnValueOnce(['status']) // events
                .mockReturnValueOnce({}) // options

            const result = await node.webhook.call(mockWebhookFunctions)

            expect(result.webhookResponse).toEqual({ status: 'ok' })
            expect(result.workflowData).toBeDefined()
        })

        it('should handle button event', async () => {
            const body: IDataObject = {
                type: 'button',
                from: '5511999999999',
                payload: 'btn_click',
                id: 'btn1',
                title: 'Click Me',
            }

            mockGetBodyData.mockReturnValue(body)
            mockGetNodeParameter
                .mockReturnValueOnce(['button']) // events
                .mockReturnValueOnce({}) // options

            const result = await node.webhook.call(mockWebhookFunctions)

            expect(result.webhookResponse).toEqual({ status: 'ok' })
            expect(result.workflowData).toBeDefined()
        })

        it('should handle list event', async () => {
            const body: IDataObject = {
                type: 'list_reply',
                from: '5511999999999',
                interactive: {
                    type: 'list_reply',
                    list_reply: {
                        id: 'item1',
                        title: 'Option 1',
                        description: 'First option',
                    },
                },
            }

            mockGetBodyData.mockReturnValue(body)
            mockGetNodeParameter
                .mockReturnValueOnce(['list']) // events
                .mockReturnValueOnce({}) // options

            const result = await node.webhook.call(mockWebhookFunctions)

            expect(result.webhookResponse).toEqual({ status: 'ok' })
            expect(result.workflowData).toBeDefined()
        })

        it('should handle flow event', async () => {
            const body: IDataObject = {
                type: 'nfm_reply',
                from: '5511999999999',
                response_json: '{"field1": "value1"}',
            }

            mockGetBodyData.mockReturnValue(body)
            mockGetNodeParameter
                .mockReturnValueOnce(['flow']) // events
                .mockReturnValueOnce({}) // options

            const result = await node.webhook.call(mockWebhookFunctions)

            expect(result.webhookResponse).toEqual({ status: 'ok' })
            expect(result.workflowData).toBeDefined()
        })

        it('should reject event type not subscribed', async () => {
            const body: IDataObject = {
                type: 'status',
                status: 'delivered',
            }

            mockGetBodyData.mockReturnValue(body)
            mockGetNodeParameter
                .mockReturnValueOnce(['message']) // only subscribed to message
                .mockReturnValueOnce({}) // options

            const result = await node.webhook.call(mockWebhookFunctions)

            expect(result.webhookResponse).toEqual({
                status: 'ok',
                message: 'Tipo de evento não inscrito',
            })
            expect(result.workflowData).toBeUndefined()
        })

        it('should filter by phone number', async () => {
            const body: IDataObject = {
                type: 'text',
                from: '5511888888888',
                text: 'Hello',
            }

            mockGetBodyData.mockReturnValue(body)
            mockGetNodeParameter
                .mockReturnValueOnce(['message']) // events
                .mockReturnValueOnce({ filterNumbers: '5511999999999, 5511777777777' }) // options

            const result = await node.webhook.call(mockWebhookFunctions)

            expect(result.webhookResponse).toEqual({
                status: 'ok',
                message: 'Número não está na lista de filtros',
            })
            expect(result.workflowData).toBeUndefined()
        })

        it('should allow number in filter list', async () => {
            const body: IDataObject = {
                type: 'text',
                from: '5511999999999',
                text: 'Hello',
            }

            mockGetBodyData.mockReturnValue(body)
            mockGetNodeParameter
                .mockReturnValueOnce(['message']) // events
                .mockReturnValueOnce({ filterNumbers: '5511999999999, 5511777777777' }) // options

            const result = await node.webhook.call(mockWebhookFunctions)

            expect(result.webhookResponse).toEqual({ status: 'ok' })
            expect(result.workflowData).toBeDefined()
        })

        it('should handle number filter with formatting', async () => {
            const body: IDataObject = {
                type: 'text',
                from: '+55 11 99999-9999',
                text: 'Hello',
            }

            mockGetBodyData.mockReturnValue(body)
            mockGetNodeParameter
                .mockReturnValueOnce(['message']) // events
                .mockReturnValueOnce({ filterNumbers: '5511999999999' }) // options - without formatting

            const result = await node.webhook.call(mockWebhookFunctions)

            expect(result.webhookResponse).toEqual({ status: 'ok' })
            expect(result.workflowData).toBeDefined()
        })

        it('should return ok for invalid body', async () => {
            mockGetBodyData.mockReturnValue(null as any)
            mockGetNodeParameter
                .mockReturnValueOnce(['message'])
                .mockReturnValueOnce({})

            const result = await node.webhook.call(mockWebhookFunctions)

            expect(result.webhookResponse).toEqual({ status: 'ok' })
        })

        it('should handle WhatsApp Cloud API format', async () => {
            const body: IDataObject = {
                entry: [
                    {
                        changes: [
                            {
                                value: {
                                    messages: [
                                        {
                                            id: 'wamid123',
                                            from: '5511999999999',
                                            type: 'text',
                                            text: { body: 'Hello from Cloud API' },
                                        },
                                    ],
                                    contacts: [
                                        {
                                            wa_id: '5511999999999',
                                            profile: { name: 'John Doe' },
                                        },
                                    ],
                                    metadata: {
                                        phone_number_id: '123456789',
                                    },
                                },
                            },
                        ],
                    },
                ],
            }

            mockGetBodyData.mockReturnValue(body)
            mockGetNodeParameter
                .mockReturnValueOnce(['message']) // events
                .mockReturnValueOnce({}) // options

            const result = await node.webhook.call(mockWebhookFunctions)

            expect(result.webhookResponse).toEqual({ status: 'ok' })
            expect(result.workflowData).toBeDefined()
        })

        it('should handle Cloud API status updates', async () => {
            const body: IDataObject = {
                entry: [
                    {
                        changes: [
                            {
                                value: {
                                    statuses: [
                                        {
                                            id: 'wamid123',
                                            status: 'delivered',
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            }

            mockGetBodyData.mockReturnValue(body)
            mockGetNodeParameter
                .mockReturnValueOnce(['status']) // events
                .mockReturnValueOnce({}) // options

            const result = await node.webhook.call(mockWebhookFunctions)

            expect(result.webhookResponse).toEqual({ status: 'ok' })
            expect(result.workflowData).toBeDefined()
        })

        it('should include timestamp in output', async () => {
            const body: IDataObject = {
                type: 'text',
                from: '5511999999999',
                text: 'Hello',
            }

            mockGetBodyData.mockReturnValue(body)
            mockGetNodeParameter
                .mockReturnValueOnce(['message'])
                .mockReturnValueOnce({})


            let capturedData: any
            mockReturnJsonArray.mockImplementation((data) => {
                capturedData = data
                return [{ json: data[0] }]
            })

            await node.webhook.call(mockWebhookFunctions)

            expect(capturedData[0]).toHaveProperty('timestamp')
            expect(capturedData[0]).toHaveProperty('eventType', 'message')
            expect(capturedData[0]).toHaveProperty('rawData')
        })
    })
})
