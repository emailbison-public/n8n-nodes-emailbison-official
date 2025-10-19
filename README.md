# n8n-nodes-emailbison

This is an n8n community node for EmailBison, a white-labeled email marketing platform. It allows you to integrate EmailBison's email marketing capabilities into your n8n workflows.

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

## Features

- **Dynamic Server URL Support**: Works with any EmailBison white-label instance by allowing custom server URL configuration
- **Comprehensive API Coverage**: Supports all major EmailBison resources including:
  - **Leads**: Create, read, update, delete, and manage email contacts
  - **Campaigns**: Create and manage email campaigns, start/stop campaigns, add leads
  - **Email Accounts**: Configure and manage SMTP sender accounts
  - **Tags**: Organize leads and campaigns with tags
  - **Master Inbox**: Manage email replies and conversations
  - **Workspaces**: Handle workspace/team management
  - **Webhooks**: Set up event notifications for email activities

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

#### Set up Webhook Notifications
```
1. Use Webhook > Create operation
2. Enter your webhook URL
3. Select events to monitor (email sent, delivered, opened, etc.)
4. The webhook will receive real-time notifications
```

## Supported Operations

### Leads
- **Create**: Add new leads to your database
- **Get**: Retrieve a specific lead by ID
- **Get Many**: List multiple leads with filtering options
- **Update**: Modify existing lead information
- **Delete**: Remove leads from your database

### Campaigns
- **Create**: Create new email campaigns
- **Get**: Retrieve campaign details
- **Get Many**: List campaigns with filtering
- **Update**: Modify campaign settings
- **Delete**: Remove campaigns
- **Start**: Launch a campaign
- **Stop**: Pause a running campaign
- **Add Leads**: Add leads to an existing campaign

### Email Accounts
- **Create**: Set up new SMTP sender accounts
- **Get**: Retrieve account details
- **Get Many**: List all email accounts
- **Update**: Modify account settings
- **Delete**: Remove email accounts

### Tags
- **Create**: Create new tags for organization
- **Get**: Retrieve tag information
- **Get Many**: List all tags
- **Update**: Modify tag properties
- **Delete**: Remove tags

### Master Inbox
- **Get Messages**: Retrieve email replies and conversations
- **Reply**: Send replies to received emails
- **Mark as Read**: Update message status

### Workspaces
- **Get**: Retrieve workspace information
- **Get Many**: List workspaces
- **Update**: Modify workspace settings

### Webhooks
- **Create**: Set up webhook endpoints
- **Get**: Retrieve webhook details
- **Get Many**: List all webhooks
- **Update**: Modify webhook settings
- **Delete**: Remove webhooks

## Advanced Features

### Custom Fields
The node supports EmailBison's custom fields for leads. You can add custom key-value pairs when creating or updating leads.

### Filtering and Pagination
Most "Get Many" operations support:
- **Filtering**: Filter results by various criteria (email, tags, company, etc.)
- **Pagination**: Control the number of results returned
- **Return All**: Option to retrieve all results without pagination

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

### Getting Help

1. Check the [EmailBison API documentation](https://docs.emailbison.com)
2. Verify your credentials and server URL
3. Test the connection using the credential test feature
4. Check n8n logs for detailed error messages

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/n8n-nodes-emailbison.git
cd n8n-nodes-emailbison

# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint
```

### Testing

The node includes credential testing to verify your API connection. When setting up credentials, n8n will automatically test the connection to your EmailBison instance.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support with this n8n community node:
1. Check the troubleshooting section above
2. Review the EmailBison API documentation
3. Open an issue on the GitHub repository

For EmailBison platform support, contact your EmailBison provider directly.
