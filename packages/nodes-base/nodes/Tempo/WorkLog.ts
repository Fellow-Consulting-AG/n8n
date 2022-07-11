import {
	INodeProperties,
} from 'n8n-workflow';

export const worklogOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'worklog',
				],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get worklog for Projects/Issues',
			},
		],
		default: 'get',
		description: 'The operation to perform.',
	},
];


export const worklogFields: INodeProperties[] = [
	{
		displayName: 'What to check',
		name: 'projectissue',
		type: 'options',
		required: true,
		default: null,
		displayOptions: {
			show: {
				resource: [
					'worklog',
				],
				operation: [
					'get',
				],
			},
		},
		options: [
			{
				name: 'Project key',
				value: 'projectkey',
				description: 'Check using Project Key.',
			},
			{
				name: 'Issue Key',
				value: 'issuekey',
				description: 'Check using Issue Key.',
			},
		]
	},
	{
		displayName: 'Key',
		name: 'key',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'worklog',
				],
				operation: [
					'get',
				],
				projectissue: [
					'projectkey'
				],
			},
		},
		default: {},
		description: 'Enter Project Key',
	},
	{
		displayName: 'Key',
		name: 'key',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'worklog',
				],
				operation: [
					'get',
				],
				projectissue: [
					'issuekey'
				],
			},
		},
		default: '',
		description: 'Enter Issue Key',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'worklog',
				],
				operation: [
					'get',
				],
			},
		},
		options: [
			{
				displayName: 'Retrieve since Date',
				name: 'startdate',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Retrieve up to Date',
				name: 'enddate',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Retrieve updated since Date',
				name: 'updatedate',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Limit Output',
				name: 'limit',
				type: 'string',
				default: '',
			},
		],
	},
]
