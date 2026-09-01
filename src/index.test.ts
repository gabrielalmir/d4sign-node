import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { D4Sign, D4SignError } from './index';

// Mock axios for testing
const mockAxios = new MockAdapter(axios);

describe('D4Sign', () => {
  let client: D4Sign;

  beforeEach(() => {
    // Create a new client before each test
    client = new D4Sign('test-api-key', 'test-crypt-key');

    // Reset mock
    mockAxios.reset();
  });

  describe('Authentication', () => {
    it('should add API key to all requests', async () => {
      // Mock the account endpoint
      mockAxios.onGet('/account').reply(config => {
        // Check if the API key is in the request params
        expect(config.params.tokenAPI).toBe('test-api-key');
        expect(config.params.cryptKey).toBe('test-crypt-key');

        return [200, { uuid: 'test-uuid' }];
      });

      // Call the getAccount method
      await client.getAccount();
    });
  });

  describe('Account', () => {
    it('should get account information', async () => {
      // The API returns a flat JSON object (no envelope)
      const responseData = {
        uuid: 'test-uuid',
        name: 'Test Account',
        email: 'test@example.com',
        plan_name: 'Test Plan',
        balance: 500,
      };

      mockAxios.onGet('/account').reply(200, responseData);

      const result = await client.getAccount();

      expect(result).toEqual(responseData);
    });
  });

  describe('Documents', () => {
    it('should list documents as a bare array', async () => {
      // GET /documents returns a bare JSON array (no envelope)
      const responseData = [
        {
          uuidDoc: 'doc-uuid-1',
          nameDoc: 'Document 1',
          statusId: '2',
          statusName: 'Aguardando Signatários',
        },
        {
          uuidDoc: 'doc-uuid-2',
          nameDoc: 'Document 2',
          statusId: '4',
          statusName: 'Finalizado',
        },
      ];

      mockAxios.onGet('/documents').reply(200, responseData);

      const result = await client.documents.list();

      expect(result).toEqual(responseData);
    });

    it('should fetch a single document without the pg param', async () => {
      mockAxios.onGet('/documents/doc-uuid').reply(config => {
        expect(config.params).not.toHaveProperty('pg');
        return [200, { uuidDoc: 'doc-uuid', nameDoc: 'Document 1' }];
      });

      const result = await client.documents.find('doc-uuid');
      expect(result).toEqual({ uuidDoc: 'doc-uuid', nameDoc: 'Document 1' });
    });
  });

  describe('POST payloads', () => {
    it('should send createList with only the signers array', async () => {
      mockAxios.onPost('/documents/doc-uuid/createlist').reply(config => {
        const body = JSON.parse(config.data);
        expect(body.signers).toEqual([{ email: 'a@b.com', act: '1', foreign: '0' }]);
        expect(body).not.toHaveProperty('skip_email');
        return [200, { message: 'Success' }];
      });

      await client.documents.createList('doc-uuid', [{ email: 'a@b.com', act: '1', foreign: '0' }]);
    });

    it('should send plain strings without embedded quotes', async () => {
      mockAxios.onPost('/documents/doc-uuid/changeemail').reply(config => {
        const body = JSON.parse(config.data);
        expect(body['email-before']).toBe('old@example.com');
        expect(body['email-after']).toBe('new@example.com');
        expect(body['key-signer']).toBe('signer-key');
        return [200, { message: 'Success' }];
      });

      await client.signatures.changeEmail('doc-uuid', 'old@example.com', 'new@example.com', 'signer-key');
    });

    it('should send sendToSigner with skip_email "0" by default', async () => {
      mockAxios.onPost('/documents/doc-uuid/sendtosigner').reply(config => {
        const body = JSON.parse(config.data);
        expect(body.skip_email).toBe('0');
        expect(body.workflow).toBe('0');
        expect(body.message).toBe('Please sign');
        return [200, { message: 'Success' }];
      });

      await client.documents.sendToSigner('doc-uuid', 'Please sign');
    });

    it('should send webhook url as a plain string', async () => {
      mockAxios.onPost('/documents/doc-uuid/webhooks').reply(config => {
        const body = JSON.parse(config.data);
        expect(body.url).toBe('https://example.com/hook');
        return [200, { message: 'Success' }];
      });

      await client.webhooks.add('doc-uuid', 'https://example.com/hook');
    });

    it('should omit uuid_folder when not provided', async () => {
      mockAxios.onPost('/documents/safe-uuid/uploadbinary').reply(config => {
        const body = JSON.parse(config.data);
        expect(body).not.toHaveProperty('uuid_folder');
        return [200, { message: 'Success' }];
      });

      await client.documents.uploadBinary('safe-uuid', 'base64data', 'application/pdf', 'file.pdf');
    });

    it('should only send provided download options', async () => {
      mockAxios.onPost('/documents/doc-uuid/download').reply(config => {
        const body = JSON.parse(config.data);
        expect(body).toEqual({ type: 'pdf', language: 'en' });
        return [200, { url: 'https://example.com/file.pdf' }];
      });

      const result = await client.documents.getFileUrl('doc-uuid', { type: 'pdf', language: 'en' });
      expect(result).toEqual({ url: 'https://example.com/file.pdf' });
    });

    it('should send an empty body for getFileUrl without options', async () => {
      mockAxios.onPost('/documents/doc-uuid/download').reply(config => {
        expect(JSON.parse(config.data)).toEqual({});
        return [200, { url: 'https://example.com/file.pdf' }];
      });

      await client.documents.getFileUrl('doc-uuid');
    });
  });

  describe('Uploads', () => {
    it('should send multipart/form-data with a boundary', async () => {
      const tmpFile = path.join(os.tmpdir(), 'd4sign-test-upload.pdf');
      fs.writeFileSync(tmpFile, 'dummy content');

      try {
        mockAxios.onPost('/documents/safe-uuid/upload').reply(config => {
          const headers = config.headers ?? {};
          const contentType = String(headers['Content-Type'] ?? headers['content-type']);
          expect(contentType).toContain('multipart/form-data');
          expect(contentType).toContain('boundary=');
          return [200, { message: 'Success' }];
        });

        await client.documents.upload('safe-uuid', tmpFile);
      } finally {
        fs.unlinkSync(tmpFile);
      }
    });
  });

  describe('Certificates', () => {
    it('should use the singular /certificate path', async () => {
      mockAxios.onPost('/certificate/doc-uuid/list').reply(200, { message: 'Success' });

      const result = await client.certificates.find('doc-uuid', 'signer-key');
      expect(result).toEqual({ message: 'Success' });
    });

    it('should omit empty optional certificate fields', async () => {
      mockAxios.onPost('/certificate/doc-uuid/add').reply(config => {
        const body = JSON.parse(config.data);
        expect(body).toEqual({ key_signer: 'signer-key', document_type: '1' });
        return [200, { message: 'Success' }];
      });

      await client.certificates.add('doc-uuid', 'signer-key', '1');
    });
  });

  describe('Error handling', () => {
    it('should handle API errors', async () => {
      // Mock error response
      mockAxios.onGet('/account').reply(401, {
        success: false,
        message: 'Invalid API key',
      });

      // Call the getAccount method and expect it to throw
      await expect(client.getAccount()).rejects.toThrow('D4Sign API Error: 401 - Invalid API key');
    });

    it('should throw D4SignError from module methods', async () => {
      mockAxios.onPost('/documents/doc-uuid/cancel').reply(400, {
        message: 'Documento não encontrado',
      });

      await expect(client.documents.cancel('doc-uuid')).rejects.toBeInstanceOf(D4SignError);
    });

    it('should join array error messages', async () => {
      mockAxios.onGet('/account').reply(400, { message: ['Erro 1', 'Erro 2'] });

      await expect(client.getAccount()).rejects.toThrow('D4Sign API Error: 400 - Erro 1; Erro 2');
    });

    it('should not produce "undefined" for empty error bodies', async () => {
      mockAxios.onGet('/account').reply(500);

      await expect(client.getAccount()).rejects.toThrow('D4Sign API Error: 500 - Unknown error');
    });

    it('should throw D4SignError for missing keys', async () => {
      const error = await client.documents.cancel('').catch(e => e);
      expect(error).toBeInstanceOf(D4SignError);
      expect(error.message).toBe('documentKey not set.');
      expect(error.status).toBe(0);
    });
  });
});
