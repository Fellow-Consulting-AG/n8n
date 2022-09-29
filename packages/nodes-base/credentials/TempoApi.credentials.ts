import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';

export class TempoApi implements ICredentialType {
	name = 'tempoApi';
	displayName = 'Tempo API';
	documentationUrl = 'tempoApi';
	properties = [
			{
				displayName: 'API Token',
				name: 'token',
				type: 'string' as NodePropertyTypes,
				default: '',
			},
	];
}
