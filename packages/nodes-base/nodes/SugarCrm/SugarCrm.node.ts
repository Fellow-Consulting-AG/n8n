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
import { buildOrQuery } from '../Supabase/GenericFunctions';

export class SugarCrm implements INodeType {
	description: INodeTypeDescription = {
			displayName: 'SugarCrm',
			name: 'sugarCrm',
			icon: 'file:sugarCrm.svg',
			group: ['transform'],
			version: 1,
			description: 'Consume SugarCrm API',
			defaults: {
					name: 'SugarCrm',
					color: '#1A82e2',
			},
			inputs: ['main'],
			outputs: ['main'],
			credentials: [
				{
					name: 'sugarCrmApi',
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
								name: 'Contact',
								value: 'Contacts',
							},
							{
								name: 'Company',
								value: 'Accounts',
							},
					],
					default: 'Contacts',
					required: true,
					description: 'Resource to consume',
				},
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
							value: 'POST',
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
							value: 'POST',
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
										'POST',
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
										'POST',
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
										'Accounts'
								],
								operation: [
										'delete',
								],
							},
					},
					options: [
							{
								displayName: 'ID',
								name: 'id',
								type: 'string',
								default: '',
							},
					],
				},

			],
	};

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

    let responseData;
		let response;
		let body;
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    //Get credentials the user provided for this node
    const credentials = await this.getCredentials('sugarCrmApi') as IDataObject;

		const gettoken: OptionsWithUrl = {
			method: 'POST',
			url: `${credentials.sugarbaseurl}rest/v11_15/oauth2/token?grant_type=password&client_id=sugar&username=${credentials.username}&password=${credentials.password}&platform=base`,
			json: true,
		};

		response = await this.helpers.request(gettoken);
		let respdata = response.access_token
		let uriextention = resource
		let methods = operation.toUpperCase()

		if (operation == 'POST') {
			const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;

			if (resource == 'Contacts') {
				body = {
					"first_name": additionalFields.first_name,
					"last_name": additionalFields.last_name,
					"email1": additionalFields.email,
					"phone_work": additionalFields.phone,
				}
			}
			if (resource == 'Accounts') {
				body = {
					"name": additionalFields.name,
					"description": additionalFields.description,
					"ownership": additionalFields.ownership,
					"email1": additionalFields.email,
					"phone_office": additionalFields.phone,
				}
			}
			const options: OptionsWithUrl = {
				headers: {
						'Accept': 'application/json',
						'grant_type': 'refresh_token',
						'Authorization': `Bearer ${respdata}`,
				},
				method: methods,
				body: body,
				url: `${credentials.sugarbaseurl}/rest/v11_15/${uriextention}`,
				json: true,
			};
			responseData = await this.helpers.request(options);
		}
		if (operation === 'get') {
			const options: OptionsWithUrl = {
					headers: {
							'Accept': 'application/json',
							'Authorization': `Bearer ${respdata}`,
					},
					method: methods,
					url: `${credentials.sugarbaseurl}/rest/v11_15/${uriextention}`,
					json: true,
			};
			responseData = await this.helpers.request(options);
		}
		if (operation === 'delete') {
			const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;
			let id = additionalFields.id
			const options: OptionsWithUrl = {
				headers: {
						'Accept': 'application/json',
						'Authorization': `Bearer ${respdata}`,
				},
				method: methods,
				body: {
					"massupdate_params": {
						"uid": [
							id
						]
					}
				},
				url: `${credentials.sugarbaseurl}/rest/v11_15/${uriextention}/MassUpdate`,
				json: true,
			};
			responseData = await this.helpers.request(options);
		}
	return [this.helpers.returnJsonArray(responseData)];
	}
}






