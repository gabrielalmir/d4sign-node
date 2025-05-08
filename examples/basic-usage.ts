import * as dotenv from 'dotenv';
import * as path from 'path';
import { D4Sign, SignerType, WebhookEvent } from '../src';

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

// Example: List documents
async function listDocuments() {
  try {
    const documents = await client.documents.list();
    console.log('Documents:');
    console.log(JSON.stringify(documents, null, 2));
  } catch (error) {
    console.error('Error listing documents:', error);
  }
}

// Example: Upload a document
async function uploadDocument(filePath: string) {
  try {
    const fileName = path.basename(filePath);
    console.log(`Uploading document: ${fileName}`);

    const result = await client.documents.upload(filePath, fileName);
    console.log('Upload result:');
    console.log(JSON.stringify(result, null, 2));

    return result.data.uuid;
  } catch (error) {
    console.error('Error uploading document:', error);
    return null;
  }
}

// Example: Add signers to a document
async function addSigners(documentUuid: string) {
  try {
    const signers = [
      {
        email: 'signer1@example.com',
        name: 'Signer One',
        documentation: '12345678900', // CPF or CNPJ
      },
      {
        email: 'signer2@example.com',
        name: 'Signer Two',
      },
    ];

    console.log(`Adding signers to document: ${documentUuid}`);
    const result = await client.signatures.addSigners(documentUuid, signers);
    console.log('Add signers result:');
    console.log(JSON.stringify(result, null, 2));

    // Set signature type for first signer
    await client.signatures.setSignatureType(
      documentUuid,
      'signer1@example.com',
      SignerType.EMAIL
    );

    return true;
  } catch (error) {
    console.error('Error adding signers:', error);
    return false;
  }
}

// Example: Send document to signers
async function sendDocument(documentUuid: string) {
  try {
    console.log(`Sending document: ${documentUuid}`);
    const result = await client.documents.send(
      documentUuid,
      'Please sign this document'
    );
    console.log('Send result:');
    console.log(JSON.stringify(result, null, 2));
    return true;
  } catch (error) {
    console.error('Error sending document:', error);
    return false;
  }
}

// Example: Register a webhook
async function registerWebhook(url: string) {
  try {
    console.log(`Registering webhook: ${url}`);
    const result = await client.webhooks.register(
      url,
      [WebhookEvent.DOCUMENT_SIGNED, WebhookEvent.DOCUMENT_FINISHED]
    );
    console.log('Webhook registration result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error registering webhook:', error);
  }
}

// Run the examples
async function runExamples() {
  // Get account information
  await getAccountInfo();

  // List documents
  await listDocuments();

  // Upload a document (uncomment and provide a valid file path to test)
  // const documentPath = '/path/to/document.pdf';
  // if (fs.existsSync(documentPath)) {
  //   const documentUuid = await uploadDocument(documentPath);
  //
  //   if (documentUuid) {
  //     // Add signers to the document
  //     const signersAdded = await addSigners(documentUuid);
  //
  //     if (signersAdded) {
  //       // Send the document to signers
  //       await sendDocument(documentUuid);
  //     }
  //   }
  // }

  // Register a webhook (uncomment to test)
  // await registerWebhook('https://your-webhook-url.com/d4sign-webhook');
}

// Run the examples
runExamples().catch(console.error);
