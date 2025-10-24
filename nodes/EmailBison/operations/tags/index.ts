import { INodeProperties } from 'n8n-workflow';

export const tagOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tag'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new tag',
				action: 'Create a tag',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a tag',
				action: 'Delete a tag',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a tag by ID',
				action: 'Get a tag',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get multiple tags',
				action: 'Get many tags',
			},
			{
				name: 'Attach Tags to Leads',
				value: 'attachToLeads',
				description: 'Attach multiple tags to leads',
				action: 'Attach tags to leads',
			},
			{
				name: 'Remove Tags from Leads',
				value: 'removeFromLeads',
				description: 'Remove multiple tags from leads',
				action: 'Remove tags from leads',
			},
			{
				name: 'Attach Tags to Campaigns',
				value: 'attachToCampaigns',
				description: 'Attach multiple tags to campaigns',
				action: 'Attach tags to campaigns',
			},
			{
				name: 'Remove Tags from Campaigns',
				value: 'removeFromCampaigns',
				description: 'Remove multiple tags from campaigns',
				action: 'Remove tags from campaigns',
			},
			{
				name: 'Attach Tags to Email Accounts',
				value: 'attachToEmailAccounts',
				description: 'Attach multiple tags to email accounts',
				action: 'Attach tags to email accounts',
			},
			{
				name: 'Remove Tags from Email Accounts',
				value: 'removeFromEmailAccounts',
				description: 'Remove multiple tags from email accounts',
				action: 'Remove tags from email accounts',
			},
		],
		default: 'create',
	},
];

export const tagFields: INodeProperties[] = [
	// Get/Delete operation fields - Tag selector (must come FIRST)
	{
		displayName: 'Tag',
		name: 'tagId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTags',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The tag to work with. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// Create operation fields
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Name of the tag',
	},
	{
		displayName: 'Default',
		name: 'default',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['create'],
			},
		},
		default: false,
		description: 'Whether the tag should be default or not',
	},

	// Get Many operation fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['tag'],
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
				resource: ['tag'],
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

	// Attach Tags to Leads operation fields
	{
		displayName: 'Tags',
		name: 'tagIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getTags',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['attachToLeads'],
			},
		},
		default: [],
		description: 'The tags to attach. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Lead IDs',
		name: 'leadIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['attachToLeads'],
			},
		},
		default: '',
		description: 'Comma-separated list of lead IDs to attach tags to, or use an expression',
	},
	{
		displayName: 'Skip Webhooks',
		name: 'skipWebhooks',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['attachToLeads'],
			},
		},
		default: false,
		description: 'Whether to skip firing webhooks for this action',
	},

	// Remove Tags from Leads operation fields
	{
		displayName: 'Tags',
		name: 'tagIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getTags',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['removeFromLeads'],
			},
		},
		default: [],
		description: 'The tags to remove. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Lead IDs',
		name: 'leadIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['removeFromLeads'],
			},
		},
		default: '',
		description: 'Comma-separated list of lead IDs to remove tags from, or use an expression',
	},
	{
		displayName: 'Skip Webhooks',
		name: 'skipWebhooks',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['removeFromLeads'],
			},
		},
		default: false,
		description: 'Whether to skip firing webhooks for this action',
	},

	// Attach Tags to Campaigns operation fields
	{
		displayName: 'Tags',
		name: 'tagIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getTags',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['attachToCampaigns'],
			},
		},
		default: [],
		description: 'The tags to attach. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Campaign IDs',
		name: 'campaignIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['attachToCampaigns'],
			},
		},
		default: '',
		description: 'Comma-separated list of campaign IDs to attach tags to, or use an expression',
	},
	{
		displayName: 'Skip Webhooks',
		name: 'skipWebhooks',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['attachToCampaigns'],
			},
		},
		default: false,
		description: 'Whether to skip firing webhooks for this action',
	},

	// Remove Tags from Campaigns operation fields
	{
		displayName: 'Tags',
		name: 'tagIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getTags',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['removeFromCampaigns'],
			},
		},
		default: [],
		description: 'The tags to remove. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Campaign IDs',
		name: 'campaignIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['removeFromCampaigns'],
			},
		},
		default: '',
		description: 'Comma-separated list of campaign IDs to remove tags from, or use an expression',
	},
	{
		displayName: 'Skip Webhooks',
		name: 'skipWebhooks',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['removeFromCampaigns'],
			},
		},
		default: false,
		description: 'Whether to skip firing webhooks for this action',
	},

	// Attach Tags to Email Accounts operation fields
	{
		displayName: 'Tags',
		name: 'tagIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getTags',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['attachToEmailAccounts'],
			},
		},
		default: [],
		description: 'The tags to attach. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Email Account IDs',
		name: 'emailAccountIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['attachToEmailAccounts'],
			},
		},
		default: '',
		description: 'Comma-separated list of email account IDs to attach tags to, or use an expression',
	},
	{
		displayName: 'Skip Webhooks',
		name: 'skipWebhooks',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['attachToEmailAccounts'],
			},
		},
		default: false,
		description: 'Whether to skip firing webhooks for this action',
	},

	// Remove Tags from Email Accounts operation fields
	{
		displayName: 'Tags',
		name: 'tagIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getTags',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['removeFromEmailAccounts'],
			},
		},
		default: [],
		description: 'The tags to remove. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Email Account IDs',
		name: 'emailAccountIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['removeFromEmailAccounts'],
			},
		},
		default: '',
		description: 'Comma-separated list of email account IDs to remove tags from, or use an expression',
	},
	{
		displayName: 'Skip Webhooks',
		name: 'skipWebhooks',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['removeFromEmailAccounts'],
			},
		},
		default: false,
		description: 'Whether to skip firing webhooks for this action',
	},
];
