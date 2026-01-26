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
				name: 'Add Leads',
				value: 'addLeads',
				description: 'Add leads to a campaign',
				action: 'Add leads to campaign',
			},
			{
				name: 'Add Sequence Step',
				value: 'addSequenceStep',
				description: 'Add a follow-up email step to a campaign sequence',
				action: 'Add sequence step to campaign',
			},
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
				name: 'Delete Many',
				value: 'deleteMany',
				description: 'Delete multiple campaigns',
				action: 'Delete many campaigns',
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
				name: 'Start/Resume',
				value: 'resume',
				description: 'Start or resume a campaign',
				action: 'Start/Resume a campaign',
			},
			{
				name: 'Stop/Pause',
				value: 'pause',
				description: 'Stop or pause a campaign',
				action: 'Stop/Pause a campaign',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a campaign',
				action: 'Update a campaign',
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
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Name of the campaign',
	},

	// Update operation - Campaign selection field (appears first)
	{
		displayName: 'Campaign',
		name: 'campaignId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCampaigns',
		},
		// No required flag - validation happens at runtime
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The campaign to update. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// Update operation - Name field
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'New name for the campaign (leave empty to keep current name)',
	},

	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
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
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'HTML content of the email',
	},
	{
		displayName: 'Sender Emails',
		name: 'senderEmails',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getSenderEmails',
		},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		default: [],
		description: 'The email accounts to send from. Select one or multiple email accounts. Choose from the list, or specify IDs using an expression.',
	},
	{
		displayName: 'Sender Emails',
		name: 'senderEmails',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getSenderEmails',
		},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['update'],
			},
		},
		default: [],
		description: 'The email accounts to send from (leave empty to keep current sender emails). Choose from the list, or specify IDs using an expression.',
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
		description: 'Sender name (optional - EmailBison will use the name from the connected email account if not provided)',
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
		description: 'Reply-to email address (optional)',
		placeholder: 'reply@example.com',
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
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getTags',
		},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create', 'update'],
			},
		},
		default: [],
		description: 'Tags to attach to the campaign. Choose from the list, or specify tag IDs using an expression.',
	},

	// Get/Start/Stop/Pause/AddLeads/Delete operation fields (Update has its own field above)
	{
		displayName: 'Campaign',
		name: 'campaignId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCampaigns',
		},
		// No required flag - validation happens at runtime
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['get', 'resume', 'pause', 'addLeads', 'delete'],
			},
		},
		default: '',
		description: 'The campaign to work with. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// Delete Many operation fields
	{
		displayName: 'Campaign IDs',
		name: 'campaignIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['deleteMany'],
			},
		},
		default: '',
		description: 'Comma-separated list of campaign IDs to delete (e.g., "123,456,789"). This action is permanent and cannot be undone.',
		placeholder: '123,456,789',
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
		description: 'Lead IDs to add to the campaign. Accepts: comma-separated string (e.g., "33500,33501,33502"), single ID (e.g., "33500"), or expression that returns number/array.',
		placeholder: '33500,33501,33502',
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

// Add Sequence Step operation fields
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
			operation: ['addSequenceStep'],
		},
	},
	default: '',
	description: 'The campaign to add the sequence step to. Choose from the list, or specify an ID using an expression.',
},
{
	displayName: 'Email Subject',
	name: 'emailSubject',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['campaign'],
			operation: ['addSequenceStep'],
		},
	},
	default: '',
	description: 'Subject line for this email step',
},
{
	displayName: 'Email Body',
	name: 'emailBody',
	type: 'string',
	typeOptions: {
		rows: 10,
	},
	required: true,
	displayOptions: {
		show: {
			resource: ['campaign'],
			operation: ['addSequenceStep'],
		},
	},
	default: '',
	description: 'HTML content for this email step',
},
{
	displayName: 'Step Order',
	name: 'stepOrder',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['campaign'],
			operation: ['addSequenceStep'],
		},
	},
	default: 2,
	description: 'The order of this step in the sequence (e.g., 2 for second email, 3 for third)',
},
{
	displayName: 'Wait Days',
	name: 'waitDays',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['campaign'],
			operation: ['addSequenceStep'],
		},
	},
	default: 3,
	description: 'Number of days to wait before sending this email after the previous step',
},
{
	displayName: 'Additional Fields',
	name: 'additionalFields',
	type: 'collection',
	placeholder: 'Add Field',
	default: {},
	displayOptions: {
		show: {
			resource: ['campaign'],
			operation: ['addSequenceStep'],
		},
	},
	options: [
		{
			displayName: 'Sequence Title',
			name: 'sequenceTitle',
			type: 'string',
			default: '',
			description: 'Optional title for the sequence (defaults to campaign name + " sequence")',
		},
		{
			displayName: 'Is Variant',
			name: 'variant',
			type: 'boolean',
			default: false,
			description: 'Whether this is a variant email for A/B testing',
		},
		{
			displayName: 'Thread Reply',
			name: 'threadReply',
			type: 'boolean',
			default: false,
			description: 'Whether this email should be sent as a reply in the same thread',
		},
	],
},
];
