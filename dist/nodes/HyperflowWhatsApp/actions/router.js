"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = router;
const n8n_workflow_1 = require("n8n-workflow");
const message = __importStar(require("./message"));
async function router() {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);
    let returnData = [];
    switch (resource) {
        case 'message':
            returnData = await executeMessageOperation.call(this, items, operation);
            break;
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
    }
    return [returnData];
}
async function executeMessageOperation(items, operation) {
    switch (operation) {
        case 'send':
            return message.operations.send.execute.call(this, items);
        case 'sendTemplate':
            return message.operations.sendTemplate.execute.call(this, items);
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
    }
}
//# sourceMappingURL=router.js.map