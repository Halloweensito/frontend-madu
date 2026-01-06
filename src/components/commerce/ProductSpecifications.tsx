import React from 'react';
import type { ProductVariantResponse } from '../../types/types';

interface ProductSpecificationsProps {
  variant: ProductVariantResponse | null;
}

export const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ variant }) => {
  if (!variant?.attributeValues || variant.attributeValues.length === 0) {
    return null;
  }

  return (
    <div className="pt-6 border-t border-stone-200">
      <h3 className="text-sm font-medium text-stone-900 uppercase tracking-wider mb-3">
        Especificaciones
      </h3>
      <dl className="space-y-2 text-sm">
        {variant.attributeValues.map((attrValue) => (
          <div key={attrValue.id} className="flex justify-between">
            <dt className="text-stone-600 capitalize">{attrValue.attribute.name}:</dt>
            <dd className="text-stone-900 font-medium">{attrValue.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
