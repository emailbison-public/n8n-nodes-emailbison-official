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
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a lead',
				action: 'Delete a lead',
			},
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
	// Get/Update/Delete operation fields - Lead selector (must come FIRST for update operation)
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
				operation: ['get', 'update', 'delete'],
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
		type: 'string',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Comma-separated list of tags to assign to the lead',
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
		displayName: 'Lead IDs',
		name: 'leadIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['attachTags'],
			},
		},
		default: '',
		description: 'Comma-separated list of lead IDs to attach tags to',
	},
	{
		displayName: 'Tag IDs',
		name: 'tagIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['attachTags'],
			},
		},
		default: '',
		description: 'Comma-separated list of tag IDs to attach to the leads',
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
		description: 'Whether to return all results or only up to a given limit',
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
		description: 'Max number of results to return',
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
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Filter by email address',
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				description: 'Filter by tag',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: 'Filter by company name',
			},
		],
	},
];
