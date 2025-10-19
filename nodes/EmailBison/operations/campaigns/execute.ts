import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

export async function executeCampaignOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject | INodeExecutionData[]> {
	const credentials = await this.getCredentials('emailBisonApi');

	if (operation === 'create') {
		// Create campaign
		const name = this.getNodeParameter('name', index) as string;
		const subject = this.getNodeParameter('subject', index) as string;
		const emailContent = this.getNodeParameter('emailContent', index) as string;
		const fromEmail = this.getNodeParameter('fromEmail', index) as string;
		const fromName = this.getNodeParameter('fromName', index, '') as string;
		const replyTo = this.getNodeParameter('replyTo', index, '') as string;
		const scheduleType = this.getNodeParameter('scheduleType', index, 'now') as string;
		const scheduledDate = this.getNodeParameter('scheduledDate', index, '') as string;
		const tags = this.getNodeParameter('tags', index, '') as string;

		const body: IDataObject = {
			name,
			subject,
			html_content: emailContent,
			from_email: fromEmail,
		};

		if (fromName) body.from_name = fromName;
		if (replyTo) body.reply_to = replyTo;
		if (scheduleType === 'scheduled' && scheduledDate) {
			body.scheduled_at = scheduledDate;
		}
		if (tags) {
			body.tags = tags.split(',').map((tag: string) => tag.trim());
		}

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/campaigns',
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'get') {
		// Get campaign by ID
		const campaignId = this.getNodeParameter('campaignId', index) as string;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'GET',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/campaigns/${campaignId}`,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'getMany') {
		// Get multiple campaigns
		const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
		const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

		const qs: IDataObject = {};

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50) as number;
			qs.limit = limit;
		}

		// Add filters to query string
		if (filters.status) qs.status = filters.status;
		if (filters.tag) qs.tag = filters.tag;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'GET',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/campaigns',
				qs,
			},
		);

		const campaigns = responseData.data || responseData;
		return campaigns.map((campaign: IDataObject) => ({ json: campaign }));
	}

	if (operation === 'update') {
		// Update campaign
		const campaignId = this.getNodeParameter('campaignId', index) as string;
		const subject = this.getNodeParameter('subject', index, '') as string;
		const emailContent = this.getNodeParameter('emailContent', index, '') as string;
		const fromEmail = this.getNodeParameter('fromEmail', index, '') as string;
		const fromName = this.getNodeParameter('fromName', index, '') as string;
		const replyTo = this.getNodeParameter('replyTo', index, '') as string;
		const scheduleType = this.getNodeParameter('scheduleType', index, 'now') as string;
		const scheduledDate = this.getNodeParameter('scheduledDate', index, '') as string;
		const tags = this.getNodeParameter('tags', index, '') as string;

		const body: IDataObject = {};

		if (subject) body.subject = subject;
		if (emailContent) body.html_content = emailContent;
		if (fromEmail) body.from_email = fromEmail;
		if (fromName) body.from_name = fromName;
		if (replyTo) body.reply_to = replyTo;
		if (scheduleType === 'scheduled' && scheduledDate) {
			body.scheduled_at = scheduledDate;
		}
		if (tags) {
			body.tags = tags.split(',').map((tag: string) => tag.trim());
		}

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'PUT',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/campaigns/${campaignId}`,
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'delete') {
		// Delete campaign
		const campaignId = this.getNodeParameter('campaignId', index) as string;

		await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'DELETE',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/campaigns/${campaignId}`,
			},
		);

		return [{ json: { success: true, id: campaignId } }];
	}

	if (operation === 'start') {
		// Start campaign
		const campaignId = this.getNodeParameter('campaignId', index) as string;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/campaigns/${campaignId}/start`,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'stop') {
		// Stop campaign
		const campaignId = this.getNodeParameter('campaignId', index) as string;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/campaigns/${campaignId}/stop`,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'pause') {
		// Pause campaign
		const campaignId = this.getNodeParameter('campaignId', index) as string;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/campaigns/${campaignId}/pause`,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'addLeads') {
		// Add leads to campaign
		const campaignId = this.getNodeParameter('campaignId', index) as string;
		const leadIds = this.getNodeParameter('leadIds', index) as string;

		const body: IDataObject = {
			lead_ids: leadIds.split(',').map((id: string) => id.trim()),
		};

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/campaigns/${campaignId}/leads`,
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	throw new Error(`The operation "${operation}" is not supported for campaigns!`);
}
