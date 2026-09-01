import { AxiosInstance } from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import { D4SignError } from '../../errors/d4sign.error';
import { D4SignResponse, Document, DownloadOptions, Signer } from '../../types';

/**
 * Documents module for D4Sign API
 */
export class Documents {
  private http: AxiosInstance;
  private readonly endpoint = '/documents';

  /**
   * Creates a new Documents module instance
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
   * Change password code
   * @param documentKey - UUID of the document
   * @param keySigner - Key of the signer
   * @param email - Email of the signer
   * @param code - Password code
   */
  async changePasswordCode(documentKey: string, keySigner: string, email: string, code: string): Promise<D4SignResponse> {
    this.assertKey(documentKey, 'documentKey');
    const data = {
      email: email,
      'password-code': code,
      'key-signer': keySigner
    };
    const response = await this.http.post(`${this.endpoint}/${documentKey}/changepasswordcode`, data);
    return response.data;
  }

  /**
   * Change SMS number
   * @param documentKey - UUID of the document
   * @param keySigner - Key of the signer
   * @param email - Email of the signer
   * @param sms - SMS number
   */
  async changeSmsNumber(documentKey: string, keySigner: string, email: string, sms: string): Promise<D4SignResponse> {
    this.assertKey(documentKey, 'documentKey');
    const data = {
      email: email,
      'sms-number': sms,
      'key-signer': keySigner
    };
    const response = await this.http.post(`${this.endpoint}/${documentKey}/changesmsnumber`, data);
    return response.data;
  }

  /**
   * Remove email
   * @param documentKey - UUID of the document
   * @param email - Email of the signer
   * @param key - Key of the signer
   */
  async removeEmail(documentKey: string, email: string, key: string): Promise<D4SignResponse> {
    this.assertKey(documentKey, 'documentKey');
    const data = {
      'email-signer': email,
      'key-signer': key
    };
    const response = await this.http.post(`${this.endpoint}/${documentKey}/removeemaillist`, data);
    return response.data;
  }

  /**
   * Change email
   * @param documentKey - UUID of the document
   * @param emailBefore - Before email
   * @param emailAfter - After email
   * @param key - Key of the signer
   */
  async changeEmail(documentKey: string, emailBefore: string, emailAfter: string, key: string = ''): Promise<D4SignResponse> {
    this.assertKey(documentKey, 'documentKey');
    const data = {
      'email-before': emailBefore,
      'email-after': emailAfter,
      'key-signer': key
    };
    const response = await this.http.post(`${this.endpoint}/${documentKey}/changeemail`, data);
    return response.data;
  }

  /**
   * Find documents (matches PHP find)
   *
   * With a `documentKey` this returns a single document; without one it
   * returns the paginated document list.
   *
   * @param documentKey - Optional document key (UUID)
   * @param page - Optional page number (only used when listing)
   */
  async find(documentKey: string = '', page: number = 1): Promise<Document | Document[]> {
    if (documentKey) {
      return this.getDocument(documentKey);
    }
    return this.list(page);
  }

  /**
   * List documents
   * @param page - Optional page number
   */
  async list(page: number = 1): Promise<Document[]> {
    const response = await this.http.get(this.endpoint, { params: { pg: page } });
    return response.data;
  }

  /**
   * List signatures
   * @param documentKey - UUID of the document
   */
  async listSignatures(documentKey: string): Promise<D4SignResponse> {
    this.assertKey(documentKey, 'documentKey');
    const response = await this.http.get(`${this.endpoint}/${documentKey}/list`);
    return response.data;
  }

  /**
   * List documents in a given phase (GET /documents/{id-fase}/status)
   *
   * @param statusId - Phase id (1 = processing, 2 = waiting signers,
   *   3 = waiting others, 4 = finished, 5 = archived, 6 = canceled),
   *   NOT a document UUID
   * @param page - Optional page number
   */
  async status(statusId: string, page: number = 1): Promise<D4SignResponse> {
    this.assertKey(statusId, 'statusId');
    const params = { pg: page };
    const response = await this.http.get(`${this.endpoint}/${statusId}/status`, { params });
    return response.data;
  }

