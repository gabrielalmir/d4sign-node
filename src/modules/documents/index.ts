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
   * Change password code
   * @param documentKey - UUID of the document
   * @param keySigner - Key of the signer
   * @param email - Email of the signer
   * @param code - Password code
   */
  async changepasswordcode(documentKey: string, keySigner: string, email: string, code: string): Promise<D4SignResponse> {
    const data = {
      email: JSON.stringify(email),
      'password-code': JSON.stringify(code),
      'key-signer': JSON.stringify(keySigner)
    };
    const response = await this.http.post(`/documents/${documentKey}/changepasswordcode`, data);
    return response.data;
  }

  /**
   * Change SMS number
   * @param documentKey - UUID of the document
   * @param keySigner - Key of the signer
   * @param email - Email of the signer
   * @param sms - SMS number
   */
  async changesmsnumber(documentKey: string, keySigner: string, email: string, sms: string): Promise<D4SignResponse> {
    const data = {
      email: JSON.stringify(email),
      'sms-number': JSON.stringify(sms),
      'key-signer': JSON.stringify(keySigner)
    };
    const response = await this.http.post(`/documents/${documentKey}/changesmsnumber`, data);
    return response.data;
  }

  /**
   * Remove email
   * @param documentKey - UUID of the document
   * @param email - Email of the signer
   * @param key - Key of the signer
   */
  async removeemail(documentKey: string, email: string, key: string): Promise<D4SignResponse> {
    const data = {
      'email-signer': JSON.stringify(email),
      'key-signer': JSON.stringify(key)
    };
    const response = await this.http.post(`/documents/${documentKey}/removeemaillist`, data);
    return response.data;
  }

  /**
   * Change email
   * @param documentKey - UUID of the document
   * @param emailBefore - Before email
   * @param emailAfter - After email
   * @param key - Key of the signer
   */
  async changeemail(documentKey: string, emailBefore: string, emailAfter: string, key: string = ''): Promise<D4SignResponse> {
    const data = {
      'email-before': JSON.stringify(emailBefore),
      'email-after': JSON.stringify(emailAfter),
      'key-signer': JSON.stringify(key)
    };
    const response = await this.http.post(`/documents/${documentKey}/changeemail`, data);
    return response.data;
  }

  /**
   * Find documents (matches PHP find)
   * @param documentKey - Optional document key (UUID)
   * @param page - Optional page number
   */
  async find(documentKey: string = '', page: number = 1): Promise<DocumentListResponse> {
    const params: any = { pg: page };
    const url = documentKey ? `/documents/${documentKey}` : '/documents';
    const response = await this.http.get(url, { params });
    return response.data;
  }

  /**
   * List signatures
   * @param documentKey - UUID of the document
   */
  async listsignatures(documentKey: string): Promise<D4SignResponse> {
    const response = await this.http.get(`/documents/${documentKey}/list`);
    return response.data;
  }

  /**
   * Status
   * @param status - Status of the document
   * @param page - Optional page number
   */
  async status(status: string, page: number = 1): Promise<D4SignResponse> {
    const params = { pg: page };
    const response = await this.http.get(`/documents/${status}/status`, { params });
    return response.data;
  }

  /**
   * Safe
   * @param safeKey - UUID of the safe
   * @param uuidFolder - Optional folder UUID
   * @param page - Optional page number
   */
  async safe(safeKey: string, uuidFolder: string = '', page: number = 1): Promise<D4SignResponse> {
    const params = { pg: page };
    const response = await this.http.get(`/documents/${safeKey}/safe/${uuidFolder}`, { params });
    return response.data;
  }

  /**
   * Upload a document (matches PHP upload)
   * @param uuidSafe - UUID of the safe
   * @param filePath - Path to the file to upload
   * @param uuidFolder - Optional folder UUID
   */
  async upload(uuidSafe: string, filePath: string, uuidFolder: string = ''): Promise<D4SignResponse> {
    if (!uuidSafe) throw new Error('UUID Safe not set.');
    const formData = new FormData();
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    formData.append('file', fileContent, fileName);
    if (uuidFolder) {
      formData.append('uuid_folder', JSON.stringify(uuidFolder));
    }
    const response = await this.http.post(`/documents/${uuidSafe}/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    return response.data;
  }

  /**
   * Upload binary
   * @param uuidSafe - UUID of the safe
   * @param base64Binary - Base64 encoded binary file
   * @param mimeType - MIME type of the file
   * @param name - Name of the file
   * @param uuidFolder - Optional folder UUID
   */
  async uploadbinary(uuidSafe: string, base64Binary: string, mimeType: string, name: string, uuidFolder: string = ''): Promise<D4SignResponse> {
    if (!uuidSafe) throw new Error('UUID Safe not set.');
    const data = {
      base64_binary_file: base64Binary,
      mime_type: mimeType,
      name: name,
      uuid_folder: JSON.stringify(uuidFolder)
    };
    const response = await this.http.post(`/documents/${uuidSafe}/uploadbinary`, data);
    return response.data;
  }

  /**
   * Upload slave binary
   * @param uuidMaster - UUID of the master document
   * @param base64Binary - Base64 encoded binary file
   * @param mimeType - MIME type of the file
   * @param name - Name of the file
   */
  async uploadslavebinary(uuidMaster: string, base64Binary: string, mimeType: string, name: string): Promise<D4SignResponse> {
    if (!uuidMaster) throw new Error('UUID master document not set.');
    const data = {
      base64_binary_file: base64Binary,
      mime_type: mimeType,
      name: name
    };
    const response = await this.http.post(`/documents/${uuidMaster}/uploadslavebinary`, data);
    return response.data;
  }

  /**
   * Upload slave
   * @param uuidOriginalFile - UUID of the original file
   * @param filePath - Path to the file to upload
   */
  async uploadslave(uuidOriginalFile: string, filePath: string): Promise<D4SignResponse> {
    if (!uuidOriginalFile) throw new Error('UUID Original file not set.');
    const formData = new FormData();
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    formData.append('file', fileContent, fileName);
    const response = await this.http.post(`/documents/${uuidOriginalFile}/uploadslave`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    return response.data;
  }

  /**
   * Cancel a document (matches PHP cancel)
   * @param documentKey - UUID of the document
   * @param comment - Optional comment
   */
  async cancel(documentKey: string, comment: string = ''): Promise<D4SignResponse> {
    const data = { comment: JSON.stringify(comment) };
    const response = await this.http.post(`/documents/${documentKey}/cancel`, data);
    return response.data;
  }

  /**
   * Create list
   * @param documentKey - UUID of the document
   * @param signers - Array of signers
   * @param skipEmail - Optional skip email flag
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
   * Make document by template
   * @param documentKey - UUID of the document
   * @param nameDocument - Name of the document
   * @param templates - Array of templates
   * @param uuidFolder - Optional folder UUID
   */
  async makedocumentbytemplate(documentKey: string, nameDocument: string, templates: any[], uuidFolder: string = ''): Promise<D4SignResponse> {
    const data = {
      templates: JSON.stringify(templates),
      name_document: JSON.stringify(nameDocument),
      uuid_folder: JSON.stringify(uuidFolder)
    };
    const response = await this.http.post(`/documents/${documentKey}/makedocumentbytemplate`, data);
    return response.data;
  }

  /**
   * Make document by template word
   * @param documentKey - UUID of the document
   * @param nameDocument - Name of the document
   * @param templates - Array of templates
   * @param uuidFolder - Optional folder UUID
   */
  async makedocumentbytemplateword(documentKey: string, nameDocument: string, templates: any[], uuidFolder: string = ''): Promise<D4SignResponse> {
    const data = {
      templates: JSON.stringify(templates),
      name_document: JSON.stringify(nameDocument),
      uuid_folder: JSON.stringify(uuidFolder)
    };
    const response = await this.http.post(`/documents/${documentKey}/makedocumentbytemplateword`, data);
    return response.data;
  }

  /**
   * Webhook add
   * @param documentKey - UUID of the document
   * @param url - URL of the webhook
   */
  async webhookadd(documentKey: string, url: string): Promise<D4SignResponse> {
    const data = { url: JSON.stringify(url) };
    const response = await this.http.post(`/documents/${documentKey}/webhooks`, data);
    return response.data;
  }

  /**
   * Webhook list
   * @param documentKey - UUID of the document
   */
  async webhooklist(documentKey: string): Promise<D4SignResponse> {
    const response = await this.http.get(`/documents/${documentKey}/webhooks`);
    return response.data;
  }

  /**
   * Send a document to signers (matches PHP sendToSigner)
   * @param documentKey - UUID of the document
   * @param message - Optional message
   * @param workflow - Optional workflow (default '0')
   * @param skipEmail - Optional skip email flag
   */
  async sendToSigner(documentKey: string, message: string = '', workflow: string = '0', skipEmail: boolean = false): Promise<D4SignResponse> {
    const data = {
      message: JSON.stringify(message),
      workflow: JSON.stringify(workflow),
      skip_email: JSON.stringify(skipEmail)
    };
    const response = await this.http.post(`/documents/${documentKey}/sendtosigner`, data);
    return response.data;
  }

  /**
   * Add info
   * @param documentKey - UUID of the document
   * @param email - Email of the signer
   * @param displayName - Display name of the signer
   * @param documentation - Documentation of the signer
   * @param birthday - Birthday of the signer
   * @param key - Key of the signer
   */
  async addinfo(documentKey: string, email: string = '', displayName: string = '', documentation: string = '', birthday: string = '', key: string = ''): Promise<D4SignResponse> {
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
   * Resend
   * @param documentKey - UUID of the document
   * @param email - Email of the signer
   * @param key - Key of the signer
   */
  async resend(documentKey: string, email: string, key: string = ''): Promise<D4SignResponse> {
    const data = {
      email: JSON.stringify(email),
      key_signer: JSON.stringify(key)
    };
    const response = await this.http.post(`/documents/${documentKey}/resend`, data);
    return response.data;
  }

  /**
   * Get document download link (matches PHP getfileurl)
   * @param documentKey - UUID of the document
   * @param type - Type of file to download (optional)
   */
  async getfileurl(documentKey: string, type: string): Promise<D4SignResponse> {
    const data = { type: JSON.stringify(type) };
    const response = await this.http.post(`/documents/${documentKey}/download`, data);
    return response.data;
  }

  /**
   * Upload hash
   * @param uuidSafe - UUID of the safe
   * @param sha256 - SHA256 hash
   * @param sha512 - SHA512 hash
   * @param name - Name of the file
   * @param uuidFolder - Optional folder UUID
   */
  async uploadhash(uuidSafe: string, sha256: string, sha512: string, name: string, uuidFolder: string = ''): Promise<D4SignResponse> {
    if (!uuidSafe) throw new Error('UUID Safe not set.');
    const data = {
      sha256: sha256,
      sha512: sha512,
      name: name,
      uuid_folder: JSON.stringify(uuidFolder)
    };
    const response = await this.http.post(`/documents/${uuidSafe}/uploadhash`, data);
    return response.data;
  }

  /**
   * Get document details (matches PHP find with documentKey)
   * @param documentUuid - UUID of the document
   */
  async getDocument(documentUuid: string): Promise<DocumentDetailResponse> {
    const response = await this.http.get(`/documents/${documentUuid}`);
    return response.data;
  }
}
