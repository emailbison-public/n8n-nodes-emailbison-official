import { INodeProperties } from 'n8n-workflow';

export const blacklistedEmailOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['blacklistedEmail'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add an email to the blacklist',
				action: 'Blacklist an email',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove an email from the blacklist',
				action: 'Remove email from blacklist',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get all blacklisted emails',
				action: 'Get blacklisted emails',
			},
		],
		default: 'create',
	},
];

export const blacklistedEmailFields: INodeProperties[] = [
	// Create operation fields
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@example.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['blacklistedEmail'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The email address to add to the blacklist. Leads with this email will not receive emails.',
	},

	// Delete operation fields
	{
		displayName: 'Blacklisted Email ID',
		name: 'blacklistedEmailId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['blacklistedEmail'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'The ID of the blacklisted email entry to remove. You can get this from the "Get Many" operation.',
	},

	// Get Many operation fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['blacklistedEmail'],
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
				resource: ['blacklistedEmail'],
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
