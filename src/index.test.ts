import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { D4Sign } from './index';

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
        expect(config.params.apikey).toBe('test-api-key');
        expect(config.params.cryptkey).toBe('test-crypt-key');

        return [200, { success: true, message: 'Success', data: { uuid: 'test-uuid' } }];
      });

      // Call the getAccount method
      await client.getAccount();
    });
  });

  describe('Account', () => {
    it('should get account information', async () => {
      // Mock response data
      const responseData = {
        success: true,
        message: 'Success',
        data: {
          uuid: 'test-uuid',
          name: 'Test Account',
          email: 'test@example.com',
          plan_name: 'Test Plan',
          plan_value: 100,
          balance: 500,
          documents_month: 10,
          documents_total: 50,
          emails_month: 100,
          emails_total: 500,
          sms_month: 10,
          sms_total: 50,
          whatsapp_month: 10,
          whatsapp_total: 50,
          safe_month: 10,
          safe_total: 50,
        }
      };

      // Mock the account endpoint
      mockAxios.onGet('/account').reply(200, responseData);

      // Call the getAccount method
      const result = await client.getAccount();

      // Check the result
      expect(result).toEqual(responseData);
    });
  });

  describe('Documents', () => {
    it('should list documents', async () => {
      // Mock response data
      const responseData = {
        success: true,
        message: 'Success',
        data: [
          {
            uuid: 'doc-uuid-1',
            name: 'Document 1',
            status: 'active',
            created_at: '2023-01-01',
            updated_at: '2023-01-01',
          },
          {
            uuid: 'doc-uuid-2',
            name: 'Document 2',
            status: 'active',
            created_at: '2023-01-02',
            updated_at: '2023-01-02',
          },
        ]
      };

      // Mock the documents endpoint
      mockAxios.onGet('/documents').reply(200, responseData);

      // Call the list method
      const result = await client.documents.list();

      // Check the result
      expect(result).toEqual(responseData);
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
  });
});
