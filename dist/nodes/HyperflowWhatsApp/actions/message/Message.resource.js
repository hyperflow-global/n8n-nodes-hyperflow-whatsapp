"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phoneNumberField = exports.messageOperations = void 0;
exports.messageOperations = {
    displayName: 'Operação',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['message'] } },
    options: [
        {
            name: 'Enviar',
            value: 'send',
            description: 'Enviar uma mensagem (texto, imagem, vídeo, áudio, arquivo, localização, contato, lista, fluxos, etc.)',
            action: 'Enviar uma mensagem',
        },
        {
            name: 'Enviar Template',
            value: 'sendTemplate',
            description: 'Enviar uma mensagem de template HSM pré-aprovado',
            action: 'Enviar uma mensagem de template',
        },
    ],
    default: 'send',
};
exports.phoneNumberField = {
    displayName: 'Número de Telefone do Destinatário',
    name: 'to',
    type: 'string',
    required: true,
    default: '',
    placeholder: '5511999999999',
    description: 'Número de telefone com código de país (ex: 5511999999999)',
    displayOptions: { show: { resource: ['message'] } },
};
//# sourceMappingURL=Message.resource.js.map