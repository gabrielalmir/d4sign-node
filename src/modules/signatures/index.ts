import { AxiosInstance } from 'axios';
import { D4SignResponse } from '../../types';

/**
 * Signer type enum
 */
export enum SignerType {
  EMAIL = 'email',
  PHONE = 'phone',
  CERTIFICATE = 'certificate',
}

/**
 * Signer interface
 */
export interface Signer {
  email: string;
  name: string;
  documentation?: string;
  foreign?: boolean;
  phone_country?: string;
  phone_number?: string;
  birthday?: string;
  action?: string;
}

/**
 * Signatures module for D4Sign API
 */
export class Signatures {
  private http: AxiosInstance;

  /**
   * Creates a new Signatures module instance
   *
   * @param http - Axios instance for making HTTP requests
   */
  constructor(http: AxiosInstance) {
    this.http = http;
  }

  /**
   * Add signers to a document
   *
   * @param documentUuid - UUID of the document
   * @param signers - Array of signers to add
   * @returns Promise with add signers result
   */
  async addSigners(documentUuid: string, signers: Signer[]): Promise<D4SignResponse> {
    const response = await this.http.post(`/documents/${documentUuid}/signers`, {
      signers,
    });
    return response.data;
  }

  /**
   * Remove a signer from a document
   *
   * @param documentUuid - UUID of the document
   * @param email - Email of the signer to remove
   * @returns Promise with remove signer result
   */
  async removeSigner(documentUuid: string, email: string): Promise<D4SignResponse> {
    const response = await this.http.delete(`/documents/${documentUuid}/signers/${email}`);
    return response.data;
  }

  /**
   * List signers of a document
   *
   * @param documentUuid - UUID of the document
   * @returns Promise with list of signers
   */
  async listSigners(documentUuid: string): Promise<D4SignResponse> {
    const response = await this.http.get(`/documents/${documentUuid}/signers`);
    return response.data;
  }

  /**
   * Set signature type for a signer
   *
   * @param documentUuid - UUID of the document
   * @param email - Email of the signer
   * @param type - Type of signature
   * @returns Promise with set signature type result
   */
  async setSignatureType(documentUuid: string, email: string, type: SignerType): Promise<D4SignResponse> {
    const response = await this.http.post(`/documents/${documentUuid}/signers/${email}/type`, {
      type,
    });
    return response.data;
  }

  /**
   * Send a reminder to a signer
   *
   * @param documentUuid - UUID of the document
   * @param email - Email of the signer
   * @returns Promise with send reminder result
   */
  async sendReminder(documentUuid: string, email: string): Promise<D4SignResponse> {
    const response = await this.http.post(`/documents/${documentUuid}/signers/${email}/reminder`);
    return response.data;
  }

  /**
   * Get signature status
   *
   * @param documentUuid - UUID of the document
   * @returns Promise with signature status
   */
  async getStatus(documentUuid: string): Promise<D4SignResponse> {
    const response = await this.http.get(`/documents/${documentUuid}/status`);
    return response.data;
  }

  /**
   * Create a signature list
   *
   * @param documentUuid - UUID of the document
   * @returns Promise with signature list creation result
   */
  async createSignatureList(documentUuid: string): Promise<D4SignResponse> {
    const response = await this.http.post(`/documents/${documentUuid}/signaturelist`);
    return response.data;
  }

  /**
   * Cancel a signature
   *
   * @param documentUuid - UUID of the document
   * @param email - Email of the signer
   * @returns Promise with cancel signature result
   */
  async cancelSignature(documentUuid: string, email: string): Promise<D4SignResponse> {
    const response = await this.http.post(`/documents/${documentUuid}/signers/${email}/cancel`);
    return response.data;
  }
}
