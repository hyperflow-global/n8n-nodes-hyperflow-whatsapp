"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperflowWhatsAppTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const WebhookHelpers_1 = require("./WebhookHelpers");
class HyperflowWhatsAppTrigger {
    constructor() {
        this.description = {
            displayName: 'Hyperflow WhatsApp Trigger',
            name: 'hyperflowWhatsAppTrigger',
            icon: 'file:hyperflow.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["events"].join(", ")}}',
            description: 'Inicia o fluxo quando eventos do WhatsApp ocorrem. A resposta HTTP (200 OK) é enviada automaticamente ao receber o webhook — não use o nó "Respond to Webhook" neste workflow.',
            defaults: {
                name: 'Hyperflow WhatsApp Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'HyperflowWhatsAppAccount',
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
        };
    }
    async webhook() {
        const body = this.getBodyData();
        const events = this.getNodeParameter('events', []);
        const options = this.getNodeParameter('options', {});
        if (!body || typeof body !== 'object') {
            return { webhookResponse: { status: 'ok' } };
        }
        const eventType = (0, WebhookHelpers_1.extractEventType)(body);
        if (!events.includes(eventType)) {
            return {
                webhookResponse: { status: 'ok', message: 'Tipo de evento não inscrito' },
            };
        }
        if (isFilteredOut(body, options)) {
            return {
                webhookResponse: { status: 'ok', message: 'Número não está na lista de filtros' },
            };
        }
        const outputData = {
            eventType,
            timestamp: new Date().toISOString(),
            rawData: body,
            ...(0, WebhookHelpers_1.parseWebhookData)(body, eventType),
        };
        return {
            webhookResponse: { status: 'ok' },
            workflowData: [this.helpers.returnJsonArray([outputData])],
        };
    }
}
exports.HyperflowWhatsAppTrigger = HyperflowWhatsAppTrigger;
function isFilteredOut(body, options) {
    if (!options.filterNumbers)
        return false;
    const allowedNumbers = options.filterNumbers
        .split(',')
        .map((n) => (0, GenericFunctions_1.sanitizePhoneNumber)(n.trim()))
        .filter(Boolean);
    if (allowedNumbers.length === 0)
        return false;
    const fromNumber = (0, WebhookHelpers_1.extractFromNumber)(body);
    const sanitizedFrom = fromNumber ? (0, GenericFunctions_1.sanitizePhoneNumber)(fromNumber) : null;
    return !!sanitizedFrom && !allowedNumbers.includes(sanitizedFrom);
}
//# sourceMappingURL=HyperflowWhatsAppTrigger.node.js.map