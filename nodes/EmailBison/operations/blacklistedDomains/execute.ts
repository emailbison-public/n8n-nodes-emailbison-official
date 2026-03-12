import { IExecuteFunctions, IDataObject, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

export async function executeBlacklistedDomainOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject | INodeExecutionData[]> {
	const credentials = await this.getCredentials('emailBisonApi');

	if (operation === 'create') {
		// Add domain to blacklist
		const domain = this.getNodeParameter('domain', index) as string;

		if (!domain || domain.trim() === '') {
			throw new NodeOperationError(this.getNode(), 'Please provide a domain to blacklist');
		}

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/blacklisted-domains',
				body: {
					domain: domain.trim(),
				},
			},
		);

		return [{ json: responseData.data || responseData, pairedItem: { item: index } }];
	}

	if (operation === 'delete') {
		// Remove domain from blacklist
		const blacklistedDomainId = this.getNodeParameter('blacklistedDomainId', index) as string;

		if (!blacklistedDomainId || blacklistedDomainId.trim() === '') {
			throw new NodeOperationError(this.getNode(), 'Please provide the blacklisted domain ID to remove');
		}

		await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'DELETE',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/blacklisted-domains/${blacklistedDomainId}`,
			},
		);

		return [{ json: { success: true, deleted: true, id: blacklistedDomainId }, pairedItem: { item: index } }];
	}

	if (operation === 'getMany') {
		// Get all blacklisted domains
		const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
		const qs: IDataObject = {};

		if (returnAll) {
			// Paginate through all pages until an empty page is returned
			const allDomains: IDataObject[] = [];
			let page = 1;

			while (true) {
				const responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'emailBisonApi',
					{
						method: 'GET',
						baseURL: `${credentials.serverUrl}/api`,
						url: '/blacklisted-domains',
						qs: { ...qs, page },
					},
				);

				const pageDomains: IDataObject[] = responseData.data || responseData;
				if (!Array.isArray(pageDomains) || pageDomains.length === 0) break;

				allDomains.push(...pageDomains);

				const lastPage = responseData.meta?.last_page as number | undefined;
				if (lastPage !== undefined && page >= lastPage) break;

				page++;
			}

			return allDomains.map((item: IDataObject) => ({ json: item, pairedItem: { item: index } }));
		} else {
			const limit = this.getNodeParameter('limit', index, 50) as number;
			const collectedDomains: IDataObject[] = [];
			let page = 1;

			while (collectedDomains.length < limit) {
				const responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'emailBisonApi',
					{
						method: 'GET',
						baseURL: `${credentials.serverUrl}/api`,
						url: '/blacklisted-domains',
						qs: { ...qs, page },
					},
				);

				const pageDomains: IDataObject[] = responseData.data || responseData;
				if (!Array.isArray(pageDomains) || pageDomains.length === 0) break;

				collectedDomains.push(...pageDomains);

				const lastPage = responseData.meta?.last_page as number | undefined;
				if (lastPage !== undefined && page >= lastPage) break;

				page++;
			}

			return collectedDomains.slice(0, limit).map((item: IDataObject) => ({ json: item, pairedItem: { item: index } }));
		}
	}

	throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for blacklisted domains!`);
}
