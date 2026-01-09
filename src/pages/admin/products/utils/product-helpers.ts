// utils/productMapper.ts - VERSIÓN ACTUALIZADA CON POSITION

import type {
  CreateProductRequest,
  ProductFormData,
  ProductResponse,
  ProductVariantRequest,
  AttributeConfig,
  ImageRequest,
  ProductVariantResponse,
  AttributeValueResponse,
} from "@/types/types";
import { logger } from "@/utils/logger";
import { validateProductResponse } from "@/schemas/validation";
import { ValidationError } from "@/utils/errors";

export const defaultProductValues: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  categoryId: 0,
  defaultPrice: 0,
  defaultStock: 0,
  images: [],
  attributesConfig: [],
  variants: [],
  status: 'ACTIVE',
};

export const mapProductToFormData = (product: ProductResponse | null | undefined): ProductFormData => {
  if (!product) return defaultProductValues;

  const validationResult = validateProductResponse(product);
  if (!validationResult.success) {
    logger.error('Invalid product data:', validationResult.error);
    throw new ValidationError('Datos de producto inválidos', undefined, validationResult.error.flatten().fieldErrors);
  }

  // Extraer imágenes generales
  let productImages: ImageRequest[] = [];

  if (product.images && product.images.length > 0) {
    productImages = product.images.map((img) => ({
      id: img.id,
      url: img.url,
      position: img.position ?? 0,
    }));
  } else {
    productImages = extractImagesFromVariants(product.variants || []);
  }

  const formVariants = convertVariantsToFormVariants(product.variants || [], productImages);

  const attributesConfig = convertVariantsToAttributeConfig(product.variants || []);

  const defaultPrice = product.variants?.[0]?.price ?? product.price ?? 0;
  const defaultStock = product.variants?.[0]?.stock ?? product.stock ?? 0;
  const categoryId = product.category?.id ?? 0;

  logger.debug('Product mapped to form data:', {
    productId: product.id,
    variantsCount: product.variants?.length || 0,
    imagesCount: productImages.length,
    hasProductImages: !!(product.images && product.images.length > 0),
  });

  return {
    name: product.name || "",
    slug: product.slug || "",
    description: product.description || "",
    categoryId,
    defaultPrice,
    defaultStock,
    images: productImages,
    attributesConfig,
    variants: formVariants,
    status: (['ACTIVE', 'INACTIVE', 'ARCHIVED'].includes(product.status as string)
      ? product.status
      : 'ACTIVE') as any,
  };
};

export const mapFormToPayload = (
  data: ProductFormData,
  uploadedImages: ImageRequest[]
): CreateProductRequest => {



  const variants = (data.variants && data.variants.length > 0) ? data.variants.map((variant) => {
    const isDefaultVariant = !variant.attributeValueIds || variant.attributeValueIds.length === 0;

    let selectedImageIds: number[] | undefined = undefined;
    let selectedImageTempIds: string[] | undefined = undefined;

    if (!isDefaultVariant && variant.image) {
      const allImages = [...uploadedImages, ...(data.images || [])];

      const generalImage = allImages.find(img => img.url === variant.image?.url);

      if (generalImage?.id) {
        selectedImageIds = [generalImage.id];
      } else if (generalImage?.tempId) {
        selectedImageTempIds = [generalImage.tempId];
      } else if (variant.image.id) {
        selectedImageIds = [variant.image.id];
      }
    }

    return {
      ...(variant.id && { id: variant.id }),
      ...(variant.sku && { sku: variant.sku }),
      price: variant.price,
      stock: variant.stock,
      attributeValueIds: variant.attributeValueIds,
      ...(selectedImageIds && { selectedImageIds }),
      ...(selectedImageTempIds && { selectedImageTempIds }),
    };
  }) : undefined;



  return {
    name: data.name,
    slug: data.slug || undefined,
    description: data.description || undefined,
    categoryId: data.categoryId,
    status: data.status || 'ACTIVE',
    generalImages: uploadedImages, // Siempre enviar array (vacío si no hay imágenes)
    price: data.defaultPrice ?? 0,
    stock: data.defaultStock ?? 0,
    variants,
  };
};

