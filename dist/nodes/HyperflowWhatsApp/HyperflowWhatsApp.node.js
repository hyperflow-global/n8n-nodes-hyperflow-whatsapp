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
exports.HyperflowWhatsApp = void 0;
const router_1 = require("./actions/router");
const message = __importStar(require("./actions/message"));
class HyperflowWhatsApp {
    constructor() {
        this.description = {
            displayName: 'Hyperflow WhatsApp',
            name: 'hyperflowWhatsApp',
            icon: 'file:hyperflow.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Enviar mensagens do WhatsApp via API Hyperflow',
            defaults: { name: 'Hyperflow WhatsApp' },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [{ name: 'hyperflowWhatsAppAccount', required: true }],
            properties: [
                {
                    displayName: 'Recurso',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [{ name: 'Mensagem', value: 'message' }],
                    default: 'message',
                },
                ...message.descriptions,
            ],
        };
    }
    async execute() {
        return router_1.router.call(this);
    }
}
exports.HyperflowWhatsApp = HyperflowWhatsApp;
//# sourceMappingURL=HyperflowWhatsApp.node.js.map