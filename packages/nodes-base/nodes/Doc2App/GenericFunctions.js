"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
import {
    api,
} from  '../GeneralHelper/Environment';
exports.doc2ApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");

async function doc2ApiRequest(method, resource, body = {}, query = {}, uri, option = {}) {
    const credentials = await this.getCredentials('Doc2AppApi');
    // const baseUrl = getBaseUrl(credentials);
    const baseUrl = api.get_trigger_by_url;
    if (credentials === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No credentials got returned!');
    }
    let options = {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': api_key,
        },
        method,
        body,
        qs: query,
        uri: uri || `${baseUrl}${resource}`,
        json: true,
    };
    options = Object.assign({}, options, option);
    if (!Object.keys(options.body).length) {
        delete options.body;
    }
    if (!Object.keys(options.qs).length) {
        delete options.qs;
    }
    try {
        return await IHookFunctions.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
exports.doc2ApiRequest = doc2ApiRequest;