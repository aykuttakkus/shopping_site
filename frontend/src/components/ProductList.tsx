import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productApi, Product } from '../services/api';
import ProductCard from './ProductCard';

interface ProductListProps {
  className?: string;
}

const ProductList: React.FC<ProductListProps> = ({ className = '' }) => {
  const [sortType, setSortType] = useState<'price_high_to_low' | 'price_low_to_high' | 'most_popular'>('most_popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);

  // Fetch products with sorting
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', 'sorted', sortType],
    queryFn: () => productApi.getSortedProducts(sortType),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !searchResults, // Arama sonuçları varsa bu query'yi çalıştırma
  });

  // Arama fonksiyonu
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const result = await productApi.getProductById(searchQuery);
      // Sonuç array ise (isim araması) veya tek ürünse array'e çevir
      setSearchResults(Array.isArray(result) ? result : [result]);
    } catch (error) {
      setSearchResults([]);
    }
  };

  // Arama sonuçlarını temizle
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  // Gösterilecek ürünler
  const displayProducts = searchResults || products;

  if (isLoading && !searchResults) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  if (error && !searchResults) {
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

      {/* Search and Sort Options */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or Name..."
            className="font-avenir text-sm border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 w-64"
          />
          <button
            type="submit"
            className="font-avenir text-sm bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Search
          </button>
          {searchResults && (
            <button
              type="button"
              onClick={clearSearch}
              className="font-avenir text-sm bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Clear
            </button>
          )}
        </form>

        {/* Sort Options */}
        {!searchResults && (
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
        )}
      </div>

      {/* Search Results Info */}
      {searchResults && (
        <div className="mb-4">
          <p className="font-avenir text-sm text-gray-600">
            {searchResults.length > 0
              ? `Found ${searchResults.length} product${searchResults.length > 1 ? 's' : ''}`
              : 'No products found'}
          </p>
        </div>
      )}

      {/* Products Grid */}
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No products available</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
