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
				name: 'Update',
				value: 'update',
				description: 'Update a tag',
				action: 'Update a tag',
			},
			{
				name: 'Attach to Leads',
				value: 'attachToLeads',
				description: 'Attach tags to leads',
				action: 'Attach tags to leads',
			},
		],
		default: 'create',
	},
];

export const tagFields: INodeProperties[] = [
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
		displayName: 'Color',
		name: 'color',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['create', 'update'],
			},
		},
		default: '#007bff',
		description: 'Color of the tag (hex format)',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Description of the tag',
	},

	// Attach to Leads operation fields
	{
		displayName: 'Tag IDs',
		name: 'tagIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['attachToLeads'],
			},
		},
		default: '',
		description: 'Comma-separated list of tag IDs to attach to the leads',
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
		description: 'Comma-separated list of lead IDs to attach tags to',
	},

	// Get/Update/Delete operation fields
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
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The tag to work with. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
];
