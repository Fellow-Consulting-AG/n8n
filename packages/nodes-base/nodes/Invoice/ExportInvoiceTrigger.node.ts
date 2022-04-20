import {
    IHookFunctions,
    IWebhookFunctions,
 } from 'n8n-core';
 
 import {
    IDataObject,
    INodeType,
    INodeTypeDescription,
    IWebhookResponseData,
 } from 'n8n-workflow';
 
 
 import {
     exportInvoiceApiRequest,
 } from './GenericFunctions';
 
 import {
     snakeCase,
 } from 'change-case';
 
 
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
                const event = this.getNodeParameter('event') as string;
                // const { hooks: webhooks } = await exportInvoiceApiRequest.call(this, 'POST', '/configurations/get_configurations', {});
                // for (const webhook of webhooks) {
                //     if (webhook.target_url === webhookUrl && webhook.event === snakeCase(event)) {
                //         webhookData.webhookId = webhook.hook_id;
                //         return true;
                //     }
                // }

                const reponse = await exportInvoiceApiRequest.call(this, 'POST', '/configurations/get_configurations', {});
                for (const exportConf of reponse.data) {
                    if (exportConf.export_method === 'webhook' && exportConf.export_url === webhookUrl) {
                        webhookData.webhookId = exportConf.id;
                        return true;
                    }
                }
                return false;
            },
            async create(this: IHookFunctions): Promise<boolean> {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const webhookData = this.getWorkflowStaticData('node');
                const event = this.getNodeParameter('event') as string;
                const body: IDataObject = {
                    title: snakeCase(event),
                    doc_type: webhookUrl,
                    export_url : webhookUrl
                };
                const webhook = await exportInvoiceApiRequest.call(this, 'POST', '/configurations/configure_webhook_export', body);
                webhookData.webhookId = webhook.hook_id;
                return true;
            },
            async delete(this: IHookFunctions): Promise<boolean> {
                const webhookData = this.getWorkflowStaticData('node');

                const body: IDataObject = {
                    id: webhookData.webhookId,
                };

                try {
                    await exportInvoiceApiRequest.call(this, 'POST', '/configurations/remove_configuration',body);
                } catch (error) {
                    return false;
                }
                delete webhookData.webhookId;
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
 