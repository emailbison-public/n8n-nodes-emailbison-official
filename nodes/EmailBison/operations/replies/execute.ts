import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

export async function executeReplyOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject | INodeExecutionData[]> {
	const credentials = await this.getCredentials('emailBisonApi');

	if (operation === 'compose') {
		// Compose and send a new email
		const senderEmailId = this.getNodeParameter('senderEmailId', index) as string;
		const toEmails = this.getNodeParameter('toEmails', index) as IDataObject;
		const subject = this.getNodeParameter('subject', index, '') as string;
		const message = this.getNodeParameter('message', index, '') as string;
		const contentType = this.getNodeParameter('contentType', index, 'html') as string;
		const ccEmails = this.getNodeParameter('ccEmails', index, { values: [] }) as IDataObject;
		const bccEmails = this.getNodeParameter('bccEmails', index, { values: [] }) as IDataObject;
		const useDedicatedIps = this.getNodeParameter('useDedicatedIps', index, false) as boolean;

		// Format to_emails
		const toEmailsList = (toEmails.values as IDataObject[]).map((email: IDataObject) => ({
			name: email.name || '',
			email_address: email.emailAddress,
		}));

		// Format cc_emails
		const ccEmailsList = (ccEmails.values as IDataObject[])?.length
			? (ccEmails.values as IDataObject[]).map((email: IDataObject) => ({
					name: email.name || '',
					email_address: email.emailAddress,
				}))
			: null;

		// Format bcc_emails
		const bccEmailsList = (bccEmails.values as IDataObject[])?.length
			? (bccEmails.values as IDataObject[]).map((email: IDataObject) => ({
					name: email.name || '',
					email_address: email.emailAddress,
				}))
			: null;

		const body: IDataObject = {
			sender_email_id: parseInt(senderEmailId, 10),
			to_emails: toEmailsList,
			subject: subject || null,
			message,
			content_type: contentType,
			cc_emails: ccEmailsList,
			bcc_emails: bccEmailsList,
			use_dedicated_ips: useDedicatedIps,
		};

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/replies/new',
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'getMany') {
		// Get multiple replies
		const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
		const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

		const qs: IDataObject = {};

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50) as number;
			qs.limit = limit;
		}

		// Add filters to query string
		if (filters.campaignId) qs.campaign_id = filters.campaignId;
		if (filters.leadId) qs.lead_id = filters.leadId;
		if (filters.status) qs.status = filters.status;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'GET',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/replies',
				qs,
			},
		);

		const replies = responseData.data || responseData;
		return replies.map((reply: IDataObject) => ({ json: reply }));
	}

	if (operation === 'markInterested') {
		// Mark reply as interested
		const replyId = this.getNodeParameter('replyId', index) as string;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'PATCH',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/replies/${replyId}/mark-as-interested`,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'pushToFollowup') {
		// Push reply to follow-up campaign
		const replyId = this.getNodeParameter('replyId', index) as string;
		const campaignId = this.getNodeParameter('campaignId', index) as string;
		const forceAddReply = this.getNodeParameter('forceAddReply', index, false) as boolean;

		const body: IDataObject = {
			campaign_id: campaignId,
			force_add_reply: forceAddReply,
		};

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/replies/${replyId}/followup-campaign/push`,
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	throw new Error(`Unknown operation: ${operation}`);
}
