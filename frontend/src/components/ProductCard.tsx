import React, { useState } from 'react';
import { Product, GoldColor } from '../services/api';
import StarRating from './StarRating';
import ColorPicker from './ColorPicker';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const [selectedColor, setSelectedColor] = useState<GoldColor>('yellow');

  const getMaterialName = (color: GoldColor): string => {
    switch (color) {
      case 'yellow':
        return 'Yellow Gold';
      case 'white':
        return 'White Gold';
      case 'rose':
        return 'Rose Gold';
      default:
        return 'Yellow Gold';
    }
  };

  const getCurrentImage = (): string => {
    return product.images[selectedColor];
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={getCurrentImage()}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback image if the product image fails to load
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x300?text=Product+Image';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Title */}
        <h3 className="font-montserrat font-medium text-gray-900 text-sm mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <span className="font-montserrat font-medium text-gray-900 text-sm">
            ${product.calculatedPrice.toFixed(2)} USD
          </span>
        </div>

        {/* Color Picker */}
        <div className="mb-3">
          <ColorPicker
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            size="sm"
          />
        </div>

        {/* Material */}
        <div className="mb-3">
          <span className="font-avenir text-gray-600 text-xs">
            {getMaterialName(selectedColor)}
          </span>
        </div>

        {/* Star Rating */}
        <div className="flex items-center justify-between">
          <StarRating
            rating={product.popularityRating}
            size="sm"
            showText={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
