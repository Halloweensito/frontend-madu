import React from 'react';

interface ProductAttributeSelectorProps {
  attributeKey: string;
  values: string[];
  currentValue: string | undefined;
  isAvailable: (value: string) => boolean;
  onSelect: (value: string) => void;
}

export const ProductAttributeSelector: React.FC<ProductAttributeSelectorProps> = ({
  attributeKey,
  values,
  currentValue,
  isAvailable,
  onSelect,
}) => {
  return (
    <div>
      <div className="flex justify-between mb-3">
        <span className="text-sm font-medium text-stone-900 uppercase tracking-wider">
          {attributeKey}
        </span>
        {currentValue && (
          <span className="text-sm text-stone-600 capitalize">
            {currentValue}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {values.map((value) => {
          const isSelected = currentValue === value;
          const available = isAvailable(value);
          
          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className={`
                relative px-4 py-2 text-sm border min-w-12 transition-all duration-200
                ${isSelected 
                  ? 'border-stone-900 bg-stone-900 text-white' 
                  : available
                  ? 'border-stone-200 text-stone-900 hover:border-stone-900'
                  : 'border-stone-200 text-stone-400 hover:border-stone-300'
                }
              `}
            >
              {value}
              
            </button>
          );
        })}
      </div>
    </div>
  );
};
