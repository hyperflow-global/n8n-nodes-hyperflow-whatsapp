# n8n-nodes-hyperflow-whatsapp

n8n community node for Hyperflow WhatsApp API integration.

## Installation

### In n8n Desktop App

1. Go to **Settings** > **Community Nodes**
2. Select **Install a community node**
3. Enter `@hyperflow-global/n8n-nodes-hyperflow-whatsapp`
4. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation folder
cd ~/.n8n

# Install the package
npm install @hyperflow-global/n8n-nodes-hyperflow-whatsapp
```

### Development Installation (Local)

```bash
# Build the project
npm install
npm run build

# Link to n8n
npm link

# In your n8n installation
cd ~/.n8n
npm link @hyperflow-global/n8n-nodes-hyperflow-whatsapp
```

## Configuration

### Credentials: Hyperflow WhatsApp Account

1. In n8n, go to **Credentials** > **Add Credential**
2. Search for "Hyperflow WhatsApp Account"
3. Configure:
   - **API Key**: Your API key for authentication

## Available Nodes

### Hyperflow WhatsApp Trigger

Webhook trigger that starts workflows when WhatsApp events occur.

#### Supported Events

| Event | Description |
|-------|-------------|
| **Message Received** | Triggered when a message is received |
| **Message Status Update** | Triggered when message status changes (sent, delivered, read) |
| **Button Click** | Triggered when a button is clicked |
| **List Selection** | Triggered when a list item is selected |
| **Flow Response** | Triggered when a flow response is received |

#### Options

- **Filter Numbers**: Only trigger for specific phone numbers
- **Ignore Own Status**: Ignore status updates for messages sent by this number

#### Webhook URL

After activating the workflow, copy the webhook URL provided by n8n and configure it in your Hyperflow API settings.

---

### Hyperflow WhatsApp

Send WhatsApp messages through Hyperflow API. Supports multiple message types:

#### Message Types

| Type | Description |
|------|-------------|
| **Text** | Simple text message with optional buttons (postback, URL, voice call) |
| **Image** | Send an image with optional caption |
| **Video** | Send a video with optional caption |
| **Audio** | Send an audio file |
| **File** | Send a document (PDF, etc.) |
| **Sticker** | Send a WhatsApp sticker |
| **Location** | Send a location with coordinates |
| **Contact** | Send a contact card (vCard) |
| **List** | Interactive list with sections |
| **Template (HSM)** | Send approved message templates |
| **Flows** | Interactive WhatsApp Flows |
| **Generic Card** | Card with image, title, subtitle and buttons |
| **Product** | Single product from catalog |
| **Product List** | Multiple products from catalog |

## Usage Examples

### Send Text Message

```json
{
  "to": "5511999999999",
  "type": "text",
  "payload": {
    "text": "Hello! How can I help you?"
  }
}
```

### Send Text with Buttons

```json
{
  "to": "5511999999999",
  "type": "text",
  "payload": {
    "text": "Choose an option:",
    "footer": "Optional footer",
    "buttons": [
      {
        "type": "postback",
        "id": "btn1",
        "label": "Option 1",
        "data": { "action": "option1" }
      },
      {
        "type": "url",
        "id": "btn2",
        "label": "Visit Website",
        "url": "https://example.com"
      }
    ]
  }
}
```

### Send Image

```json
{
  "to": "5511999999999",
  "type": "image",
  "payload": {
    "url": "https://example.com/image.png",
    "text": "Image caption"
  }
}
```

### Send Template (HSM)

```json
{
  "to": "5511999999999",
  "type": "template",
  "payload": {
    "name": "template_name",
    "language": "pt_BR",
    "parameters": ["John", "Order #123"]
  }
}
```

### Send Location

```json
{
  "to": "5511999999999",
  "type": "location",
  "payload": {
    "latitude": "-23.5505199",
    "longitude": "-46.6333094",
    "name": "São Paulo, SP",
    "address": "Av. Paulista, 1000"
  }
}
```

### Send Interactive List

```json
{
  "to": "5511999999999",
  "type": "list",
  "payload": {
    "text": "Choose an option:",
    "button": "View options",
    "sections": [
      {
        "title": "Section 1",
        "buttons": [
          {
            "type": "postback",
            "id": "opt1",
            "label": "Option 1",
            "data": {}
          }
        ]
      }
    ]
  }
}
```

## API Reference

This node integrates with the Hyperflow WhatsApp API. All requests are made to:

```
POST https://messaging.hyperflowapis.global/whatsapp/send-message
```

With authentication via `api-key` header.

## Support

- **Documentation**: https://help.hyperflow.global/docs/whatsapp-api-hyperflow/whatsapp-api-hyperflow
- **Email**: faleconosco@hyperflow.global

## License

MIT
