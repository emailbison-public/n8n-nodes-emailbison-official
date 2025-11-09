import { INodeProperties } from 'n8n-workflow';

export const replyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['reply'],
			},
		},
		options: [
			{
				name: 'Compose Email',
				value: 'compose',
				description: 'Send a one-off email in a new email thread',
				action: 'Compose and send email',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get multiple replies',
				action: 'Get many replies',
			},
			{
				name: 'Mark as Interested',
				value: 'markInterested',
				description: 'Mark a reply as interested',
				action: 'Mark reply as interested',
			},
			{
				name: 'Push to Follow-up Campaign',
				value: 'pushToFollowup',
				description: 'Push reply to a follow-up campaign',
				action: 'Push to follow-up campaign',
			},
		],
		default: 'compose',
	},
];

export const replyFields: INodeProperties[] = [
	// Compose Email operation fields
	{
		displayName: 'Sender Email ID',
		name: 'senderEmailId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['compose'],
			},
		},
		default: '',
		description: 'The ID of the sender email account to send from',
	},
	{
		displayName: 'To Emails',
		name: 'toEmails',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['compose'],
			},
		},
		default: { values: [{ name: '', emailAddress: '' }] },
		options: [
			{
				name: 'values',
				displayName: 'Recipients',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Recipient name',
					},
					{
						displayName: 'Email Address',
						name: 'emailAddress',
						type: 'string',
						default: '',
						description: 'Recipient email address',
					},
				],
			},
		],
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['compose'],
			},
		},
		default: '',
		description: 'Email subject line',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['compose'],
			},
		},
		default: '',
		description: 'Email body content',
	},
	{
		displayName: 'Content Type',
		name: 'contentType',
		type: 'options',
		options: [
			{
				name: 'HTML',
				value: 'html',
			},
			{
				name: 'Text',
				value: 'text',
			},
		],
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['compose'],
			},
		},
		default: 'html',
		description: 'Type of email content',
	},
	{
		displayName: 'CC Emails',
		name: 'ccEmails',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['compose'],
			},
		},
		default: { values: [] },
		options: [
			{
				name: 'values',
				displayName: 'CC Recipients',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Recipient name',
					},
					{
						displayName: 'Email Address',
						name: 'emailAddress',
						type: 'string',
						default: '',
						description: 'Recipient email address',
					},
				],
			},
		],
	},
	{
		displayName: 'BCC Emails',
		name: 'bccEmails',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['compose'],
			},
		},
		default: { values: [] },
		options: [
			{
				name: 'values',
				displayName: 'BCC Recipients',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Recipient name',
					},
					{
						displayName: 'Email Address',
						name: 'emailAddress',
						type: 'string',
						default: '',
						description: 'Recipient email address',
					},
				],
			},
		],
	},
	{
		displayName: 'Use Dedicated IPs',
		name: 'useDedicatedIps',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['compose'],
			},
		},
		default: false,
		description: 'Send using dedicated campaign IPs instead of instance IP',
	},

	// Get Many operation fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['reply'],
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
				resource: ['reply'],
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
				resource: ['reply'],
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
			{
				displayName: 'Lead ID',
				name: 'lead_id',
				type: 'string',
				default: '',
				description: 'Filter by lead ID',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Unread',
						value: 'unread',
					},
					{
						name: 'Read',
						value: 'read',
					},
					{
						name: 'Interested',
						value: 'interested',
					},
					{
						name: 'Not Interested',
						value: 'not_interested',
					},
				],
				default: '',
				description: 'Filter by reply status',
			},
		],
	},

	// Mark as Interested / Push to Follow-up operation fields
	{
		displayName: 'Reply ID',
		name: 'replyId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['markInterested', 'pushToFollowup'],
			},
		},
		default: '',
		description: 'ID of the reply',
	},

	// Push to Follow-up specific fields
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['pushToFollowup'],
			},
		},
		default: '',
		description: 'ID of the follow-up campaign',
	},
	{
		displayName: 'Force Add Reply',
		name: 'forceAddReply',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['reply'],
				operation: ['pushToFollowup'],
			},
		},
		default: false,
		description: 'Whether to bypass unsubscribed/bounced checks',
	},
];
