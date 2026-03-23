import type {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow'
import { config } from '../config'

export class HyperflowWhatsAppAccount implements ICredentialType {
    name = 'HyperflowWhatsAppAccount'
    displayName = 'Hyperflow WhatsApp Account'
    documentationUrl = 'https://help.hyperflow.global/'
    icon: ICredentialType['icon'] = 'file:hyperflow.svg'

    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            description: 'API Key for authentication',
            required: true,
        },
    ]

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                'api-key': '={{$credentials.apiKey}}',
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
