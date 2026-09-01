import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { handleApiError } from "./errors/d4sign.error";
import { Certificates } from './modules/certificates';
import { Documents } from './modules/documents';
import { Signatures } from './modules/signatures';
import { Webhooks } from './modules/webhooks';
import { Account } from './types';

// Export all modules and types
export * from './errors/d4sign.error';
export * from './modules/certificates';
export * from './modules/documents';
export * from './modules/signatures';
export * from './modules/webhooks';
export * from './types';

/**
 * D4Sign API Client for Node.js
 */
export class D4Sign {
  private apiUrl: string;
  private readonly accountEndpoint = '/account';
  private apiKey: string;
  private cryptKey?: string;
  private http: AxiosInstance;

  // API modules
  public documents: Documents;
  public signatures: Signatures;
  public webhooks: Webhooks;
  public certificates: Certificates;

  /**
   * Creates a new D4Sign API client
   *
   * @param apiKey - Your D4Sign API key
   * @param cryptKey - Your D4Sign crypt key (optional)
   * @param options - Additional options for the client
   */
  constructor(
    apiKey: string,
    cryptKey?: string,
    options: {
      apiUrl?: string;
      timeout?: number;
    } = {}
  ) {
    this.apiKey = apiKey;
    this.cryptKey = cryptKey;
    this.apiUrl = options.apiUrl || 'https://secure.d4sign.com.br/api/v1';

    // Create axios instance with default configuration
    this.http = axios.create({
      baseURL: this.apiUrl,
      timeout: options.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor to add authentication to all requests
    this.http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      if (!config.params) {
        config.params = {};
      }
      config.params.tokenAPI = this.apiKey;

      if (this.cryptKey) {
        config.params.cryptKey = this.cryptKey;
      }

      return config;
    });

    // Convert every failed request into a D4SignError
    this.http.interceptors.response.use(
      response => response,
      error => handleApiError(error)
    );

    // Initialize API modules
    this.documents = new Documents(this.http);
    this.signatures = new Signatures(this.documents);
    this.webhooks = new Webhooks(this.documents);
    this.certificates = new Certificates(this.http);
  }

  /**
   * Get account information
   *
   * @returns Promise with account information
   */
  async getAccount(): Promise<Account> {
    const response = await this.http.get(this.accountEndpoint);
    return response.data;
  }
}

