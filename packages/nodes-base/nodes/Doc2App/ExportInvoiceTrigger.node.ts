import {
    IHookFunctions,
    IWebhookFunctions,
 } from 'n8n-core';
 
 import {
    INodeType,
    INodeTypeDescription,
    IWebhookResponseData,
 } from 'n8n-workflow';
 
 
 import {
     exportInvoiceApiRequest,
 } from './GenericFunctions';
 
 import {
    OptionsWithUri,
} from 'request';

 
 
 export class ExportInvoiceTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Export Invoice Trigger',
        name: 'exportInvoiceTrigger',
        icon: 'file:exportInvoice.svg',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["event"]}}',
        description: 'Handle Export Invoice events via webhooks',
        defaults: {
            name: 'Export Invoice Trigger',
            color: '#6ad7b9',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [],
    };

    // @ts-ignore
    webhookMethods = {
        default: {
            async checkExists(this: IHookFunctions): Promise<boolean> {
                const webhookData = this.getWorkflowStaticData('node');
                const webhookUrl = this.getNodeWebhookUrl('default');

                console.info('in checkExists function');

                const reponse = await exportInvoiceApiRequest.call(this, 'POST', '/configurations/get_configurations', {}, {});
                for (const exportConf of reponse.data) {
                    if (exportConf.export_method === 'webhook' && exportConf.export_url === webhookUrl) {
                        console.info('================================');
                        console.info('found : ' + exportConf.id);
                        console.info('=================================');
                        webhookData.webhookId = exportConf.id;
                        return true;
                    }
                }
                return false;
            },
            async create(this: IHookFunctions): Promise<boolean> {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const webhookData = this.getWorkflowStaticData('node');

                console.info('in create function');

                const formData = {
                    title: 'webhook title',
                    doc_type: 'INVOICE',
                    export_url : webhookUrl
                };


                const options: OptionsWithUri = {
                    headers: {
                        'X-API-KEY': process.env.APP_N8N_DOC2_API_KEY,
                    },
                    method: 'POST',
                    formData ,
                    uri: `https://dev.doc2api.cloudintegration.eu/configurations/configure_webhook_export`,
                    json: true,
                };

                let webhook;
                try {
                    webhook = await this.helpers.request(options);
                } catch(e: any) {
                    console.info(e);
                    return false;
                }
                webhookData.webhookId = webhook.data.id;

                return true;
            },
            async delete(this: IHookFunctions): Promise<boolean> {
                const webhookData = this.getWorkflowStaticData('node');

                console.info('in delete function');

                const formData = {
                    id: webhookData.webhookId as number,
                };

                const options: OptionsWithUri = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-API-KEY': process.env.APP_N8N_DOC2_API_KEY,
                    },
                    method: 'POST',
                    formData ,
                    uri: `https://dev.doc2api.cloudintegration.eu/configurations/remove_configuration`,
                    json: true,
                };

                let response;
                try {
                    response = await this.helpers.request(options);
                } catch(e: any) {
                    console.info(e);
                    return false;
                }

                delete webhookData.webhookId;
                return true;
            },
        },
    };


    
    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {

        console.info('My webhook worked ');
        const req = this.getRequestObject();
        return {
            workflowData: [
                this.helpers.returnJsonArray(req.body),
            ],
        };
    }
 }
 