import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

export async function executeEmailAccountOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject | INodeExecutionData[]> {
	const credentials = await this.getCredentials('emailBisonApi');

	if (operation === 'create') {
		// Create email account
		const email = this.getNodeParameter('email', index) as string;
		const name = this.getNodeParameter('name', index) as string;
		const smtpHost = this.getNodeParameter('smtpHost', index) as string;
		const smtpPort = this.getNodeParameter('smtpPort', index) as number;
		const smtpUsername = this.getNodeParameter('smtpUsername', index) as string;
		const smtpPassword = this.getNodeParameter('smtpPassword', index) as string;
		const smtpSecurity = this.getNodeParameter('smtpSecurity', index, 'tls') as string;
		const dailySendLimit = this.getNodeParameter('dailySendLimit', index, 500) as number;

		const body: IDataObject = {
			email,
			name,
			smtp_host: smtpHost,
			smtp_port: smtpPort,
			smtp_username: smtpUsername,
			smtp_password: smtpPassword,
			smtp_security: smtpSecurity,
			daily_send_limit: dailySendLimit,
		};

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'POST',
				baseURL: `${credentials.serverUrl}/api`,
				url: '/sender-emails',
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'get') {
		// Get email account by ID
		const emailAccountId = this.getNodeParameter('emailAccountId', index) as string;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'GET',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/sender-emails/${emailAccountId}`,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'getMany') {
		// Get multiple email accounts
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
				url: '/sender-emails',
				qs,
			},
		);

		const emailAccounts = responseData.data || responseData;
		return emailAccounts.map((account: IDataObject) => ({ json: account }));
	}

	if (operation === 'update') {
		// Update email account
		const emailAccountId = this.getNodeParameter('emailAccountId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

		const body: IDataObject = {};

		// Map updateFields to API request body (camelCase to snake_case)
		if (updateFields.name) body.name = updateFields.name;
		if (updateFields.smtpHost) body.smtp_host = updateFields.smtpHost;
		if (updateFields.smtpPort) body.smtp_port = updateFields.smtpPort;
		if (updateFields.smtpUsername) body.smtp_username = updateFields.smtpUsername;
		if (updateFields.smtpPassword) body.smtp_password = updateFields.smtpPassword;
		if (updateFields.smtpSecurity) body.smtp_security = updateFields.smtpSecurity;
		if (updateFields.dailySendLimit) body.daily_send_limit = updateFields.dailySendLimit;

		const responseData = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'PATCH',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/sender-emails/${emailAccountId}`,
				body,
			},
		);

		return [{ json: responseData.data || responseData }];
	}

	if (operation === 'delete') {
		// Delete email account
		const emailAccountId = this.getNodeParameter('emailAccountId', index) as string;

		await this.helpers.httpRequestWithAuthentication.call(
			this,
			'emailBisonApi',
			{
				method: 'DELETE',
				baseURL: `${credentials.serverUrl}/api`,
				url: `/sender-emails/${emailAccountId}`,
			},
		);

		return [{ json: { success: true, id: emailAccountId } }];
	}

	throw new Error(`The operation "${operation}" is not supported for email accounts!`);
}
