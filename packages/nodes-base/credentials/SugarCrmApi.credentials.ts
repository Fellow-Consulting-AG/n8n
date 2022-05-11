import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';

export class SugarCrmApi implements ICredentialType {
	name = 'sugarCrmApi';
	displayName = 'SugarCrm API';
	documentationUrl = 'sugarCrm';
	properties = [
			{
					displayName: 'Username',
					name: 'username',
					type: 'string' as NodePropertyTypes,
					default: '',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
			{
				displayName: 'Sugar-Base-Url',
				name: 'sugarbaseurl',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
	];
}
