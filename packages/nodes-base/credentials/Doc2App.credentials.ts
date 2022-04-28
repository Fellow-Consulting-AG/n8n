import {
    ICredentialType,
    NodePropertyTypes,
} from 'n8n-workflow';

export class Doc2AppApi implements ICredentialType {
    name = 'Doc2AppApi';
    displayName = 'Doc2App API';
    documentationUrl = 'Doc2App';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string' as NodePropertyTypes,
            default: '',
        },
    ];
}