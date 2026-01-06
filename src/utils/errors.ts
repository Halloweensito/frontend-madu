// src/utils/errors.ts

export class ApiError extends Error {
  status: number;
  statusText: string;
  endpoint: string;
  method: string;

  constructor(
    status: number,
    statusText: string,
    message: string,
    endpoint: string,
    method: string = 'GET'
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.endpoint = endpoint;
    this.method = method;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  toString(): string {
    return `${this.name} [${this.status}]: ${this.message} (${this.method} ${this.endpoint})`;
  }
}

export class ValidationError extends Error {
  field?: string;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    field?: string,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.errors = errors;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

export class ImageUploadError extends Error {
  fileName?: string;
  fileSize?: number;

  constructor(
    message: string,
    fileName?: string,
    fileSize?: number
  ) {
    super(message);
    this.name = 'ImageUploadError';
    this.fileName = fileName;
    this.fileSize = fileSize;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ImageUploadError);
    }
  }
}

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
};

export const isImageUploadError = (error: unknown): error is ImageUploadError => {
  return error instanceof ImageUploadError;
};

