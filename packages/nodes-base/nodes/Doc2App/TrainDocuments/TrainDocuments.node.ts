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

import {
    UploadFile,
} from '../GeneralHelper/type';


export class TrainDocuments implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Doc2App Train Documents',
        name: 'TrainDocuments',
        icon: 'file:basic.svg',
        group: ['transform'],
        version: 1,
        description: 'Send File as binary to doc2app Server and return information about document classification',
        defaults: {
            name: 'Train Documents Node',
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
        try {
            let responseData;
            const items = this.getInputData();
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0) as string;
            const credentials = await this.getCredentials('Doc2AppApi') as IDataObject;
            const api_key = credentials.apiKey;

            // should throw error if error
            const document_label = this.getNodeParameter('label', 0) as string ?? 'Test_Label';


            const formData = {
                files: [] as UploadFile[],
                label: document_label as string,
                tags: [],
            };

            for (let i = 0; i < items.length; i++) {
                const item = items[i].binary as IBinaryKeyData;

                const binaryData = item[binaryPropertyName] as IBinaryData;
                binaryData.fileName = i + 'classification_document.pdf';
                const dataBuffer = (await this.helpers.getBinaryDataBuffer(i, binaryPropertyName));
            
                const file = {
                    value: dataBuffer,
                    options: {
                        filename: binaryData.fileName,
                        contentType: binaryData.mimeType,
                    },
                } as UploadFile;
                formData.files.push(file);
            }
        
            let uri = api.train_document;
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