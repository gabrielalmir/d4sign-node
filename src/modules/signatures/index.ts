import { D4SignResponse, Signer } from '../../types';
import { Documents } from '../documents';

/**
 * Signatures module for D4Sign API
 *
 * All methods operate on the same `/documents/...` endpoints as the
 * `Documents` module and delegate to it, so fixes apply in one place.
 */
export class Signatures {
  private documents: Documents;

  /**
   * Creates a new Signatures module instance
   *
   * @param documents - Documents module instance to delegate to
   */
  constructor(documents: Documents) {
    this.documents = documents;
  }

  /**
   * Change password code for a signer
   */
  async changePasswordCode(documentKey: string, keySigner: string, email: string, code: string): Promise<D4SignResponse> {
    return this.documents.changePasswordCode(documentKey, keySigner, email, code);
  }

  /**
   * Change SMS number for a signer
   */
  async changeSmsNumber(documentKey: string, keySigner: string, email: string, sms: string): Promise<D4SignResponse> {
    return this.documents.changeSmsNumber(documentKey, keySigner, email, sms);
  }

  /**
   * Remove a signer from a document
   */
  async removeEmail(documentKey: string, email: string, key: string): Promise<D4SignResponse> {
    return this.documents.removeEmail(documentKey, email, key);
  }

  /**
   * Change a signer's email
   */
  async changeEmail(documentKey: string, emailBefore: string, emailAfter: string, key: string = ''): Promise<D4SignResponse> {
    return this.documents.changeEmail(documentKey, emailBefore, emailAfter, key);
  }

  /**
   * List signatures for a document
   */
  async listSignatures(documentKey: string): Promise<D4SignResponse> {
    return this.documents.listSignatures(documentKey);
  }

  /**
   * List documents in a given phase
   *
   * @param statusId - Phase id (1-6), NOT a document UUID
   * @param page - Optional page number
   */
  async status(statusId: string, page: number = 1): Promise<D4SignResponse> {
    return this.documents.status(statusId, page);
  }

  /**
   * Register signers for a document
   */
  async createList(documentKey: string, signers: Signer[]): Promise<D4SignResponse> {
    return this.documents.createList(documentKey, signers);
  }

  /**
   * Add info to a signer
   */
  async addInfo(documentKey: string, email: string = '', displayName: string = '', documentation: string = '', birthday: string = '', key: string = ''): Promise<D4SignResponse> {
    return this.documents.addInfo(documentKey, email, displayName, documentation, birthday, key);
  }

  /**
   * Resend the signature link to a signer
   *
   * @param email - Email address or WhatsApp number of the signer
   */
  async resend(documentKey: string, email: string, key: string = ''): Promise<D4SignResponse> {
    return this.documents.resend(documentKey, email, key);
  }
}
