import { AxiosInstance } from 'axios';
import { D4SignResponse, WebhookListResponse } from '../../types';

/**
 * Webhook event types
 */
export enum WebhookEvent {
  DOCUMENT_UPLOADED = 'document.uploaded',
  DOCUMENT_SIGNED = 'document.signed',
  DOCUMENT_FINISHED = 'document.finished',
  DOCUMENT_CANCELED = 'document.canceled',
  SIGNER_SIGNED = 'signer.signed',
}

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
   * List all webhooks
   *
   * @returns Promise with list of webhooks
   */
  async list(): Promise<WebhookListResponse> {
    const response = await this.http.get('/webhooks');
    return response.data;
  }

  /**
   * Register a new webhook
   *
   * @param url - URL to receive webhook events
   * @param events - Array of events to subscribe to
   * @returns Promise with registration result
   */
  async register(url: string, events: WebhookEvent[]): Promise<D4SignResponse> {
    const response = await this.http.post('/webhooks', {
      url,
      events: events.join(','),
    });
    return response.data;
  }

  /**
   * Delete a webhook
   *
   * @param webhookUuid - UUID of the webhook to delete
   * @returns Promise with deletion result
   */
  async delete(webhookUuid: string): Promise<D4SignResponse> {
    const response = await this.http.delete(`/webhooks/${webhookUuid}`);
    return response.data;
  }

  /**
   * Update a webhook
   *
   * @param webhookUuid - UUID of the webhook to update
   * @param url - New URL for the webhook
   * @param events - New events to subscribe to
   * @returns Promise with update result
   */
  async update(webhookUuid: string, url: string, events: WebhookEvent[]): Promise<D4SignResponse> {
    const response = await this.http.put(`/webhooks/${webhookUuid}`, {
      url,
      events: events.join(','),
    });
    return response.data;
  }

  /**
   * Enable a webhook
   *
   * @param webhookUuid - UUID of the webhook to enable
   * @returns Promise with enable result
   */
  async enable(webhookUuid: string): Promise<D4SignResponse> {
    const response = await this.http.post(`/webhooks/${webhookUuid}/enable`);
    return response.data;
  }

  /**
   * Disable a webhook
   *
   * @param webhookUuid - UUID of the webhook to disable
   * @returns Promise with disable result
   */
  async disable(webhookUuid: string): Promise<D4SignResponse> {
    const response = await this.http.post(`/webhooks/${webhookUuid}/disable`);
    return response.data;
  }
}
