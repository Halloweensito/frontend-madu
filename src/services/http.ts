import { ApiError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { supabase } from '@/lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || "http://192.168.1.9:8080/api";

export const http = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  // Obtener token de sesión de Supabase
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json"
  };

  const isPublic = endpoint.startsWith('/public');

  if (token && !isPublic) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Agregar Authorization header si hay token disponible
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const headers = { ...defaultHeaders, ...options.headers };
  const method = options.method || 'GET';

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      const message = await res.text();
      const error = new ApiError(
        res.status,
        res.statusText,
        message || "Error en la solicitud",
        endpoint,
        method
      );

      logger.error('API Error:', error.toString());
      throw error;
    }

    const contentType = res.headers.get("content-type");
    const contentLength = res.headers.get("content-length");

    if (res.status === 204 || contentLength === "0" || !contentType?.includes("application/json")) {
      return undefined as T;
    }

    const text = await res.text();
    if (!text || text.trim() === "") {
      return undefined as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch (parseError) {
      logger.error('JSON Parse Error:', parseError);
      return undefined as T;
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    logger.error('Network Error:', error);
    throw new ApiError(
      0,
      'Network Error',
      error instanceof Error ? error.message : 'Error de red desconocido',
      endpoint,
      method
    );
  }
};