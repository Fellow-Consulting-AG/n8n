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

export class Classification implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Doc2App Document Classification',
        name: 'classification',
        icon: 'file:basic.svg',
        group: ['transform'],
        version: 1,
        description: 'Send File as binary to doc2app Server and get document classification information',
        defaults: {
            name: 'Classification Node',
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

        for (let i = 0; i < items.length; i++) {
            const item = items[i].binary as IBinaryKeyData;

            const binaryData = item[binaryPropertyName] as IBinaryData;
            binaryData.fileName = 'classification_document.pdf';
            const dataBuffer = (await this.helpers.getBinaryDataBuffer(i, binaryPropertyName));
            const credentials = await this.getCredentials('Doc2AppApi') as IDataObject;
            const api_key = credentials.apiKey;

            const formData = {
                file: {
                    value: dataBuffer,
                    options: {
                        filename: binaryData.fileName,
                        contentType: binaryData.mimeType,
                    },
                }
            };

            let uri = api.classify_document;
            
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

            try {
                responseData = await this.helpers.request(options);
            } catch(e: any) {
                console.error(e);
                throw new Error('Some internal error occur. Please try again later');
            }

        }

        return [this.helpers.returnJsonArray(responseData)];
    }
}