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
   * List all certificates
   *
   * @returns Promise with list of certificates
   */
  async list(): Promise<CertificateListResponse> {
    const response = await this.http.get('/certificates');
    return response.data;
  }

  /**
   * Get certificate details
   *
   * @param certificateUuid - UUID of the certificate
   * @returns Promise with certificate details
   */
  async getCertificate(certificateUuid: string): Promise<D4SignResponse> {
    const response = await this.http.get(`/certificates/${certificateUuid}`);
    return response.data;
  }

  /**
   * Create a new certificate
   *
   * @param name - Name of the certificate
   * @param type - Type of the certificate
   * @param email - Email associated with the certificate
   * @param cpf - CPF (Brazilian ID) associated with the certificate
   * @returns Promise with creation result
   */
  async create(name: string, type: CertificateType, email: string, cpf: string): Promise<D4SignResponse> {
    const response = await this.http.post('/certificates', {
      name,
      type,
      email,
      cpf,
    });
    return response.data;
  }

  /**
   * Delete a certificate
   *
   * @param certificateUuid - UUID of the certificate to delete
   * @returns Promise with deletion result
   */
  async delete(certificateUuid: string): Promise<D4SignResponse> {
    const response = await this.http.delete(`/certificates/${certificateUuid}`);
    return response.data;
  }

  /**
   * Enable a certificate
   *
   * @param certificateUuid - UUID of the certificate to enable
   * @returns Promise with enable result
   */
  async enable(certificateUuid: string): Promise<D4SignResponse> {
    const response = await this.http.post(`/certificates/${certificateUuid}/enable`);
    return response.data;
  }

  /**
   * Disable a certificate
   *
   * @param certificateUuid - UUID of the certificate to disable
   * @returns Promise with disable result
   */
  async disable(certificateUuid: string): Promise<D4SignResponse> {
    const response = await this.http.post(`/certificates/${certificateUuid}/disable`);
    return response.data;
  }
}
