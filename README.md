# D4Sign Node.js Library

A Node.js/TypeScript library for interacting with the [D4Sign](https://d4sign.com.br/) digital signature API.

**Disclaimer:** This library is not an official D4Sign API client. It is a community-driven implementation and is not affiliated with or endorsed by D4Sign.

Official release in NPM schedule to 09/05/2025 07:00 PM (UTC-3).

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
// Find documents (PHP: find)
const documents = await client.documents.find();

// Upload a document (PHP: upload)
const uploadedDocument = await client.documents.upload('uuid-safe', '/path/to/file.pdf', 'uuid-folder');

// Cancel a document
await client.documents.cancel('document-uuid', 'optional comment');

// List signatures for a document
const signatures = await client.signatures.listSignatures('document-uuid');

// Add info to a signer
await client.signatures.addInfo('document-uuid', 'signer@example.com', 'Signer Name', '12345678900', '1990-01-01');

// Resend document to a signer
await client.signatures.resend('document-uuid', 'signer@example.com');
```

### Webhooks

```typescript
// Add a webhook to a document
await client.webhooks.add('document-uuid', 'https://your-webhook-url.com');

// List webhooks for a document
const webhooks = await client.webhooks.list('document-uuid');
```

### Certificates

```typescript
// Find certificates for a document and signer
const certificates = await client.certificates.find('document-uuid', 'key-signer');

// Add a certificate to a document for a signer
await client.certificates.add('document-uuid', 'key-signer', 'document_type');
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
