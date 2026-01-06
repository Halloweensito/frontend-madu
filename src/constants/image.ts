// src/constants/image.ts

export const IMAGE_UPLOAD_CONFIG = {
  MAX_SIZE_MB: 1,
  MAX_DIMENSION: 1920,
  MAX_UPLOAD_ATTEMPTS: 150,
  POLL_INTERVAL_MS: 200,
  DEFAULT_MAX_IMAGES: 10,
  DRAG_ACTIVATION_DISTANCE: 5,
} as const;

export const IMAGE_FORMATS = {
  VALID_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ACCEPT_STRING: 'image/jpeg,image/jpg,image/png,image/webp',
} as const;

export const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB,
  maxWidthOrHeight: IMAGE_UPLOAD_CONFIG.MAX_DIMENSION,
  useWebWorker: true,
  fileType: undefined,
} as const;

