import {
	INodeProperties,
} from 'n8n-workflow';


export const deletion: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'Contacts',
					'Accounts',
					'Leads',
					'Activities'
				],
				operation: [
					'delete',
				],
			},
		},
		default: '',
	},
]
