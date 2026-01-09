// src/constants/image.ts

export const IMAGE_UPLOAD_CONFIG = {
  // Aumentamos a 3MB para evitar que la compresión falle en fotos grandes
  MAX_SIZE_MB: 3, 
  MAX_DIMENSION: 1920,
  MAX_UPLOAD_ATTEMPTS: 3, // 150 es excesivo, si falla 3 veces, es error real
  POLL_INTERVAL_MS: 200,
  DEFAULT_MAX_IMAGES: 10,
  DRAG_ACTIVATION_DISTANCE: 5,
} as const;

export const IMAGE_FORMATS = {
  // Nota: HEIC se puede subir, pero recuerda que el navegador no lo previsualiza nativamente
  VALID_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  ACCEPT_STRING: 'image/*',
} as const;

export const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB,
  maxWidthOrHeight: IMAGE_UPLOAD_CONFIG.MAX_DIMENSION,
  
  // IMPORTANTE: Activa esto para que el celular no se congele mientras comprime
  useWebWorker: true, 
  
  // Esto es correcto, convierte todo a JPEG para compatibilidad
  fileType: 'image/jpeg' as const,
  initialQuality: 0.80, // Bajamos un poco la calidad inicial para asegurar tamaño
} as const;