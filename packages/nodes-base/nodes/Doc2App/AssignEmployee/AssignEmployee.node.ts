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

import {
    api,
} from '../GeneralHelper/Environment';

export class AssignEmployee implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Doc2App Assign Employee',
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
            {
                name: 'Doc2AppApi',
                required: true,
            },
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
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        let responseData;

        const items = this.getInputData();

        const credentials = await this.getCredentials('Doc2AppApi') as IDataObject;
        const api_key = credentials.apiKey;

        const email = this.getNodeParameter('email', 0) as string;
        const invoiceId = items[0].json.doc_id;

        if (!invoiceId) {
            throw new Error('Invalid Document / Invalid Documnt ID');
        }
    
        const formData = {
            assign_to : email,
        };

        let uri = api.assign_with_email + `${invoiceId}`;

        const options: OptionsWithUri = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-API-KEY': api_key,
            },
            method: 'POST',
            formData ,
            uri: uri,
            json: true,
        };

        try {
            responseData = await this.helpers.request(options);
        } catch(e: any) {
            console.error(e);
            throw new Error('Some internal error occur. Please try again later');
        }
        return [this.helpers.returnJsonArray(responseData)];
    }
}
