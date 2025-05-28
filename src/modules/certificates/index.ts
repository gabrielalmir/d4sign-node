import { AxiosInstance } from 'axios';
import { CertificateListResponse, D4SignResponse } from '../../types';

/**
 * Certificate type enum
 */
export enum CertificateType {
  ICP_BRASIL = 'icp_brasil',
  DIGITAL = 'digital',
}

/**
 * Certificates module for D4Sign API
 */
export class Certificates {
  private http: AxiosInstance;

  /**
   * Creates a new Certificates module instance
   *
   * @param http - Axios instance for making HTTP requests
   */
  constructor(http: AxiosInstance) {
    this.http = http;
  }

  /**
   * Find certificates for a document and signer
   * @param uuidArquivo - UUID of the document
   * @param keySigner - Key of the signer
   */
  async find(uuidArquivo: string, keySigner: string): Promise<D4SignResponse> {
    const data = { key_signer: keySigner };
    const response = await this.http.post(`/certificate/${uuidArquivo}/list`, data);
    return response.data;
  }

  /**
   * Add a certificate to a document for a signer
   * @param uuidArquivo - UUID of the document
   * @param keySigner - Key of the signer
   * @param documentType - Type of the document
   * @param documentNumber - Document number (optional)
   * @param pades - PAdES flag (optional)
   */
  async add(uuidArquivo: string, keySigner: string, documentType: string, documentNumber: string = '', pades: string = ''): Promise<D4SignResponse> {
    const data = {
      key_signer: keySigner,
      document_type: documentType,
      document_number: documentNumber,
      pades: pades
    };
    const response = await this.http.post(`/certificate/${uuidArquivo}/add`, data);
    return response.data;
  }
}
