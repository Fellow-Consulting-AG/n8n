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
} from 'n8n-workflow';

import {
    OptionsWithUri,
} from 'request';

import {
    api,
} from '../GeneralHelper/Environment';

export class TestClassification implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Doc2App Test Document Classification',
        name: 'Test Classification',
        icon: 'file:basic.svg',
        group: ['transform'],
        version: 1,
        description: 'Send File as binary to doc2app Server and return information about document classification',
        defaults: {
            name: 'TestClassification Node',
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
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				description: 'Object property name which holds binary data.',
				required: true,
			},
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        
        let responseData;
        const items = this.getInputData();
        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0) as string;
        const credentials = await this.getCredentials('Doc2AppApi') as IDataObject;
        const api_key = credentials.apiKey;
        try {
            for (let i = 0; i < items.length; i++) {
                const item = items[i].binary as IBinaryKeyData;
                const binaryData = item[binaryPropertyName] as IBinaryData;
                binaryData.fileName = (i + 1) + 'classification_document.pdf';
                const dataBuffer = (await this.helpers.getBinaryDataBuffer(i, binaryPropertyName));

                const formData = {
                    file: {
                        value: dataBuffer,
                        options: {
                            filename: binaryData.fileName,
                            contentType: binaryData.mimeType,
                        },
                    }
                };

                let uri = api.test_classification;
                
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
            }
        } catch(e: any) {
            console.error(e);
            throw new Error('Some internal error occur. Please try again later');
        }
        return [this.helpers.returnJsonArray(responseData)];
    }
}