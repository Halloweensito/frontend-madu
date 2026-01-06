import React from 'react';
import { Truck, Shield } from 'lucide-react';

export const ProductExtraInfo: React.FC = () => {
  return (
    <div className="pt-6 border-t border-stone-200 space-y-4">
      <div className="flex gap-3 text-sm text-stone-600">
        <Truck className="w-5 h-5 flex-shrink-0" />
        <span>Envío gratis en compras superiores a $50.000</span>
      </div>
      <div className="flex gap-3 text-sm text-stone-600">
        <Shield className="w-5 h-5 flex-shrink-0" />
        <span>Garantía de devolución de 30 días</span>
      </div>
    </div>
  );
};
