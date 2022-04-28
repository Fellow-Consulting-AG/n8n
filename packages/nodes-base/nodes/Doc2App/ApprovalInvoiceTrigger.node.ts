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

 
 
 export class ApprovalInvoiceTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Approval Invoice Trigger',
        name: 'approvalInvoiceTrigger',
        icon: 'file:approvalInvoice.svg',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["event"]}}',
        description: 'Handle Export Invoice events via webhooks',
        defaults: {
            name: 'Approval InvoiceTrigger',
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

                let uri = process.env.APP_N8N_DOC2_SERVICE_URL + '/triggers/get_trigger_by_url?url=' + encodeURIComponent(webhookUrl!);

                const options: OptionsWithUri = {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-KEY': process.env.APP_N8N_DOC2_API_KEY,
                    },
                    method: 'GET',
                    body:  {},
                    uri,
                    json: true,
                };

                let webhook;
                try {
                    webhook = await this.helpers.request(options);
                } catch(e: any) {
                    console.info(e);
                    return false;
                }

                if(webhook.data && webhook.data.id && webhook.data.trigger_url === webhookUrl) {
                    console.info('================================');
                    console.info('found : ' + webhook.data.id);
                    console.info('=================================');
                    webhookData.webhookId = webhook.data.id;
                    return true;
                }

                // const reponse = await exportInvoiceApiRequest.call(this, 'GET', '/triggers/get_triggers/', {}, {});
                // for (const exportConf of reponse.data) {
                //     if (exportConf.data && exportConf.data.id) {
                //         console.info('================================');
                //         console.info('found : ' + exportConf.id);
                //         console.info('=================================');
                //         webhookData.webhookId = exportConf.id;
                //         return true;
                //     }
                // }
                return false;
            },
            async create(this: IHookFunctions): Promise<boolean> {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const webhookData = this.getWorkflowStaticData('node');

                console.info('in create function');

                let uri = process.env.APP_N8N_DOC2_SERVICE_URL + '/triggers/create_update_trigger';

                const formData = {
                    doc_type: 'INVOICE',
                    trigger_url : webhookUrl,
                    trigger_status: 'validated_pending_approval',
                };


                const options: OptionsWithUri = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-API-KEY': process.env.APP_N8N_DOC2_API_KEY,
                    },
                    method: 'POST',
                    formData ,
                    uri: uri,
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

                if(webhookData.webhookId) {
                    let uri = process.env.APP_N8N_DOC2_SERVICE_URL + '/triggers/remove_trigger';
    
                    const formData = {
                        id: webhookData.webhookId as number,
                    };
    
                    const options: OptionsWithUri = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-API-KEY': process.env.APP_N8N_DOC2_API_KEY,
                        },
                        method: 'DELETE',
                        formData ,
                        uri: uri,
                        json: true,
                    };
    
                    let response;
                    try {
                        response = await this.helpers.request(options);
                    } catch(e: any) {
                        console.info(e);
                        return false;
                    }
    
                    console.info(response);
    
                    delete webhookData.webhookId;
                }

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
 