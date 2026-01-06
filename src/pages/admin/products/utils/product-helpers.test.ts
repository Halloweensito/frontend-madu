import { describe, it, expect } from 'vitest';
import {
  defaultProductValues,
  mapProductToFormData,
  mapFormToPayload,
} from './product-helpers';
import type { ProductResponse, ProductFormData, ImageRequest } from '@/types/types';

describe('product-helpers', () => {
  describe('defaultProductValues', () => {
    it('should have correct default values', () => {
      expect(defaultProductValues).toEqual({
        name: '',
        slug: '',
        description: '',
        categoryId: 0,
        defaultPrice: 0,
        defaultStock: 0,
        images: [],
        attributesConfig: [],
        variants: [],
        status: 'ACTIVE',
      });
    });
  });

  describe('mapProductToFormData', () => {
    it('should return default values when product is null', () => {
      const result = mapProductToFormData(null);
      expect(result).toEqual(defaultProductValues);
    });

    it('should return default values when product is undefined', () => {
      const result = mapProductToFormData(undefined);
      expect(result).toEqual(defaultProductValues);
    });

    it('should map product with single variant correctly', () => {
      const mockProduct: ProductResponse = {
        id: 1,
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test Description',
        category: {
          id: 1,
          name: 'Test Category',
          slug: 'test-category',
          parentId: 0,
        },
        price: 100,
        stock: 10,
        variants: [
          {
            id: 1,
            sku: 'TEST-001',
            price: 100,
            stock: 10,
            images: [
              { id: 1, url: 'https://example.com/image1.jpg' },
              { id: 2, url: 'https://example.com/image2.jpg' },
            ],
            attributeValues: [],
          },
        ],
      };

      const result = mapProductToFormData(mockProduct);

      expect(result.name).toBe('Test Product');
      expect(result.slug).toBe('test-product');
      expect(result.description).toBe('Test Description');
      expect(result.categoryId).toBe(1);
      expect(result.defaultPrice).toBe(100);
      expect(result.defaultStock).toBe(10);
      expect(result.images).toHaveLength(2);
      expect(result.images[0].url).toBe('https://example.com/image1.jpg');
      expect(result.status).toBe('ACTIVE');
    });

    it('should extract general images from multiple variants', () => {
      const mockProduct: ProductResponse = {
        id: 1,
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test Description',
        category: {
          id: 1,
          name: 'Test Category',
          slug: 'test-category',
          parentId: 0,
        },
        price: 100,
        stock: 10,
        variants: [
          {
            id: 1,
            sku: 'TEST-001',
            price: 100,
            stock: 10,
            images: [
              { id: 1, url: 'https://example.com/general.jpg' },
              { id: 2, url: 'https://example.com/variant1.jpg' },
            ],
            attributeValues: [],
          },
          {
            id: 2,
            sku: 'TEST-002',
            price: 120,
            stock: 5,
            images: [
              { id: 1, url: 'https://example.com/general.jpg' },
              { id: 3, url: 'https://example.com/variant2.jpg' },
            ],
            attributeValues: [],
          },
        ],
      };

      const result = mapProductToFormData(mockProduct);

      expect(result.images).toHaveLength(1);
      expect(result.images[0].url).toBe('https://example.com/general.jpg');
    });

    it('should handle product with attributes', () => {
      const mockProduct: ProductResponse = {
        id: 1,
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test Description',
        category: {
          id: 1,
          name: 'Test Category',
          slug: 'test-category',
          parentId: 0,
        },
        price: 100,
        stock: 10,
        variants: [
          {
            id: 1,
            sku: 'TEST-001',
            price: 100,
            stock: 10,
            images: [],
            attributeValues: [
              {
                id: 1,
                value: 'Red',
                slug: 'red',
                hexColor: '#FF0000',
                attribute: {
                  id: 1,
                  name: 'Color',
                  slug: 'color',
                  type: 'SELECT',
                },
              },
            ],
          },
        ],
      };

      const result = mapProductToFormData(mockProduct);

      expect(result.attributesConfig).toHaveLength(1);
      expect(result.attributesConfig[0].attributeId).toBe(1);
      expect(result.attributesConfig[0].attributeName).toBe('Color');
      expect(result.attributesConfig[0].selectedValues).toHaveLength(1);
      expect(result.attributesConfig[0].selectedValues[0].value).toBe('Red');
    });
  });

  describe('mapFormToPayload', () => {
    it('should map form data to create request correctly', () => {
      const formData: ProductFormData = {
        name: 'New Product',
        slug: 'new-product',
        description: 'New Description',
        categoryId: 1,
        defaultPrice: 150,
        defaultStock: 20,
        images: [],
        attributesConfig: [],
        variants: [],
      };

      const uploadedImages: ImageRequest[] = [
        { url: 'https://example.com/uploaded1.jpg', position: 0 },
        { url: 'https://example.com/uploaded2.jpg', position: 1 },
      ];

      const result = mapFormToPayload(formData, uploadedImages);

      expect(result.name).toBe('New Product');
      expect(result.slug).toBe('new-product');
      expect(result.description).toBe('New Description');
      expect(result.categoryId).toBe(1);
      expect(result.price).toBe(150);
      expect(result.stock).toBe(20);
      expect(result.generalImages).toEqual(uploadedImages);
      expect(result.variants).toBeUndefined();
    });

    it('should map variants correctly', () => {
      const formData: ProductFormData = {
        name: 'Product with Variants',
        slug: 'product-with-variants',
        description: 'Description',
        categoryId: 1,
        defaultPrice: 100,
        defaultStock: 10,
        images: [],
        attributesConfig: [],
        variants: [
          {
            id: 1,
            sku: 'VAR-001',
            price: 100,
            stock: 10,
            attributeValueIds: [1, 2],
            image: { url: 'https://example.com/variant.jpg', position: 0 },
          },
        ],
      };

      const result = mapFormToPayload(formData, []);

      expect(result.variants).toHaveLength(1);
      expect(result.variants![0].id).toBe(1);
      expect(result.variants![0].sku).toBe('VAR-001');
      expect(result.variants![0].price).toBe(100);
      expect(result.variants![0].stock).toBe(10);
      expect(result.variants![0].attributeValueIds).toEqual([1, 2]);
      expect(result.variants![0].image).toEqual({
        url: 'https://example.com/variant.jpg',
        position: 0,
      });
    });

    it('should not include image for default variant', () => {
      const formData: ProductFormData = {
        name: 'Product',
        slug: 'product',
        description: 'Description',
        categoryId: 1,
        defaultPrice: 100,
        defaultStock: 10,
        images: [],
        attributesConfig: [],
        variants: [
          {
            price: 100,
            stock: 10,
            attributeValueIds: [],
            image: { url: 'https://example.com/variant.jpg', position: 0 },
          },
        ],
      };

      const result = mapFormToPayload(formData, []);

      expect(result.variants).toHaveLength(1);
      expect(result.variants![0].image).toBeUndefined();
    });

    it('should handle empty uploaded images', () => {
      const formData: ProductFormData = {
        name: 'Product',
        slug: 'product',
        description: 'Description',
        categoryId: 1,
        defaultPrice: 100,
        defaultStock: 10,
        images: [],
        attributesConfig: [],
        variants: [],
      };

      const result = mapFormToPayload(formData, []);

      expect(result.generalImages).toBeUndefined();
    });
  });
});

