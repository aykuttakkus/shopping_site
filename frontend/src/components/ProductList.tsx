import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../services/api';
import ProductCarousel from './ProductCarousel';

interface ProductListProps {
  className?: string;
}

const ProductList: React.FC<ProductListProps> = ({ className = '' }) => {
  const [sortType, setSortType] = useState<'price_high_to_low' | 'price_low_to_high' | 'most_popular'>('most_popular');

  // Fetch products with sorting
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', 'sorted', sortType],
    queryFn: () => productApi.getSortedProducts(sortType),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load products</p>
          <p className="text-gray-500 text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <h1 className="font-avenir font-normal text-4xl text-gray-900 mr-4">
            Product List
          </h1>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="font-avenir text-sm text-gray-600">Sort by:</span>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as typeof sortType)}
            className="font-avenir text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="most_popular">Most Popular</option>
            <option value="price_high_to_low">Price: High to Low</option>
            <option value="price_low_to_high">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Product Carousel */}
      <ProductCarousel products={products} />

      {/* Design Specifications (as shown in the image) */}
      <div className="mt-12 pt-8 border-t border-gray-300">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          {/* Font Specifications */}
          <div className="mb-6 lg:mb-0">
            <h3 className="font-avenir font-normal text-sm text-gray-600 mb-2">Typography</h3>
            <div className="space-y-1">
              <p className="font-avenir text-sm text-gray-700">Avenir - Book - 14</p>
              <p className="font-avenir text-sm text-gray-700">Avenir - Book - 12</p>
              <p className="font-montserrat text-sm text-gray-700">Montserrat - Regular - 15</p>
              <p className="font-montserrat font-medium text-sm text-gray-700">Montserrat - Medium - 15</p>
            </div>
          </div>

          {/* Color Legend */}
          <div>
            <h3 className="font-avenir font-normal text-sm text-gray-600 mb-2">Color Palette</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-gold rounded-full border border-yellow-600"></div>
                <span className="font-avenir text-xs text-gray-700">Yellow Gold - #E6CA97</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-white-gold rounded-full border border-gray-400"></div>
                <span className="font-avenir text-xs text-gray-700">White Gold - #D9D9D9</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-rose-gold rounded-full border border-pink-400"></div>
                <span className="font-avenir text-xs text-gray-700">Rose Gold - #E1A4A9</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