const extractImagesFromVariants = (variants: ProductVariantResponse[] = []): ImageRequest[] => {
  if (variants.length === 0) {
    return [];
  }

  if (variants.length === 1) {
    const images = variants[0].images || [];
    return images.map((img, index) => ({
      id: img.id,
      url: img.url,
      position: index,
    }));
  }

  const imageUrlCount = new Map<string, number>();
  const imageUrlToFirstPosition = new Map<string, number>();
  const imageUrlToId = new Map<string, number>();

  variants.forEach((variant) => {
    if (variant.images && Array.isArray(variant.images)) {
      const variantImageUrls = new Set<string>();
      variant.images.forEach((img, imgIndex) => {
        if (img.url) {
          const urlKey = img.url.trim();
          if (!variantImageUrls.has(urlKey)) {
            variantImageUrls.add(urlKey);
            const count = imageUrlCount.get(urlKey) || 0;
            imageUrlCount.set(urlKey, count + 1);
            if (!imageUrlToFirstPosition.has(urlKey)) {
              imageUrlToFirstPosition.set(urlKey, imgIndex);
              if (img.id) {
                imageUrlToId.set(urlKey, img.id);
              }
            }
          }
        }
      });
    }
  });

  const totalVariants = variants.length;
  const generalImageUrls: string[] = [];

  imageUrlCount.forEach((count, url) => {
    if (count === totalVariants) {
      generalImageUrls.push(url);
    }
  });

  return generalImageUrls
    .sort((a, b) => {
      const posA = imageUrlToFirstPosition.get(a) || 0;
      const posB = imageUrlToFirstPosition.get(b) || 0;
      return posA - posB;
    })
    .map((url, index) => ({
      id: imageUrlToId.get(url),
      url,
      position: index,
    }));
};

// 👇 ACTUALIZADO: Ahora extrae y preserva position
const convertVariantsToAttributeConfig = (variants: ProductVariantResponse[]): AttributeConfig[] => {
  if (!variants || variants.length === 0) return [];

  const attributeMap = new Map<number, {
    attributeId: number;
    attributeName: string;
    position: number; // 👈 NUEVO
    values: Map<number, {
      id: number;
      value: string;
      slug: string;
      hexColor?: string;
      position?: number; // 👈 NUEVO
    }>;
  }>();

  variants.forEach((variant) => {
    if (!variant.attributeValues) return;

    variant.attributeValues.forEach((attrValue: AttributeValueResponse, index) => {
      if (!attrValue || !attrValue.attribute) return;



      const attrId = attrValue.attribute.id;
      const attrName = attrValue.attribute.name || `Atributo ${attrId}`;
      const valueId = attrValue.id;

      if (!attributeMap.has(attrId)) {
        attributeMap.set(attrId, {
          attributeId: attrId,
          attributeName: attrName,
          position: attrValue.attribute.position ?? index, // 👈 Usar position del backend o índice
          values: new Map(),
        });
      }

      const attrConfig = attributeMap.get(attrId)!;
      if (!attrConfig.values.has(valueId)) {
        attrConfig.values.set(valueId, {
          id: valueId,
          value: attrValue.value || attrValue.slug || `Valor ${valueId}`,
          slug: attrValue.slug || attrValue.value?.toLowerCase().replace(/\s+/g, '-') || `valor-${valueId}`,
          hexColor: attrValue.hexColor,
          position: attrValue.position, // 👈 Preservar position del backend
        });
      }
    });
  });


  return Array.from(attributeMap.values())
    .sort((a, b) => a.position - b.position) // Ordenar bloques de atributos
    .map(attr => ({
      ...attr,
      selectedValues: Array.from(attr.values.values())
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)), // Ordenar opciones internas
    }));
};

const convertVariantsToFormVariants = (
  variants: ProductVariantResponse[],
  generalImages: ImageRequest[] = []
): ProductVariantRequest[] => {
  if (!variants || variants.length === 0) {
    return [];
  }

  const generalImagesById = new Map<number, ImageRequest>();
  const generalImagesByUrl = new Map<string, ImageRequest>();

  generalImages.forEach(img => {
    if (img.id) {
      generalImagesById.set(img.id, img);
    }
    if (img.url) {
      generalImagesByUrl.set(img.url.trim(), img);
    }
  });

  return variants.map((variant) => {
    const attributeValueIds = variant.attributeValues?.map((av) => av.id).filter((id) => id != null) || [];

    let specificImage: ImageRequest | undefined = undefined;

    if (variant.images && variant.images.length > 0) {
      const variantImage = variant.images[0];

      let foundImage: ImageRequest | undefined = undefined;
      if (variantImage.id) {
        foundImage = generalImagesById.get(variantImage.id);
      }

      if (!foundImage && variantImage.url) {
        foundImage = generalImagesByUrl.get(variantImage.url.trim());
      }

      if (foundImage) {
        specificImage = {
          id: foundImage.id,
          url: foundImage.url,
          position: foundImage.position ?? 0,
        };
        logger.debug(`✅ Variante ${variant.id} tiene imagen seleccionada: ${foundImage.url} (ID: ${foundImage.id})`);
      } else {
        specificImage = {
          id: variantImage.id,
          url: variantImage.url,
          position: variantImage.position ?? 0,
        };
        logger.warn(`⚠️ Imagen de variante ${variant.id} no encontrada en generalImages.`);
      }
    }



    return {
      id: variant.id,
      ...(variant.sku && variant.sku.trim() !== "" && { sku: variant.sku }),
      price: variant.price ?? 0,
      stock: variant.stock ?? 0,
      attributeValueIds,
      image: specificImage,
    };
  });
};