import {
	INodeProperties,
} from 'n8n-workflow';


export const leadsoperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
						'Leads',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'post',
				description: 'Create a lead',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get leads',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a lead',
			},
		],
		default: 'get',
		description: 'The operation to perform.',
	},
]


export const leadsfields: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
				show: {
					resource: [
							'Leads',
					],
					operation: [
							'post',
					],
				},
		},
		options: [
				{
					displayName: 'Business Center Name',
					name: 'business_center_name',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Campaign',
					name: 'campaign',
					type: 'string',
					default: '',
				},
		],
	},
]


export const leadsrequired: INodeProperties[] = [
	{
		displayName: 'Account Description',
		name: 'account_description',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'Leads',
				],
				operation: [
					'post',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Account Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'Leads',
				],
				operation: [
					'post',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Assigned to',
		name: 'assigned',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'Leads',
				],
				operation: [
					'post',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Department',
		name: 'department',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'Leads',
				],
				operation: [
					'post',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'Leads',
				],
				operation: [
					'post',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Office Number',
		name: 'office_phone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'Leads',
				],
				operation: [
					'post',
				],
			},
		},
		default: '',
	},
]
