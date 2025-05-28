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
   * Change password code for a signer
   */
  async changePasswordCode(documentKey: string, keySigner: string, email: string, code: string): Promise<D4SignResponse> {
    const data = {
      email: JSON.stringify(email),
      'password-code': JSON.stringify(code),
      'key-signer': JSON.stringify(keySigner)
    };
    const response = await this.http.post(`/documents/${documentKey}/changepasswordcode`, data);
    return response.data;
  }

  /**
   * Change SMS number for a signer
   */
  async changeSmsNumber(documentKey: string, keySigner: string, email: string, sms: string): Promise<D4SignResponse> {
    const data = {
      email: JSON.stringify(email),
      'sms-number': JSON.stringify(sms),
      'key-signer': JSON.stringify(keySigner)
    };
    const response = await this.http.post(`/documents/${documentKey}/changesmsnumber`, data);
    return response.data;
  }

  /**
   * Remove a signer from a document
   */
  async removeEmail(documentKey: string, email: string, key: string): Promise<D4SignResponse> {
    const data = {
      'email-signer': JSON.stringify(email),
      'key-signer': JSON.stringify(key)
    };
    const response = await this.http.post(`/documents/${documentKey}/removeemaillist`, data);
    return response.data;
  }

  /**
   * Change a signer's email
   */
  async changeEmail(documentKey: string, emailBefore: string, emailAfter: string, key: string = ''): Promise<D4SignResponse> {
    const data = {
      'email-before': JSON.stringify(emailBefore),
      'email-after': JSON.stringify(emailAfter),
      'key-signer': JSON.stringify(key)
    };
    const response = await this.http.post(`/documents/${documentKey}/changeemail`, data);
    return response.data;
  }

  /**
   * List signatures for a document
   */
  async listSignatures(documentKey: string): Promise<D4SignResponse> {
    const response = await this.http.get(`/documents/${documentKey}/list`);
    return response.data;
  }

  /**
   * Get status for a document
   */
  async status(status: string, page: number = 1): Promise<D4SignResponse> {
    const params = { pg: page };
    const response = await this.http.get(`/documents/${status}/status`, { params });
    return response.data;
  }

  /**
   * Create a signature list for a document
   */
  async createList(documentKey: string, signers: any[], skipEmail: boolean = false): Promise<D4SignResponse> {
    const data = {
      signers: JSON.stringify(signers),
      skip_email: JSON.stringify(skipEmail)
    };
    const response = await this.http.post(`/documents/${documentKey}/createlist`, data);
    return response.data;
  }

  /**
   * Add info to a signer
   */
  async addInfo(documentKey: string, email: string = '', displayName: string = '', documentation: string = '', birthday: string = '', key: string = ''): Promise<D4SignResponse> {
    const data = {
      key_signer: JSON.stringify(key),
      email: JSON.stringify(email),
      display_name: JSON.stringify(displayName),
      documentation: JSON.stringify(documentation),
      birthday: JSON.stringify(birthday)
    };
    const response = await this.http.post(`/documents/${documentKey}/addinfo`, data);
    return response.data;
  }

  /**
   * Resend a document to a signer
   */
  async resend(documentKey: string, email: string, key: string = ''): Promise<D4SignResponse> {
    const data = {
      email: JSON.stringify(email),
      key_signer: JSON.stringify(key)
    };
    const response = await this.http.post(`/documents/${documentKey}/resend`, data);
    return response.data;
  }
}
