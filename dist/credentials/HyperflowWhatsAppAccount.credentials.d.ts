import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class HyperflowWhatsAppAccount implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: ICredentialType['icon'];
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
//# sourceMappingURL=HyperflowWhatsAppAccount.credentials.d.ts.map