import {
	IHookFunctions,
	IWebhookFunctions,
	IExecuteFunctions
} from 'n8n-core';

import {
    IBinaryData,
    IBinaryKeyData,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IDataObject,
		ILoadOptionsFunctions,
		INodePropertyOptions,
    IHttpRequestOptions,
    IWebhookResponseData,
		NodeOperationError
} from 'n8n-workflow';

import {
    OptionsWithUri,
} from 'request';

import {
    api,
} from '../GeneralHelper/Environment';

import {
    UploadFile,
} from '../GeneralHelper/type';

export class ApproveReject implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Doc2App Approve/Reject',
        name: 'approvereject',
        // icon: 'file:upload.svg',
        group: ['transform'],
        version: 1,
        description: 'Approve or reject documents in your doc2app instance',
        defaults: {
            name: 'Approve/Reject Documents',
            color: '#1A82e2',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'Doc2AppApi',
                required: true,
            },
        ],
        properties: [
					{
						displayName: 'Document ID',
						name: 'doc_id',
						type: 'string',
						default: '',
						description: 'ID of the document',
						required: true,
					},
					{
						displayName: 'Approve/Reject',
						name: 'todo',
						type: 'options',
						options: [
							{
								name: "Approve",
								value: "approve"
							},
							{
								name: "Reject",
								value: "reject"
							},
						],
						default: '',
						description: 'ID of the document',
						required: true,
					},
      	],
    	};
		methods = {
			loadOptions: {
					async getDocumentTypes(this: IHookFunctions | ILoadOptionsFunctions): Promise<INodePropertyOptions[]>{
							const returnData = [
									{
											name: 'All',
											value: '',
									}
							];
							const credentials = await this.getCredentials('Doc2AppApi') as IDataObject;
							const api_key = credentials.apiKey;
							let url = api.get_document_types;
							const options: IHttpRequestOptions = {
									url,
									headers: {
											'Content-Type': 'application/json',
											'X-API-KEY': api_key,
									},
									method: 'GET',
									body:  {},
									json: true,
							};

							try {
									if (this.helpers === undefined) {
											return returnData;
									}
									const response = await this.helpers.httpRequest(options);
									for (const document_type of response.data) {
											const docTypeName = document_type.title;
											const docTypeId = document_type.document_key;

											if (document_type.is_active !== true) {
													continue;
											}
											returnData.push({
													name: docTypeName,
													value: docTypeId,
											});
									}
							} catch(e: any) {
									console.error(e);
									// throw new Error('Some internal error occur. Please try again later');
							}

							return returnData;
					},
			},
	};

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        try {
            let responseData;
            const credentials = await this.getCredentials('Doc2AppApi') as IDataObject;
						let doc_id = this.getNodeParameter('doc_id', 0) as string;
						let todo = this.getNodeParameter('todo', 0) as string;
            const api_key = credentials.apiKey;

            const formData = {
								request_type: todo,
            };
            let uri = api.approve_reject + doc_id;
            const options: OptionsWithUri = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-API-KEY': api_key,
                },
                method: 'POST',
                body:  formData ,
                uri: uri,
                json: true,
            };

            responseData = await this.helpers.request(options);
            return [this.helpers.returnJsonArray(responseData)];
        } catch(e: any) {
            console.error(e);
            throw new Error('Some internal error occur. Please try again later');
        }
    }
}
