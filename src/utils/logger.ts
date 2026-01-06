// src/utils/logger.ts

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface Logger {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

/**
 * Sanitiza datos sensibles antes de loguear
 * Remueve tokens, passwords, y otros datos confidenciales
 */
const sanitize = (data: unknown): unknown => {
  if (typeof data === 'string') {
    // Ocultar tokens JWT
    return data.replace(/eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g, '[JWT_TOKEN]');
  }

  if (data && typeof data === 'object') {
    const sanitized: Record<string, unknown> = {};
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'authorization'];

    for (const [key, value] of Object.entries(data)) {
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitize(value);
      }
    }
    return sanitized;
  }

  return data;
};

/**
 * Envía errores a Sentry en producción
 * Requiere: npm install @sentry/react
 */
const sendToSentry = (level: LogLevel, ...args: unknown[]) => {
  if (!isProd) return;

  try {
    // Lazy import de Sentry (solo si está instalado)
    // @ts-ignore - Sentry puede no estar instalado aún
    if (window.Sentry) {
      const sanitizedArgs = args.map(sanitize);

      if (level === 'error') {
        // @ts-ignore
        window.Sentry.captureException(sanitizedArgs[0]);
      } else if (level === 'warn') {
        // @ts-ignore
        window.Sentry.captureMessage(String(sanitizedArgs[0]), 'warning');
      }
    }
  } catch (e) {
    // Silenciar errores de Sentry para no romper la app
  }
};

const createLogger = (): Logger => {
  const shouldLog = (level: LogLevel): boolean => {
    // En producción, solo loguear errores
    if (isProd) return level === 'error';
    // En desarrollo, loguear todo
    return isDev;
  };

  return {
    log: (...args: unknown[]) => {
      if (shouldLog('log')) {
        console.log(...args);
      }
    },

    info: (...args: unknown[]) => {
      if (shouldLog('info')) {
        console.info(...args);
      }
    },

    warn: (...args: unknown[]) => {
      if (shouldLog('warn')) {
        console.warn(...args);
      }
      sendToSentry('warn', ...args);
    },

    error: (...args: unknown[]) => {
      // Sanitizar antes de loguear
      const sanitizedArgs = args.map(sanitize);

      if (isProd) {
        // En producción, solo mostrar mensaje genérico
        console.error('Ha ocurrido un error. Por favor, contacta soporte.');
      } else {
        // En desarrollo, mostrar detalles completos
        console.error(...sanitizedArgs);
      }

      // Enviar a Sentry en producción
      sendToSentry('error', ...args);
    },

    debug: (...args: unknown[]) => {
      if (shouldLog('debug')) {
        console.debug(...args);
      }
    },
  };
};

export const logger = createLogger();
