"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const GenericFunctions_1 = require("../../GenericFunctions");
const config_1 = require("../../../../config");
async function execute(items) {
    const returnData = [];
    for (let i = 0; i < items.length; i++) {
        try {
            const messageType = this.getNodeParameter('messageType', i);
            const to = (0, GenericFunctions_1.resolveRecipient)(this, i);
            const payload = buildPayload(this, messageType, i);
            const response = await GenericFunctions_1.hyperflowApiRequest.call(this, 'POST', config_1.config.endpoints.sendMessage, { to, type: messageType, payload });
            returnData.push({ json: response, pairedItem: { item: i } });
        }
        catch (error) {
            (0, GenericFunctions_1.handleOperationError)(this, error, i, returnData);
        }
    }
    return returnData;
}
// ─── Payload Builders (one per message type) ─────────────────
function getParam(ctx, name, index, defaultValue) {
    return ctx.getNodeParameter(name, index, defaultValue);
}
function buildTextPayload(ctx, i) {
    const payload = { text: getParam(ctx, 'text', i) };
    const footer = getParam(ctx, 'footer', i, '');
    if (footer)
        payload.footer = footer;
    const buttons = (0, GenericFunctions_1.extractButtonsPayload)(ctx, i);
    if (buttons)
        payload.buttons = buttons;
    return payload;
}
function buildMediaPayload(ctx, type, i) {
    const payload = { url: getParam(ctx, 'mediaUrl', i) };
    if (type !== 'audio' && type !== 'sticker') {
        const caption = getParam(ctx, 'caption', i, '');
        if (caption)
            payload.text = caption;
    }
    return payload;
}
function buildFilePayload(ctx, i) {
    const payload = { url: getParam(ctx, 'mediaUrl', i) };
    const caption = getParam(ctx, 'caption', i, '');
    const fileName = getParam(ctx, 'fileName', i, '');
    if (caption)
        payload.text = caption;
    if (fileName)
        payload.name = fileName;
    return payload;
}
function buildLocationPayload(ctx, i) {
    return {
        latitude: getParam(ctx, 'latitude', i),
        longitude: getParam(ctx, 'longitude', i),
        name: getParam(ctx, 'locationName', i, ''),
        address: getParam(ctx, 'address', i, ''),
    };
}
function buildContactPayload(ctx, i) {
    return {
        name: getParam(ctx, 'contactName', i),
        phone: getParam(ctx, 'contactPhone', i),
        email: getParam(ctx, 'contactEmail', i, ''),
        country: getParam(ctx, 'countryCode', i, '55'),
    };
}
function buildListPayload(ctx, i) {
    const payload = {
        text: getParam(ctx, 'listText', i),
        button: getParam(ctx, 'listButton', i),
        sections: (0, GenericFunctions_1.safeJsonParse)(getParam(ctx, 'sections', i), []),
    };
    const footer = getParam(ctx, 'footer', i, '');
    if (footer)
        payload.footer = footer;
    return payload;
}
function buildFlowsPayload(ctx, i) {
    const useFlowName = getParam(ctx, 'useFlowName', i, false);
    const identifierKey = useFlowName ? 'flowName' : 'flowId';
    return {
        text: getParam(ctx, 'flowText', i),
        cta: getParam(ctx, 'flowCta', i),
        flowAction: getParam(ctx, 'flowAction', i),
        screen: getParam(ctx, 'flowScreen', i, ''),
        data: (0, GenericFunctions_1.safeJsonParse)(getParam(ctx, 'flowData', i, '{}'), {}),
        draft: getParam(ctx, 'flowDraft', i, false),
        [identifierKey]: getParam(ctx, 'flowIdentifier', i),
    };
}
function buildGenericPayload(ctx, i) {
    const payload = {
        title: getParam(ctx, 'genericTitle', i, ''),
        subtitle: getParam(ctx, 'genericSubtitle', i, ''),
    };
    const image = getParam(ctx, 'genericImage', i, '');
    if (image)
        payload.image = image;
    const footer = getParam(ctx, 'footer', i, '');
    if (footer)
        payload.footer = footer;
    const buttons = (0, GenericFunctions_1.extractButtonsPayload)(ctx, i);
    if (buttons)
        payload.buttons = buttons;
    return payload;
}
function buildProductPayload(ctx, i) {
    return {
        text: getParam(ctx, 'productText', i, ''),
        catalogId: getParam(ctx, 'catalogId', i),
        productRetailerId: getParam(ctx, 'productRetailerId', i),
    };
}
function buildProductListPayload(ctx, i) {
    return {
        text: getParam(ctx, 'productListText', i, ''),
        header: getParam(ctx, 'productListHeader', i, ''),
        catalogId: getParam(ctx, 'catalogId', i),
        sections: (0, GenericFunctions_1.safeJsonParse)(getParam(ctx, 'productSections', i), []),
    };
}
const PAYLOAD_BUILDERS = {
    text: buildTextPayload,
    image: (ctx, i) => buildMediaPayload(ctx, 'image', i),
    video: (ctx, i) => buildMediaPayload(ctx, 'video', i),
    audio: (ctx, i) => buildMediaPayload(ctx, 'audio', i),
    sticker: (ctx, i) => buildMediaPayload(ctx, 'sticker', i),
    file: buildFilePayload,
    location: buildLocationPayload,
    contact: buildContactPayload,
    list: buildListPayload,
    flows: buildFlowsPayload,
    generic: buildGenericPayload,
    product: buildProductPayload,
    productList: buildProductListPayload,
};
function buildPayload(ctx, messageType, i) {
    const builder = PAYLOAD_BUILDERS[messageType];
    return builder ? builder(ctx, i) : {};
}
//# sourceMappingURL=send.operation.js.map