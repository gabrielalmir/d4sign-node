# D4Sign Node.js Library

A Node.js/TypeScript library for interacting with the [D4Sign](https://d4sign.com.br/) digital signature API.

**Disclaimer:** This library is not an official D4Sign API client. It is a community-driven implementation and is not affiliated with or endorsed by D4Sign.

## Installation

```bash
npm install d4sign-node
```

## Usage

### Basic Setup

```typescript
import { D4Sign } from 'd4sign-node';

// Create a new D4Sign client
const client = new D4Sign('your-api-key', 'your-crypt-key');

// Get account information
client.getAccount()
  .then(account => {
    console.log('Account:', account);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Environment Variables

You can also use environment variables for configuration:

```typescript
// .env file
D4SIGN_API_KEY=your-api-key
D4SIGN_CRYPT_KEY=your-crypt-key
```

```typescript
// Load environment variables
import { D4Sign } from 'd4sign-node';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new D4Sign(
  process.env.D4SIGN_API_KEY!,
  process.env.D4SIGN_CRYPT_KEY
);
```

## API Reference

### Client Initialization

```typescript
const client = new D4Sign(
  apiKey: string,
  cryptKey?: string,
  options?: {
    apiUrl?: string;
    timeout?: number;
  }
);
```

### Account

```typescript
// Get account information
const account = await client.getAccount();
```

### Documents

```typescript
// List all documents
const documents = await client.documents.list();

// Get document details
const document = await client.documents.getDocument('document-uuid');

// Upload a document
const uploadedDocument = await client.documents.upload('/path/to/file.pdf', 'Document Name');

// Upload a document from buffer
const buffer = fs.readFileSync('/path/to/file.pdf');
const uploadedDocumentFromBuffer = await client.documents.uploadBuffer(buffer, 'Document Name');

// Delete a document
await client.documents.delete('document-uuid');

// Cancel a document
await client.documents.cancel('document-uuid');

// Send a document to signers
await client.documents.send('document-uuid', 'Please sign this document');

// Get document download link
const downloadLink = await client.documents.getDownloadLink('document-uuid');
```

### Signatures

```typescript
// Add signers to a document
const signers = [
  {
    email: 'signer1@example.com',
    name: 'Signer 1',
    documentation: '12345678900', // CPF or CNPJ
  },
  {
    email: 'signer2@example.com',
    name: 'Signer 2',
  },
];
await client.signatures.addSigners('document-uuid', signers);

// Remove a signer from a document
await client.signatures.removeSigner('document-uuid', 'signer@example.com');

// List signers of a document
const signers = await client.signatures.listSigners('document-uuid');

// Set signature type for a signer
import { SignerType } from 'd4sign-node';
await client.signatures.setSignatureType('document-uuid', 'signer@example.com', SignerType.EMAIL);

// Send a reminder to a signer
await client.signatures.sendReminder('document-uuid', 'signer@example.com');

// Get signature status
const status = await client.signatures.getStatus('document-uuid');

// Create a signature list
await client.signatures.createSignatureList('document-uuid');

// Cancel a signature
await client.signatures.cancelSignature('document-uuid', 'signer@example.com');
```

### Webhooks

```typescript
// List all webhooks
const webhooks = await client.webhooks.list();

// Register a new webhook
import { WebhookEvent } from 'd4sign-node';
await client.webhooks.register(
  'https://your-webhook-url.com',
  [WebhookEvent.DOCUMENT_SIGNED, WebhookEvent.DOCUMENT_FINISHED]
);

// Delete a webhook
await client.webhooks.delete('webhook-uuid');

// Update a webhook
await client.webhooks.update(
  'webhook-uuid',
  'https://your-new-webhook-url.com',
  [WebhookEvent.DOCUMENT_SIGNED]
);

// Enable a webhook
await client.webhooks.enable('webhook-uuid');

// Disable a webhook
await client.webhooks.disable('webhook-uuid');
```

### Certificates

```typescript
// List all certificates
const certificates = await client.certificates.list();

// Get certificate details
const certificate = await client.certificates.getCertificate('certificate-uuid');

// Create a new certificate
import { CertificateType } from 'd4sign-node';
await client.certificates.create(
  'Certificate Name',
  CertificateType.ICP_BRASIL,
  'user@example.com',
  '12345678900' // CPF
);

// Delete a certificate
await client.certificates.delete('certificate-uuid');

// Enable a certificate
await client.certificates.enable('certificate-uuid');

// Disable a certificate
await client.certificates.disable('certificate-uuid');
```

## Error Handling

The library throws `D4SignError` for API errors:

```typescript
import { D4Sign, D4SignError } from 'd4sign-node';

const client = new D4Sign('your-api-key', 'your-crypt-key');

try {
  const account = await client.getAccount();
  console.log('Account:', account);
} catch (error) {
  if (error instanceof D4SignError) {
    console.error('D4Sign API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Data:', error.data);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## License

MIT
