import {
	INodeProperties,
} from 'n8n-workflow';


export const contactoperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
						'Contacts',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'post',
				description: 'Create a contact',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get Contacts',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
			},
		],
		default: 'get',
		description: 'The operation to perform.',
	},
]


export const contactfields: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
				show: {
					resource: [
							'Contacts',
					],
					operation: [
							'post',
					],
				},
		},
		options: [
				{
					displayName: 'First Name',
					name: 'first_name',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Last Name',
					name: 'last_name',
					type: 'string',
					default: '',
				},
				{
					displayName: 'E-Mail',
					name: 'email',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Phonenumber',
					name: 'phone',
					type: 'string',
					default: '',
				},
		],
	},
]
