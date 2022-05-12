import {
	INodeProperties,
} from 'n8n-workflow';


export const accountoperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
						'Accounts',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'post',
				description: 'Create a organization',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get organizations',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a organization',
			},
		],
		default: 'get',
		description: 'The operation to perform.',
	},
]



export const accountfields: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
				show: {
					resource: [
							'Accounts',
					],
					operation: [
							'post',
					],
				},
		},
		options: [
				{
					displayName: 'Name',
					name: 'name',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Description',
					name: 'description',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Phonenumber',
					name: 'phone_office',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Owner',
					name: 'ownership',
					type: 'string',
					default: '',
				},
				{
					displayName: 'E-Mail',
					name: 'email',
					type: 'string',
					default: '',
				},
		],
	},
]
