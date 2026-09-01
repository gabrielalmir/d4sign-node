import { AxiosInstance } from 'axios';
import { D4SignError } from '../../errors/d4sign.error';
import { D4SignResponse } from '../../types';

/**
 * Certificates module for D4Sign API
 */
export class Certificates {
  private http: AxiosInstance;
  // The D4Sign API uses the singular form: /certificate/{uuid-document}/...
  private readonly endpoint = '/certificate';

  /**
   * Creates a new Certificates module instance
   *
   * @param http - Axios instance for making HTTP requests
   */
  constructor(http: AxiosInstance) {
    this.http = http;
  }

  private assertKey(value: string, name: string): void {
    if (!value) {
      throw new D4SignError(`${name} not set.`, 0, null);
    }
  }

  /**
   * Find certificates for a document and signer
   * @param uuidArquivo - UUID of the document
   * @param keySigner - Key of the signer
   */
  async find(uuidArquivo: string, keySigner: string): Promise<D4SignResponse> {
    this.assertKey(uuidArquivo, 'uuidArquivo');
    const data = { key_signer: keySigner };
    const response = await this.http.post(`${this.endpoint}/${uuidArquivo}/list`, data);
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
    this.assertKey(uuidArquivo, 'uuidArquivo');
    const data: Record<string, string> = {
      key_signer: keySigner,
      document_type: documentType
    };
    if (documentNumber) {
      data.document_number = documentNumber;
    }
    if (pades) {
      data.pades = pades;
    }
    const response = await this.http.post(`${this.endpoint}/${uuidArquivo}/add`, data);
    return response.data;
  }
}
