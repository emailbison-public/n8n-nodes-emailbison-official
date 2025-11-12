# n8n-nodes-emailbison

This is an n8n community node for EmailBison, a white-labeled email marketing platform. It allows you to integrate EmailBison's email marketing capabilities into your n8n workflows.

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

## Features

- **Dynamic Server URL Support**: Works with any EmailBison white-label instance by allowing custom server URL configuration
- **Comprehensive API Coverage**: Supports all major EmailBison resources including:
  - **Leads**: Create, read, update, and manage email contacts with custom fields and tags
  - **Campaigns**: Create and manage email campaigns, start/stop campaigns, add leads
  - **Email Accounts**: Configure and manage SMTP sender accounts
  - **Tags**: Organize leads with tags
  - **Replies**: Send one-off emails and track email replies with advanced filtering
  - **Sequence Steps**: Manage campaign email sequences

## Installation

To install this community node in n8n:

### Option 1: Install via n8n Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes** in your n8n instance
2. Click **Install a community node**
3. Enter `n8n-nodes-emailbison`
4. Click **Install**

### Option 2: Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-emailbison

# Restart n8n
```

### Option 3: Docker

Add the package to your n8n Docker setup:

```dockerfile
FROM n8nio/n8n
USER root
RUN npm install -g n8n-nodes-emailbison
USER node
```

## Configuration

### 1. Set up Credentials

1. In n8n, go to **Credentials** and create new **EmailBison API** credentials
2. Configure the following:
   - **Server URL**: Your EmailBison instance URL (e.g., `https://send.youragency.com`)
   - **API Token**: Your EmailBison API token

### 2. Get Your API Token

1. Log into your EmailBison instance
2. Go to **Settings** > **API**
3. Generate or copy your API token

### 3. Find Your Server URL

Your server URL is the base URL of your EmailBison instance, typically in the format:
- `https://send.youragency.com`
- `https://send.topoffunnel.com`
- `https://yourdomain.com`

**Important**: Enter the URL without the `/api` suffix - the node will automatically append this.

## Usage

### Basic Workflow Examples

#### Create a Lead
```
1. Add EmailBison node to your workflow
2. Select Resource: "Lead"
3. Select Operation: "Create"
4. Fill in the email address and other lead details
5. Execute the workflow
```

#### Send a Campaign
```
1. Create leads (using Lead > Create operation)
2. Create a campaign (using Campaign > Create operation)
3. Add leads to campaign (using Campaign > Add Leads operation)
4. Start the campaign (using Campaign > Start operation)
```

#### Track Email Replies
```
1. Use Reply > Get Many operation
2. Add filters (campaign_id, lead_id, status)
3. Process replies in your workflow
4. Optionally mark as interested or push to follow-up campaigns
```

## Supported Operations

### Leads
- **Create**: Add new leads with email, name, company, and custom fields
- **Get**: Retrieve a specific lead by ID (with dropdown selector)
- **Get Many**: List multiple leads (max 15 items due to API pagination)
- **Update**: Modify lead information (first_name, last_name, company, phone, email, custom_fields)

### Campaigns
- **Create**: Create new email campaigns with name and sender emails
- **Get**: Retrieve campaign details (with dropdown selector)
- **Get Many**: List all campaigns
- **Update**: Modify campaign name and sender emails
- **Add Leads**: Bulk add leads to campaigns (processes all input items)
- **Start/Resume**: Launch or resume paused campaigns
- **Stop/Pause**: Pause running campaigns

### Email Accounts
- **Create**: Set up new SMTP sender accounts with full configuration
- **Get**: Retrieve account details (with dropdown selector)
- **Get Many**: List all email accounts
- **Update**: Modify account settings (name, daily_limit, etc.)
- **Delete**: Remove email accounts

### Tags
- **Create**: Create new tags for lead organization
- **Get Many**: List all tags (used in dropdowns throughout the node)
- **Delete**: Remove tags

### Replies
- **Compose New Email**: Send one-off emails outside of campaigns
  - Supports: to_emails, cc_emails, bcc_emails, subject, message, content_type
  - No lead_id required
- **Get Many**: Retrieve email replies with advanced filtering
  - Filter by: campaign_id, lead_id, status (unread/read/interested/not_interested)
  - Returns full reply metadata including timestamps, sender/recipient info

### Sequence Steps
- **Delete**: Remove steps from campaign sequences

## Advanced Features

### Custom Fields
The node supports EmailBison's custom fields for leads. You can add custom key-value pairs when creating or updating leads.

### Filtering and Pagination
Most "Get Many" operations support:
- **Filtering**: Filter results by various criteria (campaign_id, lead_id, status, etc.)
- **Pagination**: Note that Get Many Leads returns maximum 15 items due to API limitation
- **Return All**: Option available for operations that support pagination

### Error Handling
The node includes comprehensive error handling:
- Connection validation during credential setup
- Detailed error messages for troubleshooting
- Support for n8n's "Continue on Fail" option

## Troubleshooting

### Common Issues

**"Invalid credentials or server URL"**
- Verify your API token is correct
- Ensure the server URL is correct and accessible
- Check that the URL doesn't include `/api` at the end

**"Connection timeout"**
- Verify your EmailBison instance is accessible
- Check firewall settings if using a self-hosted instance

**"Operation not supported"**
- Ensure you're using the latest version of the node
- Check that your EmailBison instance supports the API endpoint

### Known Limitations

1. **Pagination**: Get Many Leads returns maximum 15 items (API limitation)
2. **Get Tag (Single)**: Returns 403 Forbidden (API authorization bug)
3. **Delete Campaign**: Not supported by EmailBison API
4. **Update Lead Response**: API doesn't return all updated fields (phone, email, custom_fields)
5. **Compose Email Arrays**: Must use empty arrays `[]` instead of `null` for optional fields

### Getting Help

1. Open an issue on the [GitHub repository](https://github.com/emailbison-public/n8n-nodes-emailbison-official)
2. Verify your credentials and server URL
3. Test the connection using the credential test feature
4. Check n8n logs for detailed error messages

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/emailbison-public/n8n-nodes-emailbison-official.git
cd n8n-nodes-emailbison-official

# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run linting
pnpm run lint
```

### Testing

The node includes credential testing to verify your API connection. When setting up credentials, n8n will automatically test the connection to your EmailBison instance.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

### Planned for v1.1.0
- **Send Test Email** - Test sequence steps before launching campaigns
- **Webhooks** - Real-time automation triggers (Create, Get, Get Many, Update, Delete)
- **Attach Tags to Lead** - Bulk tag operations
- **Update Tag** - Rename tags

See [CHANGELOG.md](CHANGELOG.md) for full version history.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support with this n8n community node:
1. Check the troubleshooting section above
2. Check the [Known Limitations](#known-limitations) section
3. Open an issue on the [GitHub repository](https://github.com/emailbison-public/n8n-nodes-emailbison-official)

For EmailBison platform support, contact your EmailBison provider directly.

## Version

Current version: **1.0.0**
