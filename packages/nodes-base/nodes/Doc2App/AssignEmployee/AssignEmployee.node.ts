import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodePropertyOptions,
	IHttpRequestOptions,
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
						displayName: 'Selection',
						name: 'selection',
						type: 'options',
						options: [
							{
								name: 'Email',
								value: 'email'
							},
							{
								name: 'Group',
								value: 'group'
							}
						],
						required: true,
						default:'',
						description:'Approvalselection',
					},
					{
						displayName: 'Group',
						name: 'group',
						displayOptions: {
							show: {
								selection: [
									'group',
								]
							},
						},
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getGroups',
						},
						required: false,
						default:'',
						description:'Assigning to Group',
					},
					{
						displayName: 'E-mail',
						name: 'e-mail',
						displayOptions: {
							show: {
								selection: [
									'email',
								]
							},
						},
						type: 'string',
						required: false,
						default:'',
						description:'Primary email for the contact',
					},
			],
	};
	methods = {
		loadOptions: {
				async getGroups(this: IHookFunctions | ILoadOptionsFunctions): Promise<INodePropertyOptions[]>{
						const returnData = [
								{
										name: 'All',
										value: '',
								}
						];
						const credentials = await this.getCredentials('Doc2AppApi') as IDataObject;
						const api_key = credentials.apiKey;
						let url = api.get_groups;
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
								for (const groups of response.data) {
										const groupname = groups.name;
										const group_id = groups.id;

										returnData.push({
												name: groupname,
												value: group_id,
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
