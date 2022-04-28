import { AnyPtrRecord } from 'dns';
import {
    IExecuteFunctions,
} from 'n8n-core';

import {
    IBinaryData,
    IBinaryKeyData,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

import {
    OptionsWithUri,
} from 'request';

export class Extract implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Extract Invoice',
        name: 'extract',
        icon: 'file:extract.svg',
        group: ['transform'],
        version: 1,
        description: 'Extract Invoice (Input pdf as Binary)',
        defaults: {
            name: 'Extract Invoice',
            color: '#1A82e2',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            // {
            //     name: 'importInvoiceApi',
            //     required: true,
            // },
        ],
        properties: [

            // {
            //     displayName: 'Email',
            //     name: 'email',
            //     type: 'string',
            //     required: true,
                
            //     default:'',
            //     description:'Primary email for the contact',
            // },
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
            binaryData.fileName = 'invoice_node.pdf';
            const dataBuffer = (await this.helpers.getBinaryDataBuffer(i, binaryPropertyName));


            const formData = {
                files: [{
                    value: dataBuffer,
                    options: {
                        filename: binaryData.fileName,
                        contentType: binaryData.mimeType,
                    },
                }]
            };

            let uri = process.env.APP_N8N_DOC2_SERVICE_URL + '/document/process_documents';
            
            const options: OptionsWithUri = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-API-KEY': process.env.APP_N8N_DOC2_API_KEY,
                },
                method: 'POST',
                body:  formData ,
                uri: uri,
                json: true,
            };
            
            responseData = await this.helpers.request(options);

        }
    
        // Map data to n8n data
        return [this.helpers.returnJsonArray(responseData)];
    }
}