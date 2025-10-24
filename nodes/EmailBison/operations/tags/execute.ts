import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

export async function executeTagOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject | INodeExecutionData[]> {
	const credentials = await this.getCredentials('emailBisonApi');

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const defaultTag = this.getNodeParameter('default', index, false) as boolean;

		const body: IDataObject = { name };
		if (defaultTag !== undefined && defaultTag !== null) {
			body.default = defaultTag;
		}

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/tags',
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'get') {
		const tagId = this.getNodeParameter('tagId', index) as string;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'GET',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/tags/${tagId}`,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
		const qs: IDataObject = {};

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50) as number;
			qs.limit = limit;
		}

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'GET',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/tags',
				qs,
			},
		);

		const tags = responseData.data || responseData;
		return tags.map((tag: IDataObject) => ({ json: tag }));
	}

	if (operation === 'delete') {
		const tagId = this.getNodeParameter('tagId', index) as string;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'DELETE',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/tags/${tagId}`,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'attachToLeads') {
		const tagIds = this.getNodeParameter('tagIds', index) as string[];
		const leadIds = this.getNodeParameter('leadIds', index) as string;
		const skipWebhooks = this.getNodeParameter('skipWebhooks', index, false) as boolean;

		// Parse lead IDs (comma-separated string to array of integers)
		const leadIdsArray = leadIds.split(',').map((id) => parseInt(id.trim(), 10));

		const body: IDataObject = {
			lead_ids: leadIdsArray,
			tag_ids: tagIds.map((id) => parseInt(id, 10)),
		};

		if (skipWebhooks) {
			body.skip_webhooks = true;
		}

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/tags/attach-to-leads',
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'removeFromLeads') {
		const tagIds = this.getNodeParameter('tagIds', index) as string[];
		const leadIds = this.getNodeParameter('leadIds', index) as string;
		const skipWebhooks = this.getNodeParameter('skipWebhooks', index, false) as boolean;

		// Parse lead IDs (comma-separated string to array of integers)
		const leadIdsArray = leadIds.split(',').map((id) => parseInt(id.trim(), 10));

		const body: IDataObject = {
			lead_ids: leadIdsArray,
			tag_ids: tagIds.map((id) => parseInt(id, 10)),
		};

		if (skipWebhooks) {
			body.skip_webhooks = true;
		}

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/tags/remove-from-leads',
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'attachToCampaigns') {
		const tagIds = this.getNodeParameter('tagIds', index) as string[];
		const campaignIds = this.getNodeParameter('campaignIds', index) as string;
		const skipWebhooks = this.getNodeParameter('skipWebhooks', index, false) as boolean;

		// Parse campaign IDs (comma-separated string to array of integers)
		const campaignIdsArray = campaignIds.split(',').map((id) => parseInt(id.trim(), 10));

		const body: IDataObject = {
			campaign_ids: campaignIdsArray,
			tag_ids: tagIds.map((id) => parseInt(id, 10)),
		};

		if (skipWebhooks) {
			body.skip_webhooks = true;
		}

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/tags/attach-to-campaigns',
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'removeFromCampaigns') {
		const tagIds = this.getNodeParameter('tagIds', index) as string[];
		const campaignIds = this.getNodeParameter('campaignIds', index) as string;
		const skipWebhooks = this.getNodeParameter('skipWebhooks', index, false) as boolean;

		// Parse campaign IDs (comma-separated string to array of integers)
		const campaignIdsArray = campaignIds.split(',').map((id) => parseInt(id.trim(), 10));

		const body: IDataObject = {
			campaign_ids: campaignIdsArray,
			tag_ids: tagIds.map((id) => parseInt(id, 10)),
		};

		if (skipWebhooks) {
			body.skip_webhooks = true;
		}

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/tags/remove-from-campaigns',
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'attachToEmailAccounts') {
		const tagIds = this.getNodeParameter('tagIds', index) as string[];
		const emailAccountIds = this.getNodeParameter('emailAccountIds', index) as string;
		const skipWebhooks = this.getNodeParameter('skipWebhooks', index, false) as boolean;

		// Parse email account IDs (comma-separated string to array of integers)
		const emailAccountIdsArray = emailAccountIds.split(',').map((id) => parseInt(id.trim(), 10));

		const body: IDataObject = {
			sender_email_ids: emailAccountIdsArray,
			tag_ids: tagIds.map((id) => parseInt(id, 10)),
		};

		if (skipWebhooks) {
			body.skip_webhooks = true;
		}

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/tags/attach-to-sender-emails',
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'removeFromEmailAccounts') {
		const tagIds = this.getNodeParameter('tagIds', index) as string[];
		const emailAccountIds = this.getNodeParameter('emailAccountIds', index) as string;
		const skipWebhooks = this.getNodeParameter('skipWebhooks', index, false) as boolean;

		// Parse email account IDs (comma-separated string to array of integers)
		const emailAccountIdsArray = emailAccountIds.split(',').map((id) => parseInt(id.trim(), 10));

		const body: IDataObject = {
			sender_email_ids: emailAccountIdsArray,
			tag_ids: tagIds.map((id) => parseInt(id, 10)),
		};

		if (skipWebhooks) {
			body.skip_webhooks = true;
		}

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/tags/remove-from-sender-emails',
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	throw new Error(`The operation "${operation}" is not supported for tags!`);
}
