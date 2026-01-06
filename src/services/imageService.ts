// services/imageService.ts
import { supabase } from "@/lib/supabase";

const STORAGE_BUCKET = "product-images"; // Nombre del bucket en Supabase Storage

/**
 * Verifica que el usuario esté autenticado como administrador
 * @throws Error si el usuario no está autenticado o no es admin
 */
async function verifyAdminAuth(): Promise<void> {
  try {
    // Verificar sesión activa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Error al verificar sesión: ${sessionError.message}`);
    }

    if (!session) {
      throw new Error("Debes estar autenticado como administrador para subir imágenes");
    }

    // Verificar que el usuario tenga rol de administrador
    // Nota: Ajusta esto según tu sistema de roles en Supabase
    const userRole = session.user.user_metadata?.role || session.user.app_metadata?.role;
    
    // Si hay un sistema de roles configurado, verificar que sea admin
    // Si no hay roles configurados, al menos verificar que esté autenticado
    // Las políticas RLS en Supabase Storage también deben estar configuradas
    if (userRole && userRole !== "admin" && userRole !== "administrator") {
      throw new Error("No tienes permisos de administrador para subir imágenes");
    }
    
    // Si no hay rol configurado pero hay sesión, permitir (con advertencia)
    // En producción, siempre deberías tener un sistema de roles
    if (!userRole) {
      console.warn("⚠️ Usuario autenticado pero sin rol asignado. Se permite la subida, pero se recomienda configurar roles en producción.");
    }
  } catch (error) {
    console.error("Error en verifyAdminAuth:", error);
    throw error;
  }
}

/**
 * Sube una imagen a Supabase Storage (solo para administradores)
 * @param file - Archivo de imagen a subir
 * @param folder - Carpeta donde guardar la imagen (opcional, por defecto "products")
 * @returns URL pública de la imagen subida
 */
export async function uploadImage(
  file: File,
  folder: string = "products"
): Promise<string> {
  try {
    // ✅ Verificar que el usuario sea administrador
    await verifyAdminAuth();

    // Generar nombre único para el archivo
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Obtener sesión para usar el token de autenticación
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("No hay sesión activa. Debes estar autenticado como administrador.");
    }

    // Subir archivo a Supabase Storage con autenticación
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Error al subir imagen: ${error.message}`);
    }

    // Obtener URL pública de la imagen
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
      throw new Error("No se pudo obtener la URL pública de la imagen");
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error en uploadImage:", error);
    throw error;
  }
}

/**
 * Sube múltiples imágenes a Supabase Storage
 * @param files - Array de archivos de imagen a subir
 * @param folder - Carpeta donde guardar las imágenes (opcional)
 * @returns Array de URLs públicas de las imágenes subidas
 */
export async function uploadMultipleImages(
  files: File[],
  folder: string = "products"
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error en uploadMultipleImages:", error);
    throw error;
  }
}

/**
 * Elimina una imagen de Supabase Storage (solo para administradores)
 * @param imageUrl - URL completa de la imagen a eliminar
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // ✅ Verificar que el usuario sea administrador
    await verifyAdminAuth();

    // Extraer el path del archivo desde la URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/");
    const bucketIndex = pathParts.indexOf(STORAGE_BUCKET);
    
    if (bucketIndex === -1) {
      throw new Error("URL de imagen inválida");
    }

    const filePath = pathParts.slice(bucketIndex + 1).join("/");

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      throw new Error(`Error al eliminar imagen: ${error.message}`);
    }
  } catch (error) {
    console.error("Error en deleteImage:", error);
    throw error;
  }
}

