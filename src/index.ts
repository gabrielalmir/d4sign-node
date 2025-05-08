import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as dotenv from 'dotenv';
import { D4SignError } from "./errors/d4sign.error";
import { Certificates } from './modules/certificates';
import { Documents } from './modules/documents';
import { Signatures } from './modules/signatures';
import { Webhooks } from './modules/webhooks';
import { AccountResponse } from './types';

// Export all modules and types
export * from './modules/certificates';
export * from './modules/documents';
export * from './modules/signatures';
export * from './modules/webhooks';
export * from './types';

dotenv.config();

/**
 * D4Sign API Client for Node.js
 */
export class D4Sign {
  private apiUrl: string;
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
      config.params.apikey = this.apiKey;

      if (this.cryptKey) {
        config.params.cryptkey = this.cryptKey;
      }

      return config;
    });

    // Initialize API modules
    this.documents = new Documents(this.http);
    this.signatures = new Signatures(this.http);
    this.webhooks = new Webhooks(this.http);
    this.certificates = new Certificates(this.http);
  }

  /**
   * Get account information
   *
   * @returns Promise with account information
   */
  async getAccount(): Promise<AccountResponse> {
    try {
      const response = await this.http.get('/account');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Handle API errors
   *
   * @param error - Error object from axios
   */
  private handleError(error: any): never {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      throw new D4SignError(
        `D4Sign API Error: ${status} - ${data.message || JSON.stringify(data)}`,
        status,
        data
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new D4SignError(
        `D4Sign API Error: No response received - ${error.message}`,
        0,
        null
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new D4SignError(`D4Sign API Error: ${error.message}`, 0, null);
    }
  }
}

