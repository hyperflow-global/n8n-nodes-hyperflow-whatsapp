import { HyperflowWhatsApp } from '../HyperflowWhatsApp.node'
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow'

describe('HyperflowWhatsApp Node', () => {
    let node: HyperflowWhatsApp

    beforeEach(() => {
        node = new HyperflowWhatsApp()
    })

    describe('description', () => {
        it('should have correct displayName', () => {
            expect(node.description.displayName).toBe('Hyperflow WhatsApp')
        })

        it('should have correct name', () => {
            expect(node.description.name).toBe('hyperflowWhatsApp')
        })

        it('should have version 1', () => {
            expect(node.description.version).toBe(1)
        })

        it('should require hyperflowWhatsAppAccount credentials', () => {
            expect(node.description.credentials).toEqual([
                {
                    name: 'hyperflowWhatsAppAccount',
                    required: true,
                },
            ])
        })

        it('should be in output group', () => {
            expect(node.description.group).toContain('output')
        })

        it('should have main input and output', () => {
            expect(node.description.inputs).toEqual(['main'])
            expect(node.description.outputs).toEqual(['main'])
        })

        it('should have resource property', () => {
            const resourceProperty = node.description.properties.find(
                (p) => p.name === 'resource',
            )
            expect(resourceProperty).toBeDefined()
            expect(resourceProperty?.type).toBe('options')

            const options = (resourceProperty as any)?.options || []
            const optionValues = options.map((o: any) => o.value)

            expect(optionValues).toContain('message')
        })

        it('should have operation property', () => {
            const operationProperty = node.description.properties.find(
                (p) => p.name === 'operation',
            )
            expect(operationProperty).toBeDefined()
            expect(operationProperty?.type).toBe('options')

            const options = (operationProperty as any)?.options || []
            const optionValues = options.map((o: any) => o.value)

            expect(optionValues).toContain('send')
            expect(optionValues).toContain('sendTemplate')
        })

        it('should have all message types for send operation', () => {
            const messageTypeProperty = node.description.properties.find(
                (p) => p.name === 'messageType',
            )
            expect(messageTypeProperty).toBeDefined()
            expect(messageTypeProperty?.type).toBe('options')

            const options = (messageTypeProperty as any)?.options || []
            const optionValues = options.map((o: any) => o.value)

            expect(optionValues).toContain('text')
            expect(optionValues).toContain('image')
            expect(optionValues).toContain('video')
            expect(optionValues).toContain('audio')
            expect(optionValues).toContain('file')
            expect(optionValues).toContain('sticker')
            expect(optionValues).toContain('location')
            expect(optionValues).toContain('contact')
            expect(optionValues).toContain('list')
            expect(optionValues).toContain('flows')
            expect(optionValues).toContain('generic')
            expect(optionValues).toContain('product')
            expect(optionValues).toContain('productList')
        })
    })

    describe('execute', () => {
        let mockExecuteFunctions: IExecuteFunctions
        let mockHttpRequest: jest.Mock
        let mockGetInputData: jest.Mock
        let mockGetNodeParameter: jest.Mock
        let mockContinueOnFail: jest.Mock

        beforeEach(() => {
            mockHttpRequest = jest.fn()
            mockGetInputData = jest.fn()
            mockGetNodeParameter = jest.fn()
            mockContinueOnFail = jest.fn().mockReturnValue(false)

            mockExecuteFunctions = {
                getInputData: mockGetInputData,
                getNodeParameter: mockGetNodeParameter,
                getNode: jest.fn().mockReturnValue({ name: 'Hyperflow WhatsApp' }),
                continueOnFail: mockContinueOnFail,
                helpers: {
                    httpRequestWithAuthentication: mockHttpRequest,
                },
            } as unknown as IExecuteFunctions
        })

        it('should send text message successfully', async () => {
            const inputData: INodeExecutionData[] = [{ json: {} }]

            mockGetInputData.mockReturnValue(inputData)
            mockGetNodeParameter.mockImplementation((name: string, _index: number, defaultValue?: any) => {
                const params: Record<string, any> = {
                    resource: 'message',
                    operation: 'send',
                    messageType: 'text',
                    to: '5511999999999',
                    text: 'Hello World',
                    footer: '',
                    includeButtons: false,
                }
                return params[name] ?? defaultValue
            })

            const mockResponse = { success: true, messageId: '123' }
            mockHttpRequest.mockResolvedValue(mockResponse)

            const result = await node.execute.call(mockExecuteFunctions)

            expect(result).toHaveLength(1)
            expect(result[0]!).toHaveLength(1)
            expect(result[0]![0]!.json).toEqual(mockResponse)

            expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
                'hyperflowWhatsAppAccount',
                expect.objectContaining({
                    method: 'POST',
                    url: expect.stringContaining('/whatsapp/send-message'),
                    body: expect.objectContaining({
                        to: '5511999999999',
                        type: 'text',
                        payload: { text: 'Hello World' },
                    }),
                    json: true,
                }),
            )
        })

        it('should send text message with buttons', async () => {
            const inputData: INodeExecutionData[] = [{ json: {} }]

            mockGetInputData.mockReturnValue(inputData)
            mockGetNodeParameter.mockImplementation((name: string, _index: number, defaultValue?: any) => {
                const params: Record<string, any> = {
                    resource: 'message',
                    operation: 'send',
                    messageType: 'text',
                    to: '5511999999999',
                    text: 'Choose an option',
                    footer: 'Footer text',
                    includeButtons: true,
                    buttons: {
                        buttonValues: [
                            { type: 'postback', id: 'btn1', label: 'Option 1', data: '{"action":"opt1"}' },
                            { type: 'url', id: 'btn2', label: 'Visit', url: 'https://example.com' },
                        ],
                    },
                }
                return params[name] ?? defaultValue
            })

            const mockResponse = { success: true }
            mockHttpRequest.mockResolvedValue(mockResponse)

            const result = await node.execute.call(mockExecuteFunctions)

            expect(result[0]![0]!.json).toEqual(mockResponse)

            const callArgs = mockHttpRequest.mock.calls[0]!
            const requestBody = callArgs[1].body

            expect(requestBody.payload.buttons).toHaveLength(2)
            expect(requestBody.payload.buttons[0]).toEqual({
                type: 'postback',
                id: 'btn1',
                label: 'Option 1',
                data: { action: 'opt1' },
            })
            expect(requestBody.payload.buttons[1]).toEqual({
                type: 'url',
                id: 'btn2',
                label: 'Visit',
                url: 'https://example.com',
            })
        })

        it('should send image message', async () => {
            const inputData: INodeExecutionData[] = [{ json: {} }]

            mockGetInputData.mockReturnValue(inputData)
            mockGetNodeParameter.mockImplementation((name: string, _index: number, defaultValue?: any) => {
                const params: Record<string, any> = {
                    resource: 'message',
                    operation: 'send',
                    messageType: 'image',
                    to: '5511999999999',
                    mediaUrl: 'https://example.com/image.jpg',
                    caption: 'Image caption',
                }
                return params[name] ?? defaultValue
            })

            const mockResponse = { success: true }
            mockHttpRequest.mockResolvedValue(mockResponse)

            await node.execute.call(mockExecuteFunctions)

            const callArgs = mockHttpRequest.mock.calls[0]!
            const requestBody = callArgs[1].body

            expect(requestBody.type).toBe('image')
            expect(requestBody.payload.url).toBe('https://example.com/image.jpg')
            expect(requestBody.payload.text).toBe('Image caption')
        })

        it('should send location message', async () => {
            const inputData: INodeExecutionData[] = [{ json: {} }]

            mockGetInputData.mockReturnValue(inputData)
            mockGetNodeParameter.mockImplementation((name: string, _index: number, defaultValue?: any) => {
                const params: Record<string, any> = {
                    resource: 'message',
                    operation: 'send',
                    messageType: 'location',
                    to: '5511999999999',
                    latitude: '-23.5505',
                    longitude: '-46.6333',
                    locationName: 'São Paulo',
                    address: 'Av. Paulista',
                }
                return params[name] ?? defaultValue
            })

            const mockResponse = { success: true }
            mockHttpRequest.mockResolvedValue(mockResponse)

            await node.execute.call(mockExecuteFunctions)

            const callArgs = mockHttpRequest.mock.calls[0]!
            const requestBody = callArgs[1].body

            expect(requestBody.type).toBe('location')
            expect(requestBody.payload).toEqual({
                latitude: '-23.5505',
                longitude: '-46.6333',
                name: 'São Paulo',
                address: 'Av. Paulista',
            })
        })

        it('should send template message (sendTemplate operation)', async () => {
            const inputData: INodeExecutionData[] = [{ json: {} }]

            mockGetInputData.mockReturnValue(inputData)
            mockGetNodeParameter.mockImplementation((name: string, _index: number, defaultValue?: any) => {
                const params: Record<string, any> = {
                    resource: 'message',
                    operation: 'sendTemplate',
                    to: '5511999999999',
                    templateName: 'welcome_template',
                    templateLanguage: 'pt_BR',
                    templateParameters: '["param1", "param2"]',
                    templateButtons: '[]',
                    headerParameter: '',
                    headerImageUrl: '',
                    headerVideoUrl: '',
                    headerDocumentUrl: '',
                }
                return params[name] ?? defaultValue
            })

            const mockResponse = { success: true }
            mockHttpRequest.mockResolvedValue(mockResponse)

            await node.execute.call(mockExecuteFunctions)

            const callArgs = mockHttpRequest.mock.calls[0]!
            const requestBody = callArgs[1].body

            expect(requestBody.type).toBe('template')
            expect(requestBody.payload.name).toBe('welcome_template')
            expect(requestBody.payload.language).toBe('pt_BR')
            expect(requestBody.payload.parameters).toEqual(['param1', 'param2'])
        })

        it('should throw error for invalid phone number', async () => {
            const inputData: INodeExecutionData[] = [{ json: {} }]

            mockGetInputData.mockReturnValue(inputData)
            mockGetNodeParameter.mockImplementation((name: string, _index: number, defaultValue?: any) => {
                const params: Record<string, any> = {
                    resource: 'message',
                    operation: 'send',
                    messageType: 'text',
                    to: 'invalid',
                }
                return params[name] ?? defaultValue
            })

            await expect(node.execute.call(mockExecuteFunctions)).rejects.toThrow(
                /Invalid phone number/,
            )
        })

        it('should continue on fail when configured', async () => {
            const inputData: INodeExecutionData[] = [{ json: {} }]

            mockGetInputData.mockReturnValue(inputData)
            mockContinueOnFail.mockReturnValue(true)
            mockGetNodeParameter.mockImplementation((name: string, _index: number, defaultValue?: any) => {
                const params: Record<string, any> = {
                    resource: 'message',
                    operation: 'send',
                    messageType: 'text',
                    to: '5511999999999',
                    text: 'Hello',
                    footer: '',
                    includeButtons: false,
                }
                return params[name] ?? defaultValue
            })

            mockHttpRequest.mockRejectedValue(new Error('API Error'))

            const result = await node.execute.call(mockExecuteFunctions)

            expect(result[0]![0]!.json).toHaveProperty('error', 'API Error')
        })

        it('should handle multiple items', async () => {
            const inputData: INodeExecutionData[] = [{ json: {} }, { json: {} }]

            mockGetInputData.mockReturnValue(inputData)

            mockGetNodeParameter.mockImplementation((name: string, index: number, defaultValue?: any) => {
                const messages = [
                    {
                        resource: 'message',
                        operation: 'send',
                        messageType: 'text',
                        to: '5511999999999',
                        text: 'Message 1',
                        footer: '',
                        includeButtons: false,
                    },
                    {
                        resource: 'message',
                        operation: 'send',
                        messageType: 'text',
                        to: '5511888888888',
                        text: 'Message 2',
                        footer: '',
                        includeButtons: false,
                    },
                ]
                return messages[index]?.[name as keyof typeof messages[0]] ?? defaultValue
            })

            mockHttpRequest
                .mockResolvedValueOnce({ success: true, id: '1' })
                .mockResolvedValueOnce({ success: true, id: '2' })

            const result = await node.execute.call(mockExecuteFunctions)

            expect(result[0]!).toHaveLength(2)
            expect(mockHttpRequest).toHaveBeenCalledTimes(2)
        })
    })
})
