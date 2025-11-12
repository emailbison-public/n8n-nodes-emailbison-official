import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	NodeOperationError,
} from 'n8n-workflow';

import { leadOperations, leadFields } from './operations/leads';
import { campaignOperations, campaignFields } from './operations/campaigns';
import { emailAccountOperations, emailAccountFields } from './operations/emailAccounts';
import { tagOperations, tagFields } from './operations/tags';
import { workspaceOperations, workspaceFields } from './operations/workspaces';
import { webhookOperations, webhookFields } from './operations/webhooks';
import { sequenceStepOperations, sequenceStepFields } from './operations/sequenceSteps';
import { replyOperations, replyFields } from './operations/replies';

export class EmailBison implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'EmailBison',
		name: 'emailBison',
		icon: 'file:emailbison.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with EmailBison API',
		defaults: {
			name: 'EmailBison',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'emailBisonApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.serverUrl}}/api',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Lead',
						value: 'lead',
					},
					{
						name: 'Campaign',
						value: 'campaign',
					},
					{
						name: 'Email Account',
						value: 'emailAccount',
					},
					{
						name: 'Tag',
						value: 'tag',
					},
					{
						name: 'Workspace',
						value: 'workspace',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
					{
						name: 'Sequence Step',
						value: 'sequenceStep',
					},
					{
						name: 'Reply',
						value: 'reply',
					},
				],
				default: 'lead',
			},
			...leadOperations,
			...campaignOperations,
			...emailAccountOperations,
			...tagOperations,
			...workspaceOperations,
			...webhookOperations,
			...sequenceStepOperations,
			...replyOperations,
			...leadFields,
			...campaignFields,
			...emailAccountFields,
			...tagFields,
			...workspaceFields,
			...webhookFields,
			...sequenceStepFields,
			...replyFields,
		],
	};

	methods = {
		loadOptions: {
			// Get all leads for dropdown selection
			async getLeads(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('emailBisonApi');

				try {

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'emailBisonApi',
						{
							method: 'GET',
							baseURL: `${credentials.serverUrl}/api`,
							url: '/leads',
							qs: {
								limit: 100,
							},
						},
					);


					const leads = response.data || response;

					if (!Array.isArray(leads)) {
						console.error('❌ getLeads: Response is not an array:', leads);
						return [];
					}


					// Log pagination info if available
					if (response.meta) {
					}
					if (response.links) {
					}

					return leads.map((lead: any) => ({
						name: `${lead.first_name || ''} ${lead.last_name || ''} - ${lead.email} (ID: ${lead.id})`.trim(),
						value: lead.id.toString(),
					}));
				} catch (error) {
					console.error('❌ Error loading leads:', error);
					return [];
				}
			},

			// Get all campaigns for dropdown selection
			async getCampaigns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('emailBisonApi');

				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'emailBisonApi',
						{
							method: 'GET',
							baseURL: `${credentials.serverUrl}/api`,
							url: '/campaigns',
							qs: {
								limit: 100,
								per_page: 100,
							},
						},
					);

					const campaigns = response.data || response;

					if (!Array.isArray(campaigns)) {
						console.error('getCampaigns: Response is not an array:', campaigns);
						return [];
					}


					return campaigns.map((campaign: any) => ({
						name: `${campaign.name} - ${campaign.status || 'N/A'} (ID: ${campaign.id})`,
						value: campaign.id.toString(),
					}));
				} catch (error) {
					console.error('❌ Error loading campaigns:', error);
					return [];
				}
			},

			// Get all email accounts (sender emails) for dropdown selection
			async getSenderEmails(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('emailBisonApi');

				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'emailBisonApi',
						{
							method: 'GET',
							baseURL: `${credentials.serverUrl}/api`,
							url: '/sender-emails',
							qs: {
								limit: 100,
								per_page: 100,
							},
						},
					);

					const senderEmails = response.data || response;

					if (!Array.isArray(senderEmails)) {
						console.error('getSenderEmails: Response is not an array:', senderEmails);
						return [];
					}


					return senderEmails.map((email: any) => ({
						name: `${email.email} - ${email.name || 'N/A'} (ID: ${email.id})`,
						value: email.id.toString(),
					}));
				} catch (error) {
					console.error('❌ Error loading sender emails:', error);
					return [];
				}
			},

			// Get all workspaces for dropdown selection
			async getWorkspaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('emailBisonApi');

				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'emailBisonApi',
						{
							method: 'GET',
							baseURL: `${credentials.serverUrl}/api`,
							url: '/workspaces/v1.1',
							qs: {
								limit: 100,
								per_page: 100,
							},
						},
					);

					const workspaces = response.data || response;

					if (!Array.isArray(workspaces)) {
						console.error('getWorkspaces: Response is not an array:', workspaces);
						return [];
					}


					return workspaces.map((workspace: any) => ({
						name: `${workspace.name} (ID: ${workspace.id})`,
						value: workspace.id.toString(),
					}));
				} catch (error) {
					console.error('❌ Error loading workspaces:', error);
					return [];
				}
			},

			// Get all tags for dropdown selection
			async getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('emailBisonApi');

				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'emailBisonApi',
						{
							method: 'GET',
							baseURL: `${credentials.serverUrl}/api`,
							url: '/tags',
							qs: {
								limit: 100,
								per_page: 100,
							},
						},
					);

					const tags = response.data || response;

					if (!Array.isArray(tags)) {
						console.error('getTags: Response is not an array:', tags);
						return [];
					}


					return tags.map((tag: any) => ({
						name: `${tag.name} (ID: ${tag.id})`,
						value: tag.id.toString(),
					}));
				} catch (error) {
					console.error('❌ Error loading tags:', error);
					return [];
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'lead') {
					const { executeLeadOperation } = await import('./operations/leads/execute');
					responseData = await executeLeadOperation.call(this, operation, i);
				} else if (resource === 'campaign') {
					const { executeCampaignOperation } = await import('./operations/campaigns/execute');
					responseData = await executeCampaignOperation.call(this, operation, i);
				} else if (resource === 'emailAccount') {
					const { executeEmailAccountOperation } = await import('./operations/emailAccounts/execute');
					responseData = await executeEmailAccountOperation.call(this, operation, i);
				} else if (resource === 'tag') {
					const { executeTagOperation } = await import('./operations/tags/execute');
					responseData = await executeTagOperation.call(this, operation, i);
				} else if (resource === 'workspace') {
					const { executeWorkspaceOperation } = await import('./operations/workspaces/execute');
					responseData = await executeWorkspaceOperation.call(this, operation, i);
				} else if (resource === 'webhook') {
					const { executeWebhookOperation } = await import('./operations/webhooks/execute');
					responseData = await executeWebhookOperation.call(this, operation, i);
				} else if (resource === 'sequenceStep') {
					const { executeSequenceStepOperation } = await import('./operations/sequenceSteps/execute');
					responseData = await executeSequenceStepOperation.call(this, operation, i);
				} else if (resource === 'reply') {
					const { executeReplyOperation } = await import('./operations/replies/execute');
					responseData = await executeReplyOperation.call(this, operation, i);
				} else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData);
				} else {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					returnData.push({ json: { error: errorMessage } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
