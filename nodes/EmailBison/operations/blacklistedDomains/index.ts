import { INodeProperties } from 'n8n-workflow';

export const blacklistedDomainOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['blacklistedDomain'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add a domain to the blacklist',
				action: 'Blacklist a domain',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove a domain from the blacklist',
				action: 'Remove domain from blacklist',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get all blacklisted domains',
				action: 'Get blacklisted domains',
			},
		],
		default: 'create',
	},
];

export const blacklistedDomainFields: INodeProperties[] = [
	// Create operation fields
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		placeholder: 'example.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['blacklistedDomain'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The domain to add to the blacklist (e.g., "example.com"). All leads with email addresses from this domain will not receive emails.',
	},

	// Delete operation fields
	{
		displayName: 'Blacklisted Domain ID',
		name: 'blacklistedDomainId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['blacklistedDomain'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'The ID of the blacklisted domain entry to remove. You can get this from the "Get Many" operation.',
	},

	// Get Many operation fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['blacklistedDomain'],
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
				resource: ['blacklistedDomain'],
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
