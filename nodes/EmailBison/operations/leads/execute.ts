import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

export async function executeLeadOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject | INodeExecutionData[]> {
	const credentials = await this.getCredentials('emailBisonApi');

	if (operation === 'create') {
		// Create lead
		const email = this.getNodeParameter('email', index) as string;
		const firstName = this.getNodeParameter('firstName', index, '') as string;
		const lastName = this.getNodeParameter('lastName', index, '') as string;
		const company = this.getNodeParameter('company', index, '') as string;
		const phone = this.getNodeParameter('phone', index, '') as string;
		const website = this.getNodeParameter('website', index, '') as string;
		const tags = this.getNodeParameter('tags', index, '') as string;
		const customFields = this.getNodeParameter('customFields', index, {}) as IDataObject;

		const body: IDataObject = {
			email,
		};

		if (firstName) body.first_name = firstName;
		if (lastName) body.last_name = lastName;
		if (company) body.company = company;
		if (phone) body.phone = phone;
		if (website) body.website = website;
		if (tags) {
			body.tags = tags.split(',').map((tag: string) => tag.trim());
		}

		// Handle custom fields
		if (customFields && customFields.field) {
			const fields = customFields.field as IDataObject[];
			const customFieldsObj: IDataObject = {};
			fields.forEach((field) => {
				if (field.key && field.value) {
					customFieldsObj[field.key as string] = field.value;
				}
			});
			if (Object.keys(customFieldsObj).length > 0) {
				body.custom_fields = customFieldsObj;
			}
		}

		console.log('🔍 CREATE LEAD - Request body:', JSON.stringify(body, null, 2));

		try {
			const responseData = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'emailBisonApi',
				{
					method: 'POST',
					baseURL: `${credentials.serverUrl}/api`,
					url: '/leads',
					body,
				},
			);

			console.log('✅ CREATE LEAD - Response:', JSON.stringify(responseData, null, 2));
			return [{ json: responseData.data || responseData }];
		} catch (error: any) {
			console.error('❌ CREATE LEAD - Error:', error.message);
			console.error('❌ CREATE LEAD - Error details:', JSON.stringify(error.response?.body || error, null, 2));
			throw error;
		}
	}

	if (operation === 'get') {
		// Get lead by ID
		const leadId = this.getNodeParameter('leadId', index) as string;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'GET',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/leads/${leadId}`,
			},
		);

		return responseData;
	}

	if (operation === 'getMany') {
		// Get multiple leads
		const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
		const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

		const qs: IDataObject = {};

		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50) as number;
			qs.limit = limit;
		}

		// Add filters to query string
		if (filters.email) qs.email = filters.email;
		if (filters.tag) qs.tag = filters.tag;
		if (filters.company) qs.company = filters.company;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'GET',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/leads',
				qs,
			},
		);

		// Extract the leads array from the response
		const leads = responseData.data || responseData;

		// Return in n8n format: array of objects with 'json' property
		return leads.map((lead: IDataObject) => ({ json: lead }));
	}

	if (operation === 'update') {
		// Update lead
		const leadId = this.getNodeParameter('leadId', index) as string;
		const firstName = this.getNodeParameter('firstName', index, '') as string;
		const lastName = this.getNodeParameter('lastName', index, '') as string;
		const company = this.getNodeParameter('company', index, '') as string;
		const phone = this.getNodeParameter('phone', index, '') as string;
		const website = this.getNodeParameter('website', index, '') as string;
		const tags = this.getNodeParameter('tags', index, '') as string;
		const customFields = this.getNodeParameter('customFields', index, {}) as IDataObject;

		const body: IDataObject = {};

		if (firstName) body.first_name = firstName;
		if (lastName) body.last_name = lastName;
		if (company) body.company = company;
		if (phone) body.phone = phone;
		if (website) body.website = website;
		if (tags) {
			body.tags = tags.split(',').map((tag: string) => tag.trim());
		}

		// Handle custom fields
		if (customFields && customFields.field) {
			const fields = customFields.field as IDataObject[];
			const customFieldsObj: IDataObject = {};
			fields.forEach((field) => {
				if (field.key && field.value) {
					customFieldsObj[field.key as string] = field.value;
				}
			});
			if (Object.keys(customFieldsObj).length > 0) {
				body.custom_fields = customFieldsObj;
			}
		}

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'PATCH',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/leads/${leadId}`,
				body,
			},
		);

		return responseData;
	}

	if (operation === 'delete') {
		// Delete lead
		const leadId = this.getNodeParameter('leadId', index) as string;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'DELETE',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/leads/${leadId}`,
			},
		);

		return { success: true, id: leadId };
	}

	if (operation === 'attachTags') {
		// Attach tags to leads
		const leadIds = this.getNodeParameter('leadIds', index) as string;
		const tagIds = this.getNodeParameter('tagIds', index) as string;

		const body: IDataObject = {
			lead_ids: leadIds.split(',').map((id: string) => parseInt(id.trim(), 10)),
			tag_ids: tagIds.split(',').map((id: string) => parseInt(id.trim(), 10)),
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

		return responseData;
	}

	throw new Error(`The operation "${operation}" is not supported for leads!`);
}
