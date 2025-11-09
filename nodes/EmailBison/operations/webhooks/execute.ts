import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

export async function executeWebhookOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject | INodeExecutionData[]> {
	const credentials = await this.getCredentials('emailBisonApi');

	if (operation === 'create') {
		const url = this.getNodeParameter('url', index) as string;
		const events = this.getNodeParameter('events', index) as string[];
		const name = this.getNodeParameter('name', index, '') as string;
		const secret = this.getNodeParameter('secret', index, '') as string;

		const body: IDataObject = {
			url,
			events,
		};

		if (name) body.name = name;
		if (secret) body.secret = secret;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/webhooks',
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'get') {
		const webhookId = this.getNodeParameter('webhookId', index) as string;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'GET',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/webhooks/${webhookId}`,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	// DISABLED 2025-10-27: Endpoint Does Not Exist - Returns 404
	// See GET_OPERATIONS_TEST_RESULTS.md for details
	// The GET /api/webhooks endpoint does not exist in the EmailBison API.
	// CLI Test: curl "https://send.topoffunnel.com/api/webhooks" returns:
	// {"data":{"success":false,"message":"The route api/webhooks could not be found.","record_not_found":null}}
	// Re-enable when EmailBison API implements this endpoint.
	// if (operation === 'getMany') {
	// 	const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
	// 	const qs: IDataObject = {};

	// 	if (!returnAll) {
	// 		const limit = this.getNodeParameter('limit', index, 50) as number;
	// 		qs.limit = limit;
	// 	}

	// 	const responseData = await this.helpers.httpRequestWithAuthentication.call(
	// 		this,
	// 		'emailBisonApi',
	// 		{
	// 			method: 'GET',
	// 			baseURL: `${credentials.serverUrl}/api`,
	// 			url: '/webhooks',
	// 			qs,
	// 		},
	// 	);

	// 	const webhooks = responseData.data || responseData;
	// 	return webhooks.map((webhook: IDataObject) => ({ json: webhook }));
	// }

	if (operation === 'update') {
		const webhookId = this.getNodeParameter('webhookId', index) as string;
		const events = this.getNodeParameter('events', index, []) as string[];
		const name = this.getNodeParameter('name', index, '') as string;
		const secret = this.getNodeParameter('secret', index, '') as string;

		const body: IDataObject = {};

		if (events.length > 0) body.events = events;
		if (name) body.name = name;
		if (secret) body.secret = secret;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'PUT',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/webhooks/${webhookId}`,
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'delete') {
		const webhookId = this.getNodeParameter('webhookId', index) as string;

		await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'DELETE',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/webhooks/${webhookId}`,
			},
		);

		return [{ json: { success: true, id: webhookId } }];
	}

	throw new Error(`The operation "${operation}" is not supported for webhooks!`);
}
