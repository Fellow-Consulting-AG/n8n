import {
    IExecuteFunctions,
} from 'n8n-core';

import {
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

import {
    OptionsWithUri,
} from 'request';

export class AssignEmployee implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Assign Employee',
        name: 'assignEmployee',
        icon: 'file:assignEmployee.svg',
        group: ['transform'],
        version: 1,
        description: 'Assign task to Employee ',
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

        const items = this.getInputData();

        if(items[0].json.status === 'ready_for_validation') {

            const email = this.getNodeParameter('email', 0) as string;
            const invoiceId = this.getNodeParameter('invoiceId', 0) as string;
    
            const formData = {
                assign_to : email,
            };
    
            let uri = 'https://dev.doc2api.cloudintegration.eu/document/assign_with_email/' + `${invoiceId}`;
    
            const options: OptionsWithUri = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-API-KEY': '8atbbjpdZJTR7s669S7si851bFayy5MhdNE21T2wqazvZhz8MBm6vzQGdxpeuLAIvgqncf1UZ6X51n31QnZprQdC5weJTv102lRSqM2iv5TZ9Pkihm3iVc9B12lZknaq',
                },
                method: 'POST',
                formData ,
                uri: uri,
                json: true,
            };
    
            try {
                responseData = await this.helpers.request(options);
            } catch(e: any) {
                console.info(e);
            }
            return [this.helpers.returnJsonArray(responseData)];
        } else {
            return [this.helpers.returnJsonArray([{'Messgae' : 'Invalid Document Status'}])];
        }

    }
}
