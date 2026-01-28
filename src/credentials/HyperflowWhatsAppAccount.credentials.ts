import type {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow'
import { config } from '../config'

export class HyperflowWhatsAppAccount implements ICredentialType {
    name = 'hyperflowWhatsAppAccount'
    displayName = 'Conta Hyperflow WhatsApp'
    documentationUrl = 'https://help.hyperflow.global/'
    icon = 'file:hyperflow.svg' as const

    properties: INodeProperties[] = [
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
    ]

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                'apikey': '={{$credentials.apiKey}}',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        },
    }

    test: ICredentialTestRequest = {
        request: {
            baseURL: config.apiUrl,
            url: config.endpoints.health,
            method: 'GET',
        },
    }
}
