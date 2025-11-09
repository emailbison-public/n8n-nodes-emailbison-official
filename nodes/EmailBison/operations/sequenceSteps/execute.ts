import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

export async function executeSequenceStepOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject | INodeExecutionData[]> {
	const credentials = await this.getCredentials('emailBisonApi');

	// DISABLED 2025-10-27: Endpoint Issue - Returns "Record not found"
	// See GET_OPERATIONS_TEST_RESULTS.md for details
	// The GET /api/campaigns/sequence-steps endpoint returns:
	// {"data":{"success":false,"message":"Record not found.","record_not_found":{"campaign":"sequence-steps"}}}
	// Even when tested with valid campaign IDs (e.g., campaign_id=4).
	// This appears to be an API routing bug or the endpoint structure is different.
	// CLI Test: curl "https://send.topoffunnel.com/api/campaigns/sequence-steps?campaign_id=4"
	// Re-enable when EmailBison API clarifies the correct endpoint.
	// if (operation === 'getMany') {
	// 	// Get multiple sequence steps
	// 	const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
	// 	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

	// 	const qs: IDataObject = {};

	// 	if (!returnAll) {
	// 		const limit = this.getNodeParameter('limit', index, 50) as number;
	// 		qs.limit = limit;
	// 	}

	// 	// Add filters to query string
	// 	if (filters.campaignId) qs.campaign_id = filters.campaignId;

	// 	const responseData = await this.helpers.httpRequestWithAuthentication.call(
	// 		this,
	// 		'emailBisonApi',
	// 		{
	// 			method: 'GET',
	// 			baseURL: `${credentials.serverUrl}/api`,
	// 			url: '/campaigns/sequence-steps',
	// 			qs,
	// 		},
	// 	);

	// 	const sequenceSteps = responseData.data || responseData;
	// 	return sequenceSteps.map((step: IDataObject) => ({ json: step }));
	// }

	if (operation === 'sendTest') {
		// Send test email from sequence step
		const sequenceStepId = this.getNodeParameter('sequenceStepId', index) as string;
		const senderEmailId = this.getNodeParameter('senderEmailId', index) as string;
		const toEmail = this.getNodeParameter('toEmail', index) as string;
		const useDedicatedIps = this.getNodeParameter('useDedicatedIps', index, false) as boolean;

		const body: IDataObject = {
			sender_email_id: senderEmailId,
			to_email: toEmail,
			use_dedicated_ips: useDedicatedIps,
		};

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/campaigns/sequence-steps/${sequenceStepId}/send-test`,
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'delete') {
		// Delete sequence step
		const sequenceStepId = this.getNodeParameter('sequenceStepId', index) as string;

		await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'DELETE',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/campaigns/sequence-steps/${sequenceStepId}`,
			},
		);

		return [{ json: { success: true, id: sequenceStepId } }];
	}

	throw new Error(`Unknown operation: ${operation}`);
}
