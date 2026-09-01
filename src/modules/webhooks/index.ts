import { D4SignResponse } from '../../types';
import { Documents } from '../documents';

/**
 * Webhooks module for D4Sign API
 *
 * Delegates to the `Documents` module, which owns the
 * `/documents/{uuid}/webhooks` endpoints.
 */
export class Webhooks {
  private documents: Documents;

  /**
   * Creates a new Webhooks module instance
   *
   * @param documents - Documents module instance to delegate to
   */
  constructor(documents: Documents) {
    this.documents = documents;
  }

  /**
   * Add a webhook to a document
   * @param documentKey - UUID of the document
   * @param url - URL of the webhook
   */
  async add(documentKey: string, url: string): Promise<D4SignResponse> {
    return this.documents.webhookAdd(documentKey, url);
  }

  /**
   * List webhooks for a document
   * @param documentKey - UUID of the document
   */
  async list(documentKey: string): Promise<D4SignResponse> {
    return this.documents.webhookList(documentKey);
  }
}
