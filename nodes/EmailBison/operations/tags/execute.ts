import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

export async function executeTagOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject | INodeExecutionData[]> {
	const credentials = await this.getCredentials('emailBisonApi');

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const color = this.getNodeParameter('color', index, '#007bff') as string;
		const description = this.getNodeParameter('description', index, '') as string;

		const body: IDataObject = { name };
		if (color) body.color = color;
		if (description) body.description = description;

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

	if (operation === 'update') {
		const tagId = this.getNodeParameter('tagId', index) as string;
		const color = this.getNodeParameter('color', index, '') as string;
		const description = this.getNodeParameter('description', index, '') as string;

		const body: IDataObject = {};
		if (color) body.color = color;
		if (description) body.description = description;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'PUT',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/tags/${tagId}`,
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'delete') {
		const tagId = this.getNodeParameter('tagId', index) as string;

		await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'DELETE',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/tags/${tagId}`,
			},
		);

		return [{ json: { success: true, id: tagId } }];
	}

	if (operation === 'attachToLeads') {
		// Attach tags to leads
		const tagIds = this.getNodeParameter('tagIds', index) as string;
		const leadIds = this.getNodeParameter('leadIds', index) as string;

		const body: IDataObject = {
			tag_ids: tagIds.split(',').map((id: string) => parseInt(id.trim(), 10)),
			lead_ids: leadIds.split(',').map((id: string) => parseInt(id.trim(), 10)),
		};

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

	throw new Error(`The operation "${operation}" is not supported for tags!`);
}