// full_module_list: {
// 	Home: 'Home',
// 	Contacts: 'Contacts',
// 	Accounts: 'Accounts',
// 	Opportunities: 'Opportunities',
// 	Cases: 'Cases',
// 	Notes: 'Notes',
// 	Calls: 'Calls',
// 	Emails: 'Emails',
// 	Meetings: 'Meetings',
// 	Tasks: 'Tasks',
// 	Calendar: 'Calendar',
// 	Leads: 'Leads',
// 	Currencies: 'Currencies',
// 	Contracts: 'Contracts',
// 	Quotes: 'Quotes',
// 	Products: 'Products',
// 	WebLogicHooks: 'WebLogicHooks',
// 	ProductCategories: 'ProductCategories',
// 	ProductTypes: 'ProductTypes',
// 	ProductTemplates: 'ProductTemplates',
// 	ProductBundles: 'ProductBundles',
// 	ProductBundleNotes: 'ProductBundleNotes',
// 	Reports: 'Reports',
// 	Forecasts: 'Forecasts',
// 	ForecastWorksheets: 'ForecastWorksheets',
// 	ForecastManagerWorksheets: 'ForecastManagerWorksheets',
// 	VisualPipeline: 'VisualPipeline',
// 	ConsoleConfiguration: 'ConsoleConfiguration',
// 	SugarLive: 'SugarLive',
// 	Quotas: 'Quotas',
// 	Teams: 'Teams',
// 	TeamNotices: 'TeamNotices',
// 	Manufacturers: 'Manufacturers',
// 	Activities: 'Activities',
// 	Comments: 'Comments',
// 	Subscriptions: 'Subscriptions',
// 	Bugs: 'Bugs',
// 	Feeds: 'Feeds',
// 	iFrames: 'iFrames',
// 	TimePeriods: 'TimePeriods',
// 	TaxRates: 'TaxRates',
// 	ContractTypes: 'ContractTypes',
// 	Schedulers: 'Schedulers',
// 	Project: 'Project',
// 	ProjectTask: 'ProjectTask',
// 	Campaigns: 'Campaigns',
// 	CampaignLog: 'CampaignLog',
// 	CampaignTrackers: 'CampaignTrackers',
// 	Documents: 'Documents',
// 	DocumentRevisions: 'DocumentRevisions',
// 	Connectors: 'Connectors',
// 	Roles: 'Roles',
// 	Notifications: 'Notifications',
// 	Sync: 'Sync',
// 	HintAccountsets: 'HintAccountsets',
// 	HintNotificationTargets: 'HintNotificationTargets',
// 	HintNewsNotifications: 'HintNewsNotifications',
// 	HintEnrichFieldConfigs: 'HintEnrichFieldConfigs',
// 	ReportMaker: 'ReportMaker',
// 	DataSets: 'DataSets',
// 	CustomQueries: 'CustomQueries',
// 	pmse_Inbox: 'pmse_Inbox',
// 	pmse_Project: 'pmse_Project',
// 	pmse_Business_Rules: 'pmse_Business_Rules',
// 	pmse_Emails_Templates: 'pmse_Emails_Templates',
// 	BusinessCenters: 'BusinessCenters',
// 	Shifts: 'Shifts',
// 	ShiftExceptions: 'ShiftExceptions',
// 	Purchases: 'Purchases',
// 	PurchasedLineItems: 'PurchasedLineItems',
// 	MobileDevices: 'MobileDevices',
// 	PushNotifications: 'PushNotifications',
// 	Escalations: 'Escalations',
// 	DocumentTemplates: 'DocumentTemplates',
// 	DocumentMerges: 'DocumentMerges',
// 	CloudDrivePaths: 'CloudDrivePaths',
// 	WorkFlow: 'WorkFlow',
// 	EAPM: 'EAPM',
// 	Worksheet: 'Worksheet',
// 	Users: 'Users',
// 	Employees: 'Employees',
// 	Administration: 'Administration',
// 	ACLRoles: 'ACLRoles',
// 	InboundEmail: 'InboundEmail',
// 	Releases: 'Releases',
// 	Prospects: 'Prospects',
// 	Queues: 'Queues',
// 	EmailMarketing: 'EmailMarketing',
// 	EmailTemplates: 'EmailTemplates',
// 	SNIP: 'SNIP',
// 	ProspectLists: 'ProspectLists',
// 	SavedSearch: 'SavedSearch',
// 	UpgradeWizard: 'UpgradeWizard',
// 	Trackers: 'Trackers',
// 	TrackerPerfs: 'TrackerPerfs',
// 	TrackerSessions: 'TrackerSessions',
// 	TrackerQueries: 'TrackerQueries',
// 	FAQ: 'FAQ',
// 	Newsletters: 'Newsletters',
// 	SugarFavorites: 'SugarFavorites',
// 	PdfManager: 'PdfManager',
// 	DataArchiver: 'DataArchiver',
// 	ArchiveRuns: 'ArchiveRuns',
// 	OAuthKeys: 'OAuthKeys',
// 	OAuthTokens: 'OAuthTokens',
// 	Filters: 'Filters',
// 	UserSignatures: 'UserSignatures',
// 	Shippers: 'Shippers',
// 	Styleguide: 'Styleguide',
// 	Feedbacks: 'Feedbacks',
// 	Tags: 'Tags',
// 	Categories: 'Categories',
// 	Dashboards: 'Dashboards',
// 	OutboundEmail: 'OutboundEmail',
// 	EmailParticipants: 'EmailParticipants',
// 	DataPrivacy: 'DataPrivacy',
// 	ReportSchedules: 'ReportSchedules',
// 	CommentLog: 'CommentLog',
// 	Holidays: 'Holidays',
// 	ChangeTimers: 'ChangeTimers',
// 	Messages: 'Messages',
// 	Audit: 'Audit',
// 	RevenueLineItems: 'RevenueLineItems',
// 	DocuSignEnvelopes: 'DocuSignEnvelopes',
// 	Geocode: 'Geocode',
// 	Library: 'Library',
// 	EmailAddresses: 'EmailAddresses',
// 	Words: 'Words',
// 	Sugar_Favorites: 'Sugar_Favorites',
// 	KBDocuments: 'KBDocuments',
// 	KBContents: 'KBContents',
// 	KBArticles: 'KBArticles',
// 	KBContentTemplates: 'KBContentTemplates',
// 	EmbeddedFiles: 'EmbeddedFiles',
// 	DRI_SubWorkflows: 'DRI_SubWorkflows',
// 	DRI_SubWorkflow_Templates: 'DRI_SubWorkflow_Templates',
// 	DRI_Workflows: 'DRI_Workflows',
// 	DRI_Workflow_Task_Templates: 'DRI_Workflow_Task_Templates',
// 	DRI_Workflow_Templates: 'DRI_Workflow_Templates',
// 	CJ_Forms: 'CJ_Forms',
// 	CJ_WebHooks: 'CJ_WebHooks',
// 	_hash: '6bf09067050d9fb47ad0a50b1a543fc2'
// }
