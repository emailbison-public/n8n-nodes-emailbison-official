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
		const tags = this.getNodeParameter('tags', index, []) as string[] | string;
		const customFields = this.getNodeParameter('customFields', index, {}) as IDataObject;

		// Step 1: Create the lead with basic info (tags are NOT supported in create endpoint)
		const body: IDataObject = {
			email,
		};

		if (firstName) body.first_name = firstName;
		if (lastName) body.last_name = lastName;
		if (company) body.company = company;
		if (phone) body.phone = phone;
		if (website) body.website = website;

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

		console.log('🔍 CREATE LEAD - Step 1: Creating lead with body:', JSON.stringify(body, null, 2));

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

			console.log('✅ CREATE LEAD - Step 1: Lead created:', JSON.stringify(responseData, null, 2));

			const leadData = responseData.data || responseData;
			const leadId = leadData.id;

			// Step 2: Attach tags if provided (tags must be attached separately)
			if (tags && tags.length > 0 && leadId) {
				// Convert tags to array of integers
				let tagIds: number[] = [];
				if (Array.isArray(tags)) {
					tagIds = tags.map((tag: string) => parseInt(tag, 10));
				} else {
					tagIds = tags.split(',').map((tag: string) => parseInt(tag.trim(), 10));
				}

				console.log(`🔍 CREATE LEAD - Step 2: Attaching ${tagIds.length} tags to lead ${leadId}:`, tagIds);

				try {
					await this.helpers.httpRequestWithAuthentication.call(
						this,
						'emailBisonApi',
						{
							method: 'POST',
							baseURL: `${credentials.serverUrl}/api`,
							url: '/tags/attach-to-leads',
							body: {
								lead_ids: [leadId],
								tag_ids: tagIds,
							},
						},
					);
					console.log('✅ CREATE LEAD - Step 2: Tags attached successfully');
				} catch (error: any) {
					console.error('❌ CREATE LEAD - Step 2: Failed to attach tags:', error.message);
					// Don't throw - lead was created successfully, just tags failed
					console.warn('⚠️ CREATE LEAD - Lead created but tags were not attached');
				}
			}

			return [{ json: leadData }];
		} catch (error: any) {
			console.error('❌ CREATE LEAD - Step 1: Error creating lead:', error.message);
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
		const search = this.getNodeParameter('search', index, '') as string;
		const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

		const qs: IDataObject = {};

		// NOTE: EmailBison API has a hard limit of 15 leads per page
		// There is NO pagination parameter available in the API
		// The API always returns a maximum of 15 leads
		// Users should use search and filters to narrow down results
		if (!returnAll) {
			const limit = this.getNodeParameter('limit', index, 50) as number;
			qs.limit = limit; // Kept for compatibility, but API ignores this and returns max 15
		}

		// Add search parameter (top-level, not in filters)
		if (search) {
			qs.search = search;
		}

		// Add filter parameters according to API documentation
		// All filters are prefixed with 'filters.' in the query string
		if (filters.lead_campaign_status) {
			qs['filters.lead_campaign_status'] = filters.lead_campaign_status;
		}

		if (filters.verification_statuses && Array.isArray(filters.verification_statuses) && filters.verification_statuses.length > 0) {
			// API expects array format: filters.verification_statuses=value1&filters.verification_statuses=value2
			qs['filters.verification_statuses'] = filters.verification_statuses;
		}

		if (filters.tag_ids) {
			// Convert comma-separated string to array
			const tagIds = (filters.tag_ids as string).split(',').map((id) => id.trim()).filter((id) => id);
			if (tagIds.length > 0) {
				qs['filters.tag_ids'] = tagIds;
			}
		}

		if (filters.excluded_tag_ids) {
			// Convert comma-separated string to array
			const excludedTagIds = (filters.excluded_tag_ids as string).split(',').map((id) => id.trim()).filter((id) => id);
			if (excludedTagIds.length > 0) {
				qs['filters.excluded_tag_ids'] = excludedTagIds;
			}
		}

		if (filters.without_tags === true) {
			qs['filters.without_tags'] = true;
		}

		console.log('🔍 GET MANY LEADS - Query parameters:', JSON.stringify(qs, null, 2));

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

		console.log('📊 GET MANY LEADS - API returned:', {
			leads_count: responseData.data?.length || 0,
			has_meta: !!responseData.meta,
		});

		// Extract the leads array from the response
		const leads = responseData.data || responseData;

		console.log(`✅ GET MANY LEADS - Returning ${leads.length} leads (API max: 15)`);

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
		const tags = this.getNodeParameter('tags', index, []) as string[] | string;
		const customFields = this.getNodeParameter('customFields', index, {}) as IDataObject;

		const body: IDataObject = {};

		if (firstName) body.first_name = firstName;
		if (lastName) body.last_name = lastName;
		if (company) body.company = company;
		if (phone) body.phone = phone;
		if (website) body.website = website;

		// Handle tags - support both array (from dropdown) and string (from expression)
		if (tags && tags.length > 0) {
			if (Array.isArray(tags)) {
				body.tags = tags;
			} else {
				body.tags = tags.split(',').map((tag: string) => tag.trim());
			}
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

	// NOTE: DELETE endpoint does not exist in EmailBison API (as of 2025-10-19)
	// Commented out but kept for future implementation
	// if (operation === 'delete') {
	// 	// Delete lead
	// 	const leadId = this.getNodeParameter('leadId', index) as string;

	// 	const responseData = await this.helpers.httpRequestWithAuthentication.call(
	// 		this,
	// 		'emailBisonApi',
	// 		{
	// 			method: 'DELETE',
	// 			baseURL: `${credentials.serverUrl}/api`,
	// 			url: `/leads/${leadId}`,
	// 		},
	// 	);

	// 	return { success: true, id: leadId };
	// }

	if (operation === 'attachTags') {
		// Attach tags to leads (bulk operation)
		const leadIds = this.getNodeParameter('leadIds', index) as string[];
		const tagIds = this.getNodeParameter('tagIds', index) as string[];
		const skipWebhooks = this.getNodeParameter('skipWebhooks', index, false) as boolean;

		// Validate required fields
		if (!leadIds || leadIds.length === 0) {
			throw new Error('Please select at least one lead to attach tags to');
		}
		if (!tagIds || tagIds.length === 0) {
			throw new Error('Please select at least one tag to attach');
		}

		// Convert string arrays to integer arrays
		const leadIdsArray = leadIds.map((id: string) => parseInt(id, 10));
		const tagIdsArray = tagIds.map((id: string) => parseInt(id, 10));

		const body: IDataObject = {
			lead_ids: leadIdsArray,
			tag_ids: tagIdsArray,
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

		return responseData;
	}

	throw new Error(`The operation "${operation}" is not supported for leads!`);
}
