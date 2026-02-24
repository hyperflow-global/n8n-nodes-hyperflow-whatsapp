"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperflowWhatsAppAccount = void 0;
const config_1 = require("../config");
class HyperflowWhatsAppAccount {
    constructor() {
        this.name = 'HyperflowWhatsAppAccount';
        this.displayName = 'Conta Hyperflow WhatsApp';
        this.documentationUrl = 'https://help.hyperflow.global/';
        this.icon = 'file:hyperflow.svg';
        this.properties = [
            {
                displayName: 'Chave de API',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                description: 'Chave de API para autenticação',
                required: true,
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'api-key': '={{$credentials.apiKey}}',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            },
        };
        this.test = {
            request: {
                baseURL: config_1.config.apiUrl,
                url: config_1.config.endpoints.health,
                method: 'GET',
            },
        };
    }
}
exports.HyperflowWhatsAppAccount = HyperflowWhatsAppAccount;
//# sourceMappingURL=HyperflowWhatsAppAccount.credentials.js.map