import { AxiosInstance } from 'axios';
import { D4SignResponse } from '../../types';

/**
 * Webhooks module for D4Sign API
 */
export class Webhooks {
  private http: AxiosInstance;

  /**
   * Creates a new Webhooks module instance
   *
   * @param http - Axios instance for making HTTP requests
   */
  constructor(http: AxiosInstance) {
    this.http = http;
  }

  /**
   * Add a webhook to a document
   * @param documentKey - UUID of the document
   * @param url - URL of the webhook
   */
  async add(documentKey: string, url: string): Promise<D4SignResponse> {
    const data = { url: JSON.stringify(url) };
    const response = await this.http.post(`/documents/${documentKey}/webhooks`, data);
    return response.data;
  }

  /**
   * List webhooks for a document
   * @param documentKey - UUID of the document
   */
  async list(documentKey: string): Promise<D4SignResponse> {
    const response = await this.http.get(`/documents/${documentKey}/webhooks`);
    return response.data;
  }
}
