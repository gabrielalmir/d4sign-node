import { AxiosInstance } from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { D4SignResponse, DocumentDetailResponse, DocumentListResponse } from '../../types';

/**
 * Documents module for D4Sign API
 */
export class Documents {
  private http: AxiosInstance;

  /**
   * Creates a new Documents module instance
   *
   * @param http - Axios instance for making HTTP requests
   */
  constructor(http: AxiosInstance) {
    this.http = http;
  }

  /**
   * List all documents
   *
   * @param folderUuid - Optional folder UUID to filter documents
   * @returns Promise with list of documents
   */
  async list(folderUuid?: string): Promise<DocumentListResponse> {
    const params: any = {};

    if (folderUuid) {
      params.folder_uuid = folderUuid;
    }

    const response = await this.http.get('/documents', { params });
    return response.data;
  }

  /**
   * Get document details
   *
   * @param documentUuid - UUID of the document
   * @returns Promise with document details
   */
  async getDocument(documentUuid: string): Promise<DocumentDetailResponse> {
    const response = await this.http.get(`/documents/${documentUuid}`);
    return response.data;
  }

  /**
   * Upload a document
   *
   * @param filePath - Path to the file to upload
   * @param name - Name of the document
   * @param folderUuid - Optional folder UUID to place the document in
   * @returns Promise with upload result
   */
  async upload(filePath: string, name?: string, folderUuid?: string): Promise<DocumentDetailResponse> {
    const formData = new FormData();
    const fileContent = fs.readFileSync(filePath);
    const fileName = name || path.basename(filePath);

    formData.append('file', fileContent, fileName);

    if (folderUuid) {
      formData.append('folder_uuid', folderUuid);
    }

    const response = await this.http.post('/documents/upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return response.data;
  }

  /**
   * Upload a document from buffer
   *
   * @param buffer - File buffer
   * @param fileName - Name of the file
   * @param folderUuid - Optional folder UUID to place the document in
   * @returns Promise with upload result
   */
  async uploadBuffer(buffer: Buffer, fileName: string, folderUuid?: string): Promise<DocumentDetailResponse> {
    const formData = new FormData();

    formData.append('file', buffer, fileName);

    if (folderUuid) {
      formData.append('folder_uuid', folderUuid);
    }

    const response = await this.http.post('/documents/upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return response.data;
  }

  /**
   * Delete a document
   *
   * @param documentUuid - UUID of the document to delete
   * @returns Promise with deletion result
   */
  async delete(documentUuid: string): Promise<D4SignResponse> {
    const response = await this.http.delete(`/documents/${documentUuid}`);
    return response.data;
  }

  /**
   * Cancel a document
   *
   * @param documentUuid - UUID of the document to cancel
   * @returns Promise with cancellation result
   */
  async cancel(documentUuid: string): Promise<D4SignResponse> {
    const response = await this.http.post(`/documents/${documentUuid}/cancel`);
    return response.data;
  }

  /**
   * Send a document to signers
   *
   * @param documentUuid - UUID of the document to send
   * @param message - Optional message to include in the email
   * @param skipEmail - Optional flag to skip sending email
   * @returns Promise with send result
   */
  async send(documentUuid: string, message?: string, skipEmail?: boolean): Promise<D4SignResponse> {
    const params: any = {};

    if (message) {
      params.message = message;
    }

    if (skipEmail) {
      params.skip_email = skipEmail ? '1' : '0';
    }

    const response = await this.http.post(`/documents/${documentUuid}/sendtosign`, params);
    return response.data;
  }

  /**
   * Get document download link
   *
   * @param documentUuid - UUID of the document
   * @returns Promise with download link
   */
  async getDownloadLink(documentUuid: string): Promise<string> {
    const response = await this.http.post(`/documents/${documentUuid}/download`);
    return response.data.data;
  }
}
