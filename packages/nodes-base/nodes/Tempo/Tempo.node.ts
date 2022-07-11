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
	OptionsWithUri, OptionsWithUrl,
} from 'request';

import {
	worklogOperations,
	worklogFields,
} from './Worklog';


export class Tempo implements INodeType {
	description: INodeTypeDescription = {
			displayName: 'Tempo',
			name: 'tempo',
			icon: 'file:tempo.svg',
			group: ['transform'],
			version: 1,
			description: 'Consume Tempo API',
			defaults: {
					name: 'Tempo',
					color: '#1A82e2',
			},
			inputs: ['main'],
			outputs: ['main'],
			credentials: [
				{
					name: 'tempoApi',
					required: true,
				},
			],
			properties: [
				{
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					options: [
							{
								name: 'Worklog',
								value: 'worklog',
							},
					],
					default: 'worklog',
					required: true,
					description: 'Which Resource to work with.',
				},
				...worklogOperations,
				...worklogFields,
			],
	};

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

    let responseData;
		let response;
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    //Get credentials the user provided for this node
    const credentials = await this.getCredentials('tempoApi') as IDataObject;

		// const getauth: OptionsWithUrl = {
		// 	method: 'GET',
		// 	url: `${credentials.tempobaseurl}plugins/servlet/ac/io.tempo.jira/oauth-authorize/?client_id=${credentials.client_id}`,
		// 	json: true,
		// };
		// response = await this.helpers.request(getauth);
		// let auth_code = response.code

		// const gettoken: OptionsWithUrl = {
		// 	method: 'POST',
		// 	headers: {
		// 		'content_type': 'application/x-www-form-urlencoded',
		// 		'grant_type': 'authorization_code',
		// 		'client_id': credentials.client_id,
		// 		'client_secret': credentials.client_secret,
		// 		'redirect_uri': credentials.redirect_uri,
		// 		'code': credentials.auth_code,
		// 	},
		// 	url: `https://api.tempo.io/oauth/token`,
		// 	json: true,
		// };
		// response = await this.helpers.request(gettoken);


		let token = credentials.token

		let methods = operation.toUpperCase()

		if (resource == 'worklog') {
			if (operation === 'get') {
					let extension = '';
					let type;
					let key;
					if (this.getNodeParameter('projectissue', 0) == 'projectkey') {
						type = 'project'
						key = this.getNodeParameter('key', 0)
					} else {
						type = 'issue'
						key = this.getNodeParameter('key', 0)
					}
					const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

					if (additionalFields.startdate != null || additionalFields.enddate != null || additionalFields.updatedate != null || additionalFields.limit != null) {
						extension = extension + '?'
					}
					if (additionalFields.startdate != null) {
						extension = extension + `from=${additionalFields.startdate}&`
					}
					if (additionalFields.enddate != null) {
						extension = extension + `to=${additionalFields.enddate}&`
					}
					if (additionalFields.updatedate != null) {
						extension = extension + `updatedFrom=${additionalFields.updatedate}&`
					}
					if (additionalFields.limit != null) {
						extension = extension + `limit=${additionalFields.limit}`
					}

					const options: OptionsWithUrl = {
						headers: {
								'Accept': 'application/json',
								'Authorization': `Bearer ${token}`,
						},
						method: methods,
						url: `https://api.tempo.io/core/3/worklogs/${type}/${key}${extension}`,
						json: true,
					};

					responseData = await this.helpers.request(options);
			}
		}
		return [this.helpers.returnJsonArray(responseData)];
	}
}
