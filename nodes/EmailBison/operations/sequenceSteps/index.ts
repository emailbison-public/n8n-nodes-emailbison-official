import { INodeProperties } from 'n8n-workflow';

export const sequenceStepOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sequenceStep'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get multiple sequence steps',
				action: 'Get many sequence steps',
			},
			{
				name: 'Send Test Email',
				value: 'sendTest',
				description: 'Send a test email from a sequence step',
				action: 'Send test email',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a sequence step',
				action: 'Delete a sequence step',
			},
		],
		default: 'getMany',
	},
];

export const sequenceStepFields: INodeProperties[] = [
	// Get Many operation fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['sequenceStep'],
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
				resource: ['sequenceStep'],
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
				resource: ['sequenceStep'],
				operation: ['getMany'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				default: '',
				description: 'Filter by campaign ID',
			},
		],
	},

	// Send Test Email operation fields
	{
		displayName: 'Sequence Step ID',
		name: 'sequenceStepId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sequenceStep'],
				operation: ['sendTest', 'delete'],
			},
		},
		default: '',
		description: 'ID of the sequence step',
	},
	{
		displayName: 'Sender Email ID',
		name: 'senderEmailId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sequenceStep'],
				operation: ['sendTest'],
			},
		},
		default: '',
		description: 'ID of the sender email account to use',
	},
	{
		displayName: 'To Email',
		name: 'toEmail',
		type: 'string',
		placeholder: 'test@example.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['sequenceStep'],
				operation: ['sendTest'],
			},
		},
		default: '',
		description: 'Email address to send the test email to',
	},
	{
		displayName: 'Use Dedicated IPs',
		name: 'useDedicatedIps',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['sequenceStep'],
				operation: ['sendTest'],
			},
		},
		default: false,
		description: 'Whether to use dedicated IP addresses for sending',
	},
];
