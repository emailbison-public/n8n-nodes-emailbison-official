import { INodeProperties } from 'n8n-workflow';

export const leadOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lead'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new lead',
				action: 'Create a lead',
			},
			// NOTE: DELETE endpoint does not exist in EmailBison API (as of 2025-10-19)
			// Commented out but kept for future implementation
			// {
			// 	name: 'Delete',
			// 	value: 'delete',
			// 	description: 'Delete a lead',
			// 	action: 'Delete a lead',
			// },
			{
				name: 'Get',
				value: 'get',
				description: 'Get a lead by ID',
				action: 'Get a lead',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get multiple leads',
				action: 'Get many leads',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a lead',
				action: 'Update a lead',
			},
			{
				name: 'Attach Tags',
				value: 'attachTags',
				description: 'Attach tags to leads',
				action: 'Attach tags to leads',
			},
		],
		default: 'create',
	},
];

export const leadFields: INodeProperties[] = [
	// Get/Update operation fields - Lead selector (must come FIRST for update operation)
	{
		displayName: 'Lead',
		name: 'leadId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getLeads',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['get', 'update'], // 'delete' removed - endpoint doesn't exist
			},
		},
		default: '',
		description: 'The lead to work with. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// Create operation fields
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Email address of the lead',
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'First name of the lead',
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Last name of the lead',
	},
	{
		displayName: 'Company',
		name: 'company',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Company name of the lead',
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Phone number of the lead',
	},
	{
		displayName: 'Website',
		name: 'website',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Website URL of the lead',
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
				resource: ['lead'],
				operation: ['create', 'update'],
			},
		},
		default: [],
		description: 'Tags to assign to the lead. Choose from the list, or specify IDs using an expression.',
	},
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		description: 'Custom fields for the lead',
		options: [
			{
				name: 'field',
				displayName: 'Field',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'Custom field key',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Custom field value',
					},
				],
			},
		],
	},

	// Attach Tags operation fields
	{
		displayName: 'Leads',
		name: 'leadIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getLeads',
		},
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['attachTags'],
			},
		},
		default: [],
		description: 'The leads to attach tags to. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Tags',
		name: 'tagIds',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getTags',
		},
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['attachTags'],
			},
		},
		default: [],
		description: 'The tags to attach to the leads. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Skip Webhooks',
		name: 'skipWebhooks',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['attachTags'],
			},
		},
		default: false,
		description: 'Whether to skip firing webhooks for this action',
	},

	// Get Many operation fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getMany'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit. ⚠️ Note: EmailBison API has a hard limit of 15 leads per request. This setting does not change the API behavior.',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: '⚠️ WARNING: The EmailBison API ignores this parameter and always returns a maximum of 15 leads per request. Use the Search and Filters options to narrow down results.',
	},
	{
		displayName: 'Search',
		name: 'search',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getMany'],
			},
		},
		default: '',
		description: 'Search term for filtering leads across multiple fields',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getMany'],
			},
		},
		default: {},
		description: 'Additional filters for leads. Note: API returns 15 leads per page maximum.',
		options: [
			{
				displayName: 'Lead Campaign Status',
				name: 'lead_campaign_status',
				type: 'options',
				options: [
					{ name: 'In Sequence', value: 'in_sequence' },
					{ name: 'Sequence Finished', value: 'sequence_finished' },
					{ name: 'Sequence Stopped', value: 'sequence_stopped' },
					{ name: 'Never Contacted', value: 'never_contacted' },
					{ name: 'Replied', value: 'replied' },
				],
				default: '',
				description: 'Filter by lead campaign status',
			},
			{
				displayName: 'Verification Statuses',
				name: 'verification_statuses',
				type: 'multiOptions',
				options: [
					{ name: 'Verifying', value: 'verifying' },
					{ name: 'Verified', value: 'verified' },
					{ name: 'Risky', value: 'risky' },
					{ name: 'Unknown', value: 'unknown' },
					{ name: 'Unverified', value: 'unverified' },
					{ name: 'Inactive', value: 'inactive' },
					{ name: 'Bounced', value: 'bounced' },
					{ name: 'Unsubscribed', value: 'unsubscribed' },
				],
				default: [],
				description: 'Filter by verification status (can select multiple)',
			},
			{
				displayName: 'Tag IDs',
				name: 'tag_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tag IDs to filter by (e.g., "1,2,3")',
			},
			{
				displayName: 'Excluded Tag IDs',
				name: 'excluded_tag_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tag IDs to exclude (e.g., "1,2,3")',
			},
			{
				displayName: 'Without Tags',
				name: 'without_tags',
				type: 'boolean',
				default: false,
				description: 'Whether to show only leads that have no tags attached',
			},
		],
	},
];
