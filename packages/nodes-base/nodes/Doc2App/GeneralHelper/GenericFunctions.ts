import {
    OptionsWithUri,
} from 'request';

import {
    IExecuteFunctions,
    ILoadOptionsFunctions,
} from 'n8n-core';

import {
    IDataObject,
    IHookFunctions,
    IWebhookFunctions,
} from 'n8n-workflow';

export async function exportInvoiceApiRequest(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, method: string, resource: string, body: any = {}, query: IDataObject = {}, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any

    const endpoint = process.env.APP_N8N_DOC2_SERVICE_URL;


    const options: OptionsWithUri = {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.APP_N8N_DOC2_API_KEY,
        },
        method,
        body,
        qs: query,
        uri: uri || `${endpoint}${resource}`,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(query).length) {
        delete options.qs;
    }

    try {
        return await this.helpers.request!(options);
    } catch (error : any) {
        console.error(error);
        throw new Error('Some internal error occur. Please try again later')
    }
}
