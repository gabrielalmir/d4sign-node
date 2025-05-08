/**
 * Common types for D4Sign API
 */

/**
 * Base response interface for all D4Sign API responses
 */
export interface D4SignResponse {
  message: string;
  success: boolean;
  data?: any;
}

/**
 * Account information response
 */
export interface AccountResponse extends D4SignResponse {
  data: {
    uuid: string;
    name: string;
    email: string;
    plan_name: string;
    plan_value: number;
    balance: number;
    documents_month: number;
    documents_total: number;
    emails_month: number;
    emails_total: number;
    sms_month: number;
    sms_total: number;
    whatsapp_month: number;
    whatsapp_total: number;
    safe_month: number;
    safe_total: number;
  };
}

/**
 * Document information
 */
export interface Document {
  uuid: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  folder_uuid?: string;
  signatures?: Signature[];
}

/**
 * Signature information
 */
export interface Signature {
  uuid: string;
  email: string;
  name: string;
  status: string;
  action: string;
  signed_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Document list response
 */
export interface DocumentListResponse extends D4SignResponse {
  data: Document[];
}

/**
 * Document detail response
 */
export interface DocumentDetailResponse extends D4SignResponse {
  data: Document;
}

/**
 * Webhook information
 */
export interface Webhook {
  uuid: string;
  url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Webhook list response
 */
export interface WebhookListResponse extends D4SignResponse {
  data: Webhook[];
}

/**
 * Certificate information
 */
export interface Certificate {
  uuid: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Certificate list response
 */
export interface CertificateListResponse extends D4SignResponse {
  data: Certificate[];
}
