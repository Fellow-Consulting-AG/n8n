import {
	INodeProperties,
} from 'n8n-workflow';


export const activityoperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
						'Activities',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'post',
				description: 'Create an activity',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get activities',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an activity',
			},
		],
		default: 'get',
		description: 'The operation to perform.',
	},
]


export const activityfields: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
				show: {
					resource: [
							'Activities',
					],
					operation: [
							'post',
					],
				},
		},
		options: [
				{
					displayName: 'Start Date',
					name: 'start_date',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Priority',
					name: 'priority',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Status',
					name: 'status',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Tags',
					name: 'tags',
					type: 'string',
					default: '',
				},
		],
	},
]


export const activityrequired: INodeProperties[] = [
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'Activities',
				],
				operation: [
					'post',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Related to',
		name: 'related_to',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'Activities',
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
		name: 'assigned_to',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'Activities',
				],
				operation: [
					'post',
				],
			},
		},
		default: '',
	},
]
