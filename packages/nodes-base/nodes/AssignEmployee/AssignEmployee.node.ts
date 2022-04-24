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

export class AssignEmployee implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Import Invoice',
        name: 'assignEmployee',
        icon: 'file:assignEmployee.svg',
        group: ['transform'],
        version: 1,
        description: 'Assign Task to Employee',
        defaults: {
            name: 'Assign Employee',
            color: '#1A82e2',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
        ],
        properties: [

            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                required: true,
                default:'',
                description:'Primary email for the contact',
            },
            {
                displayName: 'Invoice Id',
                name: 'invoiceId',
                type: 'string',
                required: true,
                default:'',
                description:'Primary email for the contact',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        
        let responseData;

        const email = this.getNodeParameter('email', 0) as string;
        // const amount = this.getNodeParameter('amount', 0) as string;
        const invoiceId = this.getNodeParameter('invoiceId', 0) as string;

        console.info(email);
        // console.info(amount);
        console.info(invoiceId);

        // if(amount >)


        const formData = {
            
        };


        const options: OptionsWithUri = {
            headers: {
                'Accept': 'application/json',
                'X-API-KEY': '8atbbjpdZJTR7s669S7si851bFayy5MhdNE21T2wqazvZhz8MBm6vzQGdxpeuLAIvgqncf1UZ6X51n31QnZprQdC5weJTv102lRSqM2iv5TZ9Pkihm3iVc9B12lZknaq',
            },
            method: 'POST',
            body:  formData ,
            uri: `https://dev.doc2api.cloudintegration.eu/`,
            json: true,
        };
        
        responseData = await this.helpers.request(options);
    
        // Map data to n8n data
        return [this.helpers.returnJsonArray(responseData)];
    }
}