  /**
   * Safe
   * @param safeKey - UUID of the safe
   * @param uuidFolder - Optional folder UUID
   * @param page - Optional page number
   */
  async safe(safeKey: string, uuidFolder: string = '', page: number = 1): Promise<D4SignResponse> {
    this.assertKey(safeKey, 'safeKey');
    const params = { pg: page };
    const folderSegment = uuidFolder ? `/${uuidFolder}` : '';
    const response = await this.http.get(`${this.endpoint}/${safeKey}/safe${folderSegment}`, { params });
    return response.data;
  }

  /**
   * Upload a document (matches PHP upload)
   * @param uuidSafe - UUID of the safe
   * @param filePath - Path to the file to upload
   * @param uuidFolder - Optional folder UUID
   */
  async upload(uuidSafe: string, filePath: string, uuidFolder: string = ''): Promise<D4SignResponse> {
    this.assertKey(uuidSafe, 'uuidSafe');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    if (uuidFolder) {
      formData.append('uuid_folder', uuidFolder);
    }
    const response = await this.http.post(`${this.endpoint}/${uuidSafe}/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
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
  async uploadBinary(uuidSafe: string, base64Binary: string, mimeType: string, name: string, uuidFolder: string = ''): Promise<D4SignResponse> {
    this.assertKey(uuidSafe, 'uuidSafe');
    const data: Record<string, string> = {
      base64_binary_file: base64Binary,
      mime_type: mimeType,
      name: name
    };
    if (uuidFolder) {
      data.uuid_folder = uuidFolder;
    }
    const response = await this.http.post(`${this.endpoint}/${uuidSafe}/uploadbinary`, data);
    return response.data;
  }

  /**
   * Upload slave binary
   * @param uuidMaster - UUID of the master document
   * @param base64Binary - Base64 encoded binary file
   * @param mimeType - MIME type of the file
   * @param name - Name of the file
   */
  async uploadSlaveBinary(uuidMaster: string, base64Binary: string, mimeType: string, name: string): Promise<D4SignResponse> {
    this.assertKey(uuidMaster, 'uuidMaster');
    const data = {
      base64_binary_file: base64Binary,
      mime_type: mimeType,
      name: name
    };
    const response = await this.http.post(`${this.endpoint}/${uuidMaster}/uploadslavebinary`, data);
    return response.data;
  }

  /**
   * Upload slave
   * @param uuidOriginalFile - UUID of the original file
   * @param filePath - Path to the file to upload
   */
  async uploadSlave(uuidOriginalFile: string, filePath: string): Promise<D4SignResponse> {
    this.assertKey(uuidOriginalFile, 'uuidOriginalFile');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    const response = await this.http.post(`${this.endpoint}/${uuidOriginalFile}/uploadslave`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    return response.data;
  }

  /**
   * Cancel a document (matches PHP cancel)
   * @param documentKey - UUID of the document
   * @param comment - Optional comment
   */
  async cancel(documentKey: string, comment: string = ''): Promise<D4SignResponse> {
    this.assertKey(documentKey, 'documentKey');
    const data = { comment: comment };
    const response = await this.http.post(`${this.endpoint}/${documentKey}/cancel`, data);
    return response.data;
  }

  /**
   * Register signers for a document (POST /documents/{uuid}/createlist)
   * @param documentKey - UUID of the document
   * @param signers - Array of signers
   */
  async createList(documentKey: string, signers: Signer[]): Promise<D4SignResponse> {
    this.assertKey(documentKey, 'documentKey');
    const data = { signers: signers };
    const response = await this.http.post(`${this.endpoint}/${documentKey}/createlist`, data);
    return response.data;
  }

  /**
   * Make document by HTML template
   * @param uuidSafe - UUID of the safe (cofre) where the document is created
   * @param nameDocument - Name of the document
   * @param templates - Templates payload ({ "uuid-template": { vars } })
   * @param uuidFolder - Optional folder UUID
   */
  async makeDocumentByTemplate(uuidSafe: string, nameDocument: string, templates: any, uuidFolder: string = ''): Promise<D4SignResponse> {
    this.assertKey(uuidSafe, 'uuidSafe');
    const data: Record<string, any> = {
      templates: templates,
      name_document: nameDocument
    };
    if (uuidFolder) {
      data.uuid_folder = uuidFolder;
    }
    const response = await this.http.post(`${this.endpoint}/${uuidSafe}/makedocumentbytemplate`, data);
    return response.data;
  }

  /**
   * Make document by Word template
   * @param uuidSafe - UUID of the safe (cofre) where the document is created
   * @param nameDocument - Name of the document
   * @param templates - Templates payload ({ "uuid-template": { vars } })
   * @param uuidFolder - Optional folder UUID
   */
  async makeDocumentByTemplateWord(uuidSafe: string, nameDocument: string, templates: any, uuidFolder: string = ''): Promise<D4SignResponse> {
    this.assertKey(uuidSafe, 'uuidSafe');
    const data: Record<string, any> = {
      templates: templates,
      name_document: nameDocument
    };
    if (uuidFolder) {
      data.uuid_folder = uuidFolder;
    }
    const response = await this.http.post(`${this.endpoint}/${uuidSafe}/makedocumentbytemplateword`, data);
    return response.data;
  }

  /**
   * Webhook add
   * @param documentKey - UUID of the document
   * @param url - URL of the webhook
   */
  async webhookAdd(documentKey: string, url: string): Promise<D4SignResponse> {
    this.assertKey(documentKey, 'documentKey');
    const data = { url: url };
    const response = await this.http.post(`${this.endpoint}/${documentKey}/webhooks`, data);
    return response.data;
  }

  /**
   * Webhook list
   * @param documentKey - UUID of the document
   */
  async webhookList(documentKey: string): Promise<D4SignResponse> {
    this.assertKey(documentKey, 'documentKey');
    const response = await this.http.get(`${this.endpoint}/${documentKey}/webhooks`);
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
    this.assertKey(documentKey, 'documentKey');
    const data = {
      message: message,
      workflow: workflow,
      skip_email: skipEmail ? '1' : '0'
    };
    const response = await this.http.post(`${this.endpoint}/${documentKey}/sendtosigner`, data);
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
  async addInfo(documentKey: string, email: string = '', displayName: string = '', documentation: string = '', birthday: string = '', key: string = ''): Promise<D4SignResponse> {
    this.assertKey(documentKey, 'documentKey');
    const data = {
      key_signer: key,
      email: email,
      display_name: displayName,
      documentation: documentation,
      birthday: birthday
    };
    const response = await this.http.post(`${this.endpoint}/${documentKey}/addinfo`, data);
    return response.data;
  }

  /**
   * Resend the signature link to a signer
   * @param documentKey - UUID of the document
   * @param email - Email address or WhatsApp number of the signer
   * @param key - Key of the signer
   */
  async resend(documentKey: string, email: string, key: string = ''): Promise<D4SignResponse> {
    this.assertKey(documentKey, 'documentKey');
    const data = {
      email: email,
      key_signer: key
    };
    const response = await this.http.post(`${this.endpoint}/${documentKey}/resend`, data);
    return response.data;
  }

  /**
   * Get document download link (matches PHP getfileurl)
   * @param documentKey - UUID of the document
   * @param options - Optional download options (type, language, document)
   */
  async getFileUrl(documentKey: string, options: DownloadOptions = {}): Promise<D4SignResponse> {
    this.assertKey(documentKey, 'documentKey');
    const data: Record<string, string> = {};
    if (options.type) {
      data.type = options.type;
    }
    if (options.language) {
      data.language = options.language;
    }
    if (options.document) {
      data.document = options.document;
    }
    const response = await this.http.post(`${this.endpoint}/${documentKey}/download`, data);
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
  async uploadHash(uuidSafe: string, sha256: string, sha512: string, name: string, uuidFolder: string = ''): Promise<D4SignResponse> {
    this.assertKey(uuidSafe, 'uuidSafe');
    const data: Record<string, string> = {
      sha256: sha256,
      sha512: sha512,
      name: name
    };
    if (uuidFolder) {
      data.uuid_folder = uuidFolder;
    }
    const response = await this.http.post(`${this.endpoint}/${uuidSafe}/uploadhash`, data);
    return response.data;
  }

  /**
   * Get document details (matches PHP find with documentKey)
   * @param documentUuid - UUID of the document
   */
  async getDocument(documentUuid: string): Promise<Document> {
    this.assertKey(documentUuid, 'documentUuid');
    const response = await this.http.get(`${this.endpoint}/${documentUuid}`);
    return response.data;
  }
}
