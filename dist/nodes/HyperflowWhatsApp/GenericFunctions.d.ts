import type { IExecuteFunctions, INodeExecutionData, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
export declare function toEnrichedErrorMessage(error: unknown): string;
export declare function hyperflowApiRequest(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject): Promise<IDataObject>;
export declare function resolveRecipient(ctx: IExecuteFunctions, itemIndex: number): string;
export declare function handleOperationError(ctx: IExecuteFunctions, error: unknown, itemIndex: number, returnData: INodeExecutionData[]): void;
export declare function safeJsonParse<T>(value: string | T, fallback: T): T;
export declare function isValidPhoneNumber(phone: string): boolean;
export declare function sanitizePhoneNumber(phone: string): string;
export declare function isNonEmptyString(value: unknown): value is string;
export declare function buildButton(btn: IDataObject): IDataObject;
export declare function extractButtonsPayload(ctx: IExecuteFunctions, itemIndex: number): IDataObject[] | undefined;
//# sourceMappingURL=GenericFunctions.d.ts.map