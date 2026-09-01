/**
 * Common types for D4Sign API
 */

/**
 * Generic response returned by most D4Sign write endpoints.
 *
 * The API returns plain JSON objects (usually with a `message` field);
 * extra fields vary per endpoint, e.g. `uuid` after an upload.
 */
export interface D4SignResponse {
  message?: string;
  [key: string]: any;
}

/**
 * Account information from GET /account.
 * The API returns a flat JSON object; fields vary per account/plan.
 */
export interface Account {
  [key: string]: any;
}

/**
 * Document as returned by GET /documents and GET /documents/{uuid}
 */
export interface Document {
  uuidDoc?: string;
  nameDoc?: string;
  type?: string;
  size?: string;
  pages?: string;
  uuidSafe?: string;
  safeName?: string;
  statusId?: string;
  statusName?: string;
  statusComment?: string;
  whoCanceled?: string;
  [key: string]: any;
}

/**
 * Signer entry accepted by POST /documents/{uuid}/createlist.
 *
 * `email`, `act` and `foreign` are required by the API; the remaining
 * fields enable optional authentication/signature features.
 */
export interface Signer {
  email: string;
  act: string;
  foreign: string;
  certificadoicpbr?: string;
  assinatura_presencial?: string;
  docauth?: string;
  docauthandselfie?: string;
  embed_methodauth?: string;
  embed_smsnumber?: string;
  upload_allow?: string;
  upload_obs?: string;
  whatsapp_number?: string;
  uuid_grupo?: string;
  certificadoicpbr_tipo?: string;
  certificadoicpbr_cpf?: string;
  certificadoicpbr_cnpj?: string;
  password_code?: string;
  auth_pix?: string;
  auth_pix_nome?: string;
  auth_pix_cpf?: string;
  videoselfie?: string;
  d4sign_score?: string;
  d4sign_score_nome?: string;
  d4sign_score_cpf?: string;
  d4sign_score_similarity?: string;
  foreign_lang?: string;
  [key: string]: any;
}

/**
 * Webhook registered on a document
 */
export interface Webhook {
  url: string;
  [key: string]: any;
}

/**
 * Options for POST /documents/{uuid}/download — all fields are optional
 */
export interface DownloadOptions {
  /** File type, e.g. 'pdf' or 'zip' */
  type?: string;
  /** Language of the signature page, e.g. 'pt' or 'en' */
  language?: string;
  /** Set to '1' to download only the document without the certificate page */
  document?: string;
}
