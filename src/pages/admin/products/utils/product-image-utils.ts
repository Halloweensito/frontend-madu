import type { ImageRequest, ProductVariantRequest } from "@/types/types";
import { logger } from "@/utils/logger";

// Merge form images with previews, deduplicating by url then by position.
export function mergeImages(
  formImages: ImageRequest[] = [],
  previews: ImageRequest[] = []
): ImageRequest[] {
  const imageMap = new Map<string, ImageRequest>();

  formImages.forEach((img) => {
    if (img.url) imageMap.set(`url:${img.url}`, img);
    else if (img.position !== undefined) imageMap.set(`pos:${img.position}`, img);
  });

  previews.forEach((preview) => {
    if (preview.url && !imageMap.has(`url:${preview.url}`)) {
      imageMap.set(`url:${preview.url}`, preview);
    } else if (preview.position !== undefined && !imageMap.has(`pos:${preview.position}`)) {
      imageMap.set(`pos:${preview.position}`, preview);
    }
  });

  const merged = Array.from(imageMap.values()).map((img, idx) => ({
    ...img,
    position: img.position ?? idx,
  }));

  return merged.sort((a, b) => (a.position || 0) - (b.position || 0));
}

// Update variants so their `image` references point to the uploaded/returned images
export function mapVariantsWithFinalImages(
  variants: ProductVariantRequest[] = [],
  finalImages: ImageRequest[] = []
): ProductVariantRequest[] {
  logger.debug('🔍 mapVariantsWithFinalImages - Input variants:', variants);
  logger.debug('🔍 mapVariantsWithFinalImages - Final images:', finalImages);

  const result = variants.map((variant) => {
    if (!variant.image) return variant;

    const imgRef = variant.image;
    logger.debug('🔍 Processing variant image:', {
      url: imgRef.url,
      tempId: imgRef.tempId,
      position: imgRef.position
    });

    // 🔍 Buscar por tempId primero (para imágenes nuevas que se acaban de subir)
    let updatedImage = finalImages.find((fi) => {
      const match = fi.tempId === imgRef.tempId && imgRef.tempId;
      logger.debug(`  Checking tempId match: ${fi.tempId} === ${imgRef.tempId} = ${match}`);
      return match;
    });

    // Si no encontramos por tempId, buscar por URL exacta
    if (!updatedImage) {
      updatedImage = finalImages.find((fi) => fi.url === imgRef.url);
      if (updatedImage) logger.debug('  ✅ Found by URL:', updatedImage.url);
    } else {
      logger.debug('  ✅ Found by tempId:', updatedImage.tempId);
    }

    // Si aún no encontramos, buscar por position
    if (!updatedImage && imgRef.position !== undefined) {
      updatedImage = finalImages.find((fi) => fi.position === imgRef.position);
      if (updatedImage) logger.debug('  ✅ Found by position:', updatedImage.position);
    }

    if (updatedImage && updatedImage.id) {
      const result = {
        ...variant,
        image: {
          id: updatedImage.id,
          url: updatedImage.url,
          position: updatedImage.position,
          tempId: updatedImage.tempId,
        },
      };
      logger.debug('  Result (with ID):', result.image);
      return result;
    }

    if (updatedImage) {
      const result = {
        ...variant,
        image: {
          ...imgRef,
          url: updatedImage.url,
          tempId: updatedImage.tempId,
        },
      };
      logger.debug('  Result (no ID):', result.image);
      return result;
    }

    logger.debug('  ❌ No updated image found, keeping original');
    return variant;
  });

  logger.debug('🔍 mapVariantsWithFinalImages - Output variants:', result);
  return result;
}
