import type {
    IDataObject,
    INodeType,
    INodeTypeDescription,
    IWebhookFunctions,
    IWebhookResponseData,
} from 'n8n-workflow'
import { sanitizePhoneNumber } from './GenericFunctions'
import {
    extractEventType,
    extractFromNumber,
    parseWebhookData,
} from './WebhookHelpers'

export class HyperflowWhatsAppTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Hyperflow WhatsApp Trigger',
        name: 'hyperflowWhatsAppTrigger',
        icon: 'file:hyperflow.svg',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["events"].join(", ")}}',
        description:
            'Inicia o fluxo quando eventos do WhatsApp ocorrem. A resposta HTTP (200 OK) é enviada automaticamente ao receber o webhook — não use o nó "Respond to Webhook" neste workflow.',
        defaults: {
            name: 'Hyperflow WhatsApp Trigger',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'hyperflowWhatsAppAccount',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [
            {
                displayName: 'Eventos',
                name: 'events',
                type: 'multiOptions',
                options: [
                    {
                        name: 'Mensagem Recebida',
                        value: 'message',
                        description: 'Acionado quando uma mensagem é recebida',
                    },
                    {
                        name: 'Atualização de Status da Mensagem',
                        value: 'status',
                        description: 'Acionado quando o status da mensagem muda (enviada, entregue, lida)',
                    },
                    {
                        name: 'Clique em Botão',
                        value: 'button',
                        description: 'Acionado quando um botão é clicado',
                    },
                    {
                        name: 'Seleção de Lista',
                        value: 'list',
                        description: 'Acionado quando um item da lista é selecionado',
                    },
                    {
                        name: 'Resposta de Fluxo',
                        value: 'flow',
                        description: 'Acionado quando uma resposta de fluxo é recebida',
                    },
                ],
                default: ['message'],
                required: true,
                description: 'Quais eventos escutar',
            },
            {
                displayName: 'Opções',
                name: 'options',
                type: 'collection',
                placeholder: 'Adicionar Opção',
                default: {},
                options: [
                    {
                        displayName: 'Ignorar Atualizações de Status de Mensagens Próprias',
                        name: 'ignoreOwnStatus',
                        type: 'boolean',
                        default: true,
                        description: 'Se deve ignorar atualizações de status para mensagens enviadas por este número',
                    },
                    {
                        displayName: 'Apenas de Números Específicos',
                        name: 'filterNumbers',
                        type: 'string',
                        default: '',
                        placeholder: '5511999999999, 5511888888888',
                        description: 'Lista separada por vírgula de números de telefone para filtrar (deixe vazio para todos)',
                    },
                ],
            },
        ],
    }

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const body = this.getBodyData() as IDataObject
        const events = this.getNodeParameter('events', []) as string[]
        const options = this.getNodeParameter('options', {}) as IDataObject

        if (!body || typeof body !== 'object') {
            return { webhookResponse: { status: 'ok' } }
        }

        const eventType = extractEventType(body)

        if (!events.includes(eventType)) {
            return {
                webhookResponse: { status: 'ok', message: 'Tipo de evento não inscrito' },
            }
        }

        if (isFilteredOut(body, options)) {
            return {
                webhookResponse: { status: 'ok', message: 'Número não está na lista de filtros' },
            }
        }

        const outputData: IDataObject = {
            eventType,
            timestamp: new Date().toISOString(),
            rawData: body,
            ...parseWebhookData(body, eventType),
        }

        return {
            webhookResponse: { status: 'ok' },
            workflowData: [this.helpers.returnJsonArray([outputData])],
        }
    }
}

function isFilteredOut(body: IDataObject, options: IDataObject): boolean {
    if (!options.filterNumbers) return false

    const allowedNumbers = (options.filterNumbers as string)
        .split(',')
        .map((n) => sanitizePhoneNumber(n.trim()))
        .filter(Boolean)

    if (allowedNumbers.length === 0) return false

    const fromNumber = extractFromNumber(body)
    const sanitizedFrom = fromNumber ? sanitizePhoneNumber(fromNumber) : null

    return !!sanitizedFrom && !allowedNumbers.includes(sanitizedFrom)
}
