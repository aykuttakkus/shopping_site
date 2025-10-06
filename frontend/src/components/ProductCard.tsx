import React, { useState, memo } from 'react';
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

  const isProductNew = (): boolean => {
    // Backend'den gelen isNew değerini kullan
    // Eğer yoksa dateAdded'a göre hesapla
    if (product.isNew !== undefined) {
      return product.isNew;
    }
    
    if (!product.dateAdded) return false;
    
    const productDate = new Date(product.dateAdded);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    return productDate >= sixMonthsAgo;
  };

  return (
    <div 
      className={`
        group relative bg-white rounded-2xl overflow-hidden
        shadow-[0_2px_8px_rgba(0,0,0,0.08)] 
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        transition-all duration-500 ease-out
        hover:-translate-y-2
        border border-gray-100
        ${className}
      `}
    >
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
      
      {/* New Badge */}
      {isProductNew() && (
        <div className="absolute top-3 right-3 z-20 bg-yellow-gold text-gray-900 px-3 py-1 rounded-full font-montserrat font-semibold text-xs shadow-lg">
          NEW
        </div>
      )}
      
      {/* Product Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Image with zoom effect on hover */}
        <img
          src={getCurrentImage()}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="p-5">
        {/* Product Title */}
        <h3 className="font-montserrat font-semibold text-gray-900 text-base mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Price with luxury styling */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="font-montserrat font-bold text-gray-500 text-xl tracking-tight">
              ${product.calculatedPrice.toFixed(2)}
            </span>
            <span className="font-avenir text-gray-400 text-sm">
              USD
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

        {/* Color Picker */}
        <div className="mb-4">
          <label className="font-avenir text-xs text-gray-600 uppercase tracking-wider mb-2 block">
            Color
          </label>
          <ColorPicker
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            size="md"
          />
        </div>

        {/* Material */}
        <div className="mb-4">
          <span className="inline-block font-avenir text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
            {getMaterialName(selectedColor)}
          </span>
        </div>

        {/* Star Rating */}
        <div className="flex items-center justify-between pt-2">
          <StarRating
            rating={product.popularityRating}
            size="sm"
            showText={true}
          />
          
          {/* View Details Button (appears on hover) */}
          <button className="
            opacity-0 group-hover:opacity-100 
            transition-all duration-300
            font-avenir text-xs text-gray-600 hover:text-gray-900
            underline underline-offset-2
          ">
            Details
          </button>
        </div>
      </div>

      {/* Corner accent (luxury touch) */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

export default memo(ProductCard);