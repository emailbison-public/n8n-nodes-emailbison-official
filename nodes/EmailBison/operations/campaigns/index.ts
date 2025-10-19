import { INodeProperties } from 'n8n-workflow';

export const campaignOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new campaign',
				action: 'Create a campaign',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a campaign',
				action: 'Delete a campaign',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a campaign by ID',
				action: 'Get a campaign',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get multiple campaigns',
				action: 'Get many campaigns',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a campaign',
				action: 'Update a campaign',
			},
			{
				name: 'Start',
				value: 'start',
				description: 'Start a campaign',
				action: 'Start a campaign',
			},
			{
				name: 'Stop',
				value: 'stop',
				description: 'Stop a campaign',
				action: 'Stop a campaign',
			},
			{
				name: 'Pause',
				value: 'pause',
				description: 'Pause a campaign',
				action: 'Pause a campaign',
			},
			{
				name: 'Add Leads',
				value: 'addLeads',
				description: 'Add leads to a campaign',
				action: 'Add leads to campaign',
			},
		],
		default: 'create',
	},
];

export const campaignFields: INodeProperties[] = [
	// Create operation fields
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Name of the campaign',
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Email subject line',
	},
	{
		displayName: 'Email Content',
		name: 'emailContent',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'HTML content of the email',
	},
	{
		displayName: 'From Email',
		name: 'fromEmail',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Sender email address',
	},
	{
		displayName: 'From Name',
		name: 'fromName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Sender name',
	},
	{
		displayName: 'Reply To',
		name: 'replyTo',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Reply-to email address',
	},
	{
		displayName: 'Schedule Type',
		name: 'scheduleType',
		type: 'options',
		options: [
			{
				name: 'Send Now',
				value: 'now',
			},
			{
				name: 'Schedule for Later',
				value: 'scheduled',
			},
		],
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create', 'update'],
			},
		},
		default: 'now',
		description: 'When to send the campaign',
	},
	{
		displayName: 'Scheduled Date',
		name: 'scheduledDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create', 'update'],
				scheduleType: ['scheduled'],
			},
		},
		default: '',
		description: 'Date and time to send the campaign',
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Comma-separated list of tags for the campaign',
	},

	// Get/Update/Delete/Start/Stop operation fields
	{
		displayName: 'Campaign',
		name: 'campaignId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCampaigns',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['get', 'update', 'delete', 'start', 'stop', 'pause', 'addLeads'],
			},
		},
		default: '',
		description: 'The campaign to work with. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// Add Leads operation fields
	{
		displayName: 'Lead IDs',
		name: 'leadIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['addLeads'],
			},
		},
		default: '',
		description: 'Comma-separated list of lead IDs to add to the campaign',
	},

	// Get Many operation fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['getMany'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['getMany'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Draft',
						value: 'draft',
					},
					{
						name: 'Scheduled',
						value: 'scheduled',
					},
					{
						name: 'Sending',
						value: 'sending',
					},
					{
						name: 'Sent',
						value: 'sent',
					},
					{
						name: 'Paused',
						value: 'paused',
					},
				],
				default: '',
				description: 'Filter by campaign status',
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				description: 'Filter by tag',
			},
		],
	},
];
