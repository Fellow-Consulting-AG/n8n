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

    const endpoint = 'https://dev.doc2api.cloudintegration.eu';


    const options: OptionsWithUri = {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': '8atbbjpdZJTR7s669S7si851bFayy5MhdNE21T2wqazvZhz8MBm6vzQGdxpeuLAIvgqncf1UZ6X51n31QnZprQdC5weJTv102lRSqM2iv5TZ9Pkihm3iVc9B12lZknaq',
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

        console.info('Some internal error occur. Please try again later');
        console.info(error);

        // if (error.response) {
        //     console.info();
            // const errorMessage = error.response.body.message || error.response.body.description || error.message;
            // throw new Error(`Autopilot error response [${error.statusCode}]: ${errorMessage}`);
        // }
        throw error;
    }
}
