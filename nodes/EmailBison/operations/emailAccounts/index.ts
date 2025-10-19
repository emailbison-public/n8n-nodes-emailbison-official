import { INodeProperties } from 'n8n-workflow';

export const emailAccountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['emailAccount'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new email account',
				action: 'Create an email account',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an email account',
				action: 'Delete an email account',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an email account by ID',
				action: 'Get an email account',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get multiple email accounts',
				action: 'Get many email accounts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an email account',
				action: 'Update an email account',
			},
		],
		default: 'create',
	},
];

export const emailAccountFields: INodeProperties[] = [
	// Create operation fields
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'sender@yourdomain.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['emailAccount'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Email address for the sender account',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['emailAccount'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Display name for the sender',
	},
	{
		displayName: 'SMTP Host',
		name: 'smtpHost',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['emailAccount'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'SMTP server hostname',
	},
	{
		displayName: 'SMTP Port',
		name: 'smtpPort',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['emailAccount'],
				operation: ['create', 'update'],
			},
		},
		default: 587,
		description: 'SMTP server port',
	},
	{
		displayName: 'SMTP Username',
		name: 'smtpUsername',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['emailAccount'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'SMTP authentication username',
	},
	{
		displayName: 'SMTP Password',
		name: 'smtpPassword',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['emailAccount'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'SMTP authentication password',
	},
	{
		displayName: 'SMTP Security',
		name: 'smtpSecurity',
		type: 'options',
		options: [
			{
				name: 'None',
				value: 'none',
			},
			{
				name: 'TLS',
				value: 'tls',
			},
			{
				name: 'SSL',
				value: 'ssl',
			},
		],
		displayOptions: {
			show: {
				resource: ['emailAccount'],
				operation: ['create', 'update'],
			},
		},
		default: 'tls',
		description: 'SMTP security protocol',
	},
	{
		displayName: 'Daily Send Limit',
		name: 'dailySendLimit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['emailAccount'],
				operation: ['create', 'update'],
			},
		},
		default: 500,
		description: 'Maximum number of emails to send per day',
	},

	// Get/Update/Delete operation fields
	{
		displayName: 'Email Account',
		name: 'emailAccountId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getSenderEmails',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['emailAccount'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The email account to work with. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// Get Many operation fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['emailAccount'],
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
				resource: ['emailAccount'],
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
