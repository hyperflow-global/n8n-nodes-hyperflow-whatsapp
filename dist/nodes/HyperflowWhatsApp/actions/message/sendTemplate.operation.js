"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const config_1 = require("../../../../config");
const GenericFunctions_1 = require("../../GenericFunctions");
const HEADER_FIELD_MAP = {
    headerParameter: 'headerParameter',
    headerImageUrl: 'imageUrl',
    headerVideoUrl: 'videoUrl',
    headerDocumentUrl: 'documentUrl',
};
async function execute(items) {
    const returnData = [];
    for (let i = 0; i < items.length; i++) {
        try {
            const to = (0, GenericFunctions_1.resolveRecipient)(this, i);
            const payload = buildTemplatePayload(this, i);
            const response = await GenericFunctions_1.hyperflowApiRequest.call(this, 'POST', config_1.config.endpoints.sendMessage, { to, type: 'template', payload });
            returnData.push({ json: response, pairedItem: { item: i } });
        }
        catch (error) {
            (0, GenericFunctions_1.handleOperationError)(this, error, i, returnData);
        }
    }
    return returnData;
}
function buildTemplatePayload(ctx, i) {
    const payload = {
        name: ctx.getNodeParameter('templateName', i),
        language: ctx.getNodeParameter('templateLanguage', i),
        parameters: (0, GenericFunctions_1.safeJsonParse)(ctx.getNodeParameter('templateParameters', i, '[]'), []),
    };
    for (const [paramName, payloadKey] of Object.entries(HEADER_FIELD_MAP)) {
        const value = ctx.getNodeParameter(paramName, i, '');
        if (value)
            payload[payloadKey] = value;
    }
    const buttons = (0, GenericFunctions_1.safeJsonParse)(ctx.getNodeParameter('templateButtons', i, '[]'), []);
    if (buttons.length > 0)
        payload.buttons = buttons;
    return payload;
}
//# sourceMappingURL=sendTemplate.operation.js.map