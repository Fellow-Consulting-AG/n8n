import {
    IExecuteFunctions,
} from 'n8n-core';

import {
    IBinaryData,
    IBinaryKeyData,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IDataObject,
		IHookFunctions,
		ILoadOptionsFunctions,
		INodePropertyOptions,
		IHttpRequestOptions
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

export class Extract implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Doc2App Extract Invoice',
        name: 'extract',
        icon: 'file:extract.svg',
        group: ['transform'],
        version: 1,
        description: 'Send file to server for Extraction',
        defaults: {
            name: 'Extract Invoice',
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
						default: 'Test_Label',
						description: 'Label of the Document',
						required: false,
					},
          {
						displayName: 'Binary Property',
						name: 'binaryPropertyName',
						type: 'string',
						default: '',
						description: 'Object property name which holds binary data.',
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
						required: true,
					},
					{
						displayName: 'Documentsource',
						name: 'documentsource',
						type: 'string',
						default: '',
						description: 'Set document source',
						required: false,
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
				let source = this.getNodeParameter('documentsource', 0) as string;
				const document_label = this.getNodeParameter('label', 0) as string ?? 'Test_Label';
				const api_key = credentials.apiKey;
				const formData = {
						files: [] as UploadFile[],
						doc_type: doc_type,
						source: source,
						label: document_label as string,
				};

				for (let i = 0; i < items.length; i++) {
						const item = items[i].binary as IBinaryKeyData;
						const binaryData = item[binaryPropertyName] as IBinaryData;
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
