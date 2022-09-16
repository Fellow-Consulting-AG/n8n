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

export class Upload implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Doc2App Upload Documents',
        name: 'upload',
        icon: 'file:upload.svg',
        group: ['transform'],
        version: 1,
        description: 'Upload Document to your doc2app organisation.',
        defaults: {
            name: 'Upload Document',
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
						displayName: 'Label',
						name: 'label',
						type: 'string',
						default: 'Document.pdf',
						description: 'Lable of the Document',
						required: false,
					},
					{
						displayName: 'Binary Property',

						name: 'binaryPropertyName',
						type: 'string',
						default: 'data',
						description: 'Object property name which holds binary data',
						required: true,
					},
					{
						displayName: 'Documenttype',
						name: 'doc_type',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getDocumentTypes',
						},
						description: 'Use documenttype from the list',
						default: '',
						required: false,
					},
					{
						displayName: 'Importtype',
						name: 'importtype',
						type: 'options',
						options: [
							{
								name: 'Email',
								value: 'email'
							},
							{
								name: 'Other',
								value: 'other'
							}
						],
						default: '',
						description: 'Set importtype',
						required: false,
					},
					{
						displayName: 'Documentsource',
						name: 'doc_source',
						type: 'string',
						displayOptions: {
							show: {
								importtype: [
									'other'
								]
							}
						},
						default: '',
						description: 'Set documentsource',
						required: false,
					},
					{
						displayName: 'Address',
						name: 'address',
						type: 'string',
						displayOptions: {
							show: {
								importtype: [
									'email'
								]
							}
						},
						default: '',
						description: 'Set Importaddress',
						required: true,
					},
					{
						displayName: 'Inbox',
						name: 'inbox',
						type: 'string',
						displayOptions: {
							show: {
								importtype: [
									'email'
								]
							}
						},
						default: '',
						description: 'Set emailinbox',
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
            const items = this.getInputData();
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0) as string;
            const credentials = await this.getCredentials('Doc2AppApi') as IDataObject;
						let doc_type = this.getNodeParameter('doc_type', 0) as string;
						let doc_source = this.getNodeParameter('doc_source', 0) as string;
						let inbox = this.getNodeParameter('inbox', 0, false) as string;
						let importtype = this.getNodeParameter('importtype', 0) as string;
						let address = this.getNodeParameter('address', 0, false) as string;
						const document_label = this.getNodeParameter('label', 0) as string ?? 'Test_Label';
            const api_key = credentials.apiKey;
						let source;

						if (importtype == "email") {
							source = importtype + ":" + address + ":" + inbox
						} else {
							source = doc_source
						}

            const formData = {
                files: [] as UploadFile[],
								doc_type: doc_type,
								source: source,
								label: document_label as string,
            };

            for (let i = 0; i < items.length; i++) {
                const item = items[i].binary as IBinaryKeyData;
								const binaryData = item[binaryPropertyName] as IBinaryData;
								if (binaryData === undefined) {
									throw new NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`, { itemIndex: i });
								}
								const dataBuffer = (await this.helpers.getBinaryDataBuffer(i, binaryPropertyName));
								if (document_label) {
									binaryData.fileName = document_label as string;
								} else {
									binaryData.fileName = (i + 1) + 'extract_document.pdf';
								}

                const file = {
                    value: dataBuffer,
                    options: {
                        filename: binaryData.fileName,
                        contentType: binaryData.mimeType,
                    },
                } as UploadFile;
                formData.files.push(file);
            }
            let uri = api.process_documents;
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
