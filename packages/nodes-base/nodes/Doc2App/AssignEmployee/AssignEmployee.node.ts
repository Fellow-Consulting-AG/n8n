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
								name: 'User',
								value: 'user'
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
						displayName: 'User',
						name: 'user',
						displayOptions: {
							show: {
								selection: [
									'user',
								]
							},
						},
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getUsers',
						},
						required: false,
						default:'',
						description:'Assign to user',
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
								for (const groups of response) {
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
				async getUsers(this: IHookFunctions | ILoadOptionsFunctions): Promise<INodePropertyOptions[]>{
					const returnData = [
							{
									name: 'Default',
									value: '',
							}
					];
					const credentials = await this.getCredentials('Doc2AppApi') as IDataObject;
					const api_key = credentials.apiKey;
					let url = api.get_users;
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
							for (const users of response) {
									const username = users.first_name + users.last_name;
									const user_id = users.id;

									returnData.push({
											name: username,
											value: user_id,
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
			let formData;

			const items = this.getInputData();

			const credentials = await this.getCredentials('Doc2AppApi') as IDataObject;
			const api_key = credentials.apiKey;

			const selection = this.getNodeParameter('selection', 0) as string;
			const user = this.getNodeParameter('user', 0, false) as string;
			const group = this.getNodeParameter('group', 0, false) as string;
			const invoiceId = items[0].json.doc_id;

			if (!invoiceId) {
					throw new Error('Invalid Document / Invalid Documnt ID');
			}
			if (selection == "user") {
				formData = {
						assign_to : user,
						assignment_type: "user",
				};
			} else if (selection == "group") {
				formData = {
					assign_to : group,
					assignment_type: "group",
				};
			}

			let uri = api.assign + `${invoiceId}`

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
