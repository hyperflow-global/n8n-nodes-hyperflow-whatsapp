import type { IDataObject } from 'n8n-workflow';
export type WebhookEventCategory = 'message' | 'status' | 'button' | 'list' | 'flow';
export declare function extractEventType(body: IDataObject): WebhookEventCategory;
export declare function extractFromNumber(body: IDataObject): string | null;
export declare function extractCloudApiMessage(body: IDataObject): IDataObject;
export declare function parseWebhookData(body: IDataObject, eventType: WebhookEventCategory): IDataObject;
//# sourceMappingURL=WebhookHelpers.d.ts.map