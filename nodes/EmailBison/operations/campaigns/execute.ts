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
		const fromName = this.getNodeParameter('fromName', index, '') as string;
		const replyTo = this.getNodeParameter('replyTo', index, '') as string;
		const scheduleType = this.getNodeParameter('scheduleType', index, 'now') as string;
		const scheduledDate = this.getNodeParameter('scheduledDate', index, '') as string;

		// Validate required fields
		if (!name || name.trim() === '') {
			throw new Error('Please provide a campaign name');
		}
		if (!subject || subject.trim() === '') {
			throw new Error('Please provide an email subject');
		}
		if (!emailContent || emailContent.trim() === '') {
			throw new Error('Please provide email content');
		}

		// Handle sender emails as array (multiOptions) or string (for backward compatibility)
		const senderEmailsParam = this.getNodeParameter('senderEmails', index, []) as string[] | string;
		let senderEmails: string[] = [];

		if (Array.isArray(senderEmailsParam)) {
			// New multiOptions format - array of sender email IDs
			senderEmails = senderEmailsParam;
		} else if (typeof senderEmailsParam === 'string' && senderEmailsParam.trim() !== '') {
			// Backward compatibility - comma-separated string
			senderEmails = senderEmailsParam.split(',').map((id: string) => id.trim());
		}

		// Validate sender emails
		if (senderEmails.length === 0) {
			throw new Error('Please select at least one sender email account');
		}

		// Handle tags as array (multiOptions) or string (for backward compatibility)
		const tagsParam = this.getNodeParameter('tags', index, []) as string[] | string;
		let tags: string[] = [];

		if (Array.isArray(tagsParam)) {
			// New multiOptions format - array of tag IDs
			tags = tagsParam;
		} else if (typeof tagsParam === 'string' && tagsParam.trim() !== '') {
			// Backward compatibility - comma-separated string
			tags = tagsParam.split(',').map((tag: string) => tag.trim());
		}

		const body: IDataObject = {
			name,
		};

		if (fromName) body.from_name = fromName;
		if (replyTo) body.reply_to = replyTo;
		if (scheduleType === 'scheduled' && scheduledDate) {
			body.scheduled_at = scheduledDate;
		}
		if (tags.length > 0) {
			body.tags = tags;
		}

		// Step 1: Create the campaign
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

		const campaign = responseData.data || responseData;
		const campaignId = campaign.id;

		// Step 2: Attach sender emails to the campaign (if any were provided)
		if (senderEmails.length > 0 && campaignId) {
			try {
				await this.helpers.httpRequestWithAuthentication.call(
					this,
					'emailBisonApi',
					{
						method: 'POST',
						baseURL: `${credentials.serverUrl}/api`,
						url: `/campaigns/${campaignId}/attach-sender-emails`,
						body: {
							sender_email_ids: senderEmails,
						},
					},
				);
				console.log(`✅ Attached ${senderEmails.length} sender email(s) to campaign ${campaignId}`);
			} catch (error) {
				console.error(`❌ Failed to attach sender emails to campaign ${campaignId}:`, error);
				// Don't throw - campaign was created successfully, just log the error
				// The user can manually attach sender emails in the EmailBison UI
			}
		}

		// Step 3: Create the first sequence step with subject and email content
		if (campaignId && subject && emailContent) {
			try {
				const sequenceStepBody = {
					title: `${name} sequence`,
					sequence_steps: [
						{
							email_subject: subject,
							email_body: emailContent,
							order: 1,
							wait_in_days: 1,
							variant: false,
							thread_reply: false,
						},
					],
				};

				await this.helpers.httpRequestWithAuthentication.call(
					this,
					'emailBisonApi',
					{
						method: 'POST',
						baseURL: `${credentials.serverUrl}/api`,
						url: `/campaigns/v1.1/${campaignId}/sequence-steps`,
						body: sequenceStepBody,
					},
				);
				console.log(`✅ Created sequence step for campaign ${campaignId}`);
			} catch (error) {
				console.error(`❌ Failed to create sequence step for campaign ${campaignId}:`, error);
				// Don't throw - campaign was created successfully, just log the error
			}
		}

		return [{ json: campaign }];
	}

	if (operation === 'get') {
		// Get campaign by ID
		const campaignId = this.getNodeParameter('campaignId', index) as string;

		// Validate required field
		if (!campaignId || campaignId.trim() === '') {
			throw new Error('Please select a campaign');
		}

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

		// Validate required field
		if (!campaignId || campaignId.trim() === '') {
			throw new Error('Please select a campaign to update');
		}

		const subject = this.getNodeParameter('subject', index, '') as string;
		const emailContent = this.getNodeParameter('emailContent', index, '') as string;
		const fromName = this.getNodeParameter('fromName', index, '') as string;
		const replyTo = this.getNodeParameter('replyTo', index, '') as string;
		const scheduleType = this.getNodeParameter('scheduleType', index, 'now') as string;
		const scheduledDate = this.getNodeParameter('scheduledDate', index, '') as string;

		// Handle sender emails as array (multiOptions) or string (for backward compatibility)
		const senderEmailsParam = this.getNodeParameter('senderEmails', index, []) as string[] | string;
		let senderEmails: string[] = [];

		if (Array.isArray(senderEmailsParam)) {
			// New multiOptions format - array of sender email IDs
			senderEmails = senderEmailsParam;
		} else if (typeof senderEmailsParam === 'string' && senderEmailsParam.trim() !== '') {
			// Backward compatibility - comma-separated string
			senderEmails = senderEmailsParam.split(',').map((id: string) => id.trim());
		}

		// Handle tags as array (multiOptions) or string (for backward compatibility)
		const tagsParam = this.getNodeParameter('tags', index, []) as string[] | string;
		let tags: string[] = [];

		if (Array.isArray(tagsParam)) {
			// New multiOptions format - array of tag IDs
			tags = tagsParam;
		} else if (typeof tagsParam === 'string' && tagsParam.trim() !== '') {
			// Backward compatibility - comma-separated string
			tags = tagsParam.split(',').map((tag: string) => tag.trim());
		}

		const body: IDataObject = {};

		if (subject) body.subject = subject;
		if (emailContent) body.html_content = emailContent;
		if (fromName) body.from_name = fromName;
		if (replyTo) body.reply_to = replyTo;
		if (scheduleType === 'scheduled' && scheduledDate) {
			body.scheduled_at = scheduledDate;
		}
		if (tags.length > 0) {
			body.tags = tags;
		}

		// Step 1: Update the campaign
		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'PATCH',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/campaigns/${campaignId}`,
				body,
			},
		);

		// Step 2: Attach sender emails to the campaign (if any were provided)
		if (senderEmails.length > 0) {
			try {
				await this.helpers.httpRequestWithAuthentication.call(
					this,
					'emailBisonApi',
					{
						method: 'POST',
						baseURL: `${credentials.serverUrl}/api`,
						url: `/campaigns/${campaignId}/attach-sender-emails`,
						body: {
							sender_email_ids: senderEmails,
						},
					},
				);
				console.log(`✅ Attached ${senderEmails.length} sender email(s) to campaign ${campaignId}`);
			} catch (error) {
				console.error(`❌ Failed to attach sender emails to campaign ${campaignId}:`, error);
				// Don't throw - campaign was updated successfully, just log the error
			}
		}

		return [{ json: responseData.data || responseData }];
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

	if (operation === 'addSequenceStep') {
		// Add a sequence step to an existing campaign
		const campaignId = this.getNodeParameter('campaignId', index) as string;
		const emailSubject = this.getNodeParameter('emailSubject', index) as string;
		const emailBody = this.getNodeParameter('emailBody', index) as string;
		const stepOrder = this.getNodeParameter('stepOrder', index) as number;
		const waitDays = this.getNodeParameter('waitDays', index) as number;

		const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		const sequenceTitle = additionalFields.sequenceTitle as string || '';
		const variant = additionalFields.variant as boolean || false;
		const threadReply = additionalFields.threadReply as boolean || false;

		// Get campaign name for default sequence title if not provided
		let title = sequenceTitle;
		if (!title) {
			try {
				const campaignData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'emailBisonApi',
					{
						method: 'GET',
						baseURL: `${credentials.serverUrl}/api`,
						url: `/campaigns/${campaignId}`,
					},
				);
				const campaign = campaignData.data || campaignData;
				title = `${campaign.name} sequence`;
			} catch (error) {
				// If we can't get the campaign name, use a generic title
				title = 'Campaign sequence';
			}
		}

		const body = {
			title,
			sequence_steps: [
				{
					email_subject: emailSubject,
					email_body: emailBody,
					order: stepOrder,
					wait_in_days: waitDays,
					variant,
					thread_reply: threadReply,
				},
			],
		};

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/campaigns/v1.1/${campaignId}/sequence-steps`,
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	throw new Error(`The operation "${operation}" is not supported for campaigns!`);
}
