import {
    IHookFunctions,
    IWebhookFunctions,
 } from 'n8n-core';
 
 import {
    INodeType,
    INodeTypeDescription,
    IWebhookResponseData,
    IDataObject,
 } from 'n8n-workflow';

 import {
    api,
} from '../GeneralHelper/Environment';
 
 import {
    OptionsWithUri,
} from 'request';

export class ApprovalTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Doc2App Approval Trigger',
        name: 'approvalTrigger',
        icon: 'file:approval.svg',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["event"]}}',
        description: 'Handle Export Invoice events via webhooks',
        defaults: {
            name: 'Approval Trigger',
            color: '#6ad7b9',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'Doc2AppApi',
                required: true,
            },
        ],
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
                const credentials = await this.getCredentials('Doc2AppApi') as IDataObject;
                const api_key = credentials.apiKey;

                let uri = api.get_trigger_by_url + encodeURIComponent(webhookUrl!);
                const options: OptionsWithUri = {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-KEY': api_key,
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
                    console.info('found : ' + webhook.data.id);
                    webhookData.webhookId = webhook.data.id;
                    return true;
                }
                return false;
            },
            async create(this: IHookFunctions): Promise<boolean> {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const webhookData = this.getWorkflowStaticData('node');
                const credentials = await this.getCredentials('Doc2AppApi') as IDataObject;
                const api_key = credentials.apiKey;

                let uri = api.create_update_trigger;
                const formData = {
                    doc_type: 'INVOICE',
                    trigger_url : webhookUrl,
                    trigger_status: 'validated_pending_approval',
                };


                const options: OptionsWithUri = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-API-KEY': api_key,
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
                const credentials = await this.getCredentials('Doc2AppApi') as IDataObject;
                const api_key = credentials.apiKey;

                if(webhookData.webhookId) {
                    let uri = api.remove_trigger;
    
                    const formData = {
                        id: webhookData.webhookId as number,
                    };
    
                    const options: OptionsWithUri = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-API-KEY': api_key,
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
        const req = this.getRequestObject();
        return {
            workflowData: [
                this.helpers.returnJsonArray(req.body),
            ],
        };
    }
 }
 