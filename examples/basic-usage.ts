import * as dotenv from 'dotenv';
import * as path from 'path';
import { D4Sign } from '../src';

// Load environment variables from .env file
dotenv.config();

// Check if API key is provided
if (!process.env.D4SIGN_API_KEY) {
  console.error('Error: D4SIGN_API_KEY environment variable is required');
  process.exit(1);
}

// Create a new D4Sign client
const client = new D4Sign(
  process.env.D4SIGN_API_KEY,
  process.env.D4SIGN_CRYPT_KEY
);

// Example: Get account information
async function getAccountInfo() {
  try {
    const account = await client.getAccount();
    console.log('Account Information:');
    console.log(JSON.stringify(account, null, 2));
  } catch (error) {
    console.error('Error getting account information:', error);
  }
}

// Example: Find documents (PHP: find)
async function findDocuments() {
  try {
    const documents = await client.documents.find();
    console.log('Documents:');
    console.log(JSON.stringify(documents, null, 2));
  } catch (error) {
    console.error('Error finding documents:', error);
  }
}

// Example: Upload a document (PHP: upload)
async function uploadDocument(uuidSafe: string, filePath: string, uuidFolder?: string) {
  try {
    const fileName = path.basename(filePath);
    console.log(`Uploading document: ${fileName}`);
    const result = await client.documents.upload(uuidSafe, filePath, uuidFolder);
    console.log('Upload result:');
    console.log(JSON.stringify(result, null, 2));
    return result.data?.uuid;
  } catch (error) {
    console.error('Error uploading document:', error);
    return null;
  }
}

// Example: List signatures for a document
async function listSignatures(documentKey: string) {
  try {
    const result = await client.signatures.listSignatures(documentKey);
    console.log('Signatures:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error listing signatures:', error);
  }
}

// Example: Add info to a signer
async function addInfo(documentKey: string, email: string) {
  try {
    const result = await client.signatures.addInfo(documentKey, email, 'Signer Name', '12345678900', '1990-01-01');
    console.log('Add info result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error adding info:', error);
  }
}

// Example: Resend document to a signer
async function resendDocument(documentKey: string, email: string) {
  try {
    const result = await client.signatures.resend(documentKey, email);
    console.log('Resend result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error resending document:', error);
  }
}

// Example: Add a webhook to a document
async function addWebhook(documentKey: string, url: string) {
  try {
    const result = await client.webhooks.add(documentKey, url);
    console.log('Add webhook result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error adding webhook:', error);
  }
}

// Example: List webhooks for a document
async function listWebhooks(documentKey: string) {
  try {
    const result = await client.webhooks.list(documentKey);
    console.log('Webhooks:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error listing webhooks:', error);
  }
}

// Example: Find certificates for a document and signer
async function findCertificates(documentKey: string, keySigner: string) {
  try {
    const result = await client.certificates.find(documentKey, keySigner);
    console.log('Certificates:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error finding certificates:', error);
  }
}

// Example: Add a certificate to a document for a signer
async function addCertificate(documentKey: string, keySigner: string) {
  try {
    const result = await client.certificates.add(documentKey, keySigner, 'document_type');
    console.log('Add certificate result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error adding certificate:', error);
  }
}

async function runExamples() {
  await getAccountInfo();
  await findDocuments();
  // Add your own UUIDs and file paths to test the following:
  // const uuidSafe = 'your-safe-uuid';
  // const filePath = '/path/to/document.pdf';
  // const documentKey = await uploadDocument(uuidSafe, filePath);
  // if (documentKey) {
  //   await listSignatures(documentKey);
  //   await addInfo(documentKey, 'signer@example.com');
  //   await resendDocument(documentKey, 'signer@example.com');
  //   await addWebhook(documentKey, 'https://your-webhook-url.com');
  //   await listWebhooks(documentKey);
  //   await findCertificates(documentKey, 'key-signer');
  //   await addCertificate(documentKey, 'key-signer');
  // }
}

// Run the examples
runExamples().catch(console.error);
