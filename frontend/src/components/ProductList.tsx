import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productApi, Product } from '../services/api';
import ProductCard from './ProductCard';
// Framer Motion removed for better performance - using CSS animations instead

interface ProductListProps {
  className?: string;
}

const ProductList: React.FC<ProductListProps> = ({ className = '' }) => {
  const [sortType, setSortType] = useState<'price_high_to_low' | 'price_low_to_high' | 'most_popular' | 'new'>('most_popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minPopularity: '',
    maxPopularity: '',
    minWeight: '',
    maxWeight: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minPopularity: '',
    maxPopularity: '',
    minWeight: '',
    maxWeight: ''
  });
  
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortDropdown]);

  // Filtre parametrelerini hazırla (appliedFilters kullan)
  const getFilterParams = () => {
    const params: any = {};
    if (appliedFilters.minPrice) params.minPrice = parseFloat(appliedFilters.minPrice);
    if (appliedFilters.maxPrice) params.maxPrice = parseFloat(appliedFilters.maxPrice);
    if (appliedFilters.minPopularity) params.minPopularity = parseFloat(appliedFilters.minPopularity);
    if (appliedFilters.maxPopularity) params.maxPopularity = parseFloat(appliedFilters.maxPopularity);
    if (appliedFilters.minWeight) params.minWeight = parseFloat(appliedFilters.minWeight);
    if (appliedFilters.maxWeight) params.maxWeight = parseFloat(appliedFilters.maxWeight);
    return params;
  };

  // Filtre aktif mi?
  const hasActiveFilters = Object.values(appliedFilters).some(value => value !== '');
  
      // Filtre uygula butonu handler - memoized
      const handleApplyFilters = useCallback(() => {
        setAppliedFilters({ ...filters });
      }, [filters]);

  // Fetch products with optional filtering
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', appliedFilters, sortType],
    queryFn: async () => {
      if (hasActiveFilters) {
        // Filtreleme varsa /api/products endpoint'ini kullan
        const response = await productApi.getProducts(getFilterParams());
        return response.products;
      } else {
        // Filtreleme yoksa sıralama endpoint'ini kullan
        return await productApi.getSortedProducts(sortType);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !searchResults, // Arama sonuçları varsa bu query'yi çalıştırma
  });

      // Arama fonksiyonu - memoized
      const handleSearch = useCallback(async (e: React.FormEvent) => {
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
      }, [searchQuery]);

  // Arama sonuçlarını temizle
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

      // Filtre değeri değişikliği için handler - memoized
      const handleFilterChange = useCallback((field: keyof typeof filters, value: string) => {
        // Boş değer veya geçerli sayı formatı kontrolü
        if (value === '' || !isNaN(Number(value))) {
          setFilters(prev => ({ ...prev, [field]: value }));
        }
      }, []);

  // Gösterilecek ürünleri sırala - memoized
  const getSortedProducts = useCallback((productsToSort: Product[]): Product[] => {
    const sorted = [...productsToSort];
    
    switch (sortType) {
      case 'price_high_to_low':
        return sorted.sort((a, b) => b.calculatedPrice - a.calculatedPrice);
      case 'price_low_to_high':
        return sorted.sort((a, b) => a.calculatedPrice - b.calculatedPrice);
      case 'most_popular':
        return sorted.sort((a, b) => b.popularityRating - a.popularityRating);
      case 'new':
        // Tüm ürünleri tarihe göre sırala (yeniden eskiye)
        return sorted.sort((a, b) => {
          const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
          const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
          return dateB - dateA;
        });
      default:
        return sorted;
    }
  }, [sortType]);

  // Gösterilecek ürünler - memoized
  const displayProducts = useMemo(() => {
    return getSortedProducts(searchResults || products);
  }, [getSortedProducts, searchResults, products]);

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

      {/* Search, Filter and Sort Options */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or Name..."
              className="font-avenir text-sm border border-gray-300 rounded-md px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-400 w-64"
            />
              <button
                type="submit"
                className="font-avenir text-sm bg-gray-700 text-white px-2 py-1.5 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 min-w-[95px] justify-center"
              >
                Search
              </button>
                {searchResults && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="font-avenir text-sm bg-gray-300 text-gray-700 px-2 py-1.5 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 min-w-[95px] justify-center"
                  >
                    Clear
                  </button>
                )}
          </form>

          {/* Sort and Filter */}
          <div className="flex items-center space-x-4">
            {/* Sort Button with Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="font-avenir text-sm bg-gray-700 text-white px-2 py-1.5 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center gap-1.5 min-w-[95px] justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  Sort By
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              
              {/* Dropdown Menu */}
              {showSortDropdown && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[180px]">
                  <button
                    onClick={() => {
                      setSortType('price_low_to_high');
                      setShowSortDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 font-avenir text-sm text-gray-700 transition-colors duration-150"
                  >
                    Lowest Price
                  </button>
                  <button
                    onClick={() => {
                      setSortType('price_high_to_low');
                      setShowSortDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 font-avenir text-sm text-gray-700 transition-colors duration-150"
                  >
                    Highest Price
                  </button>
                  <button
                    onClick={() => {
                      setSortType('most_popular');
                      setShowSortDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 font-avenir text-sm text-gray-700 transition-colors duration-150"
                  >
                    Most Popular
                  </button>
                  <button
                    onClick={() => {
                      setSortType('new');
                      setShowSortDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 font-avenir text-sm text-gray-700 transition-colors duration-150 rounded-b-md"
                  >
                    New
                  </button>
                </div>
              )}
            </div>
            
                {/* Filter Button */}
                  <button
                    onClick={() => setShowFilters(true)}
                    style={{ 
                      willChange: 'background-color',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)'
                    }}
                    className="font-avenir text-sm bg-gray-700 text-white px-2 py-1.5 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center gap-1.5 min-w-[95px] justify-center transition-colors duration-100"
                  >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="bg-yellow-gold text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {displayProducts.length}
                  </span>
                )}
              </button>
          </div>
        </div>
      </div>

      {/* Sliding Filter Panel from Right */}
      {showFilters && (
        <>
          {/* Backdrop/Overlay with CSS animation */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in filter-backdrop"
            onClick={() => setShowFilters(false)}
          />
          
          {/* Slide-in Panel from right with CSS animation */}
          <div 
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right filter-panel"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h2 className="font-montserrat font-semibold text-xl text-gray-900">Filters</h2>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                style={{ 
                  willChange: 'background-color',
                  backfaceVisibility: 'hidden'
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Panel Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Price Filters */}
              <div>
                <label className="font-montserrat font-medium text-sm text-gray-900 mb-3 block">Price Range</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Min Price ($413)"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                          className="font-avenir text-sm border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                        />
                  </div>
                  <span className="text-gray-400 font-medium">—</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Max Price ($1,115)"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="font-avenir text-sm border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* Popularity Filters */}
              <div>
                <label className="font-montserrat font-medium text-sm text-gray-900 mb-3 block">Popularity</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Min (0-5)"
                          value={filters.minPopularity}
                          onChange={(e) => handleFilterChange('minPopularity', e.target.value)}
                          className="font-avenir text-sm border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                        />
                  </div>
                  <span className="text-gray-400 font-medium">—</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Max (0-5)"
                      value={filters.maxPopularity}
                      onChange={(e) => handleFilterChange('maxPopularity', e.target.value)}
                      className="font-avenir text-sm border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* Weight Filters */}
              <div>
                <label className="font-montserrat font-medium text-sm text-gray-900 mb-3 block">Weight</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Min (1.8g)"
                          value={filters.minWeight}
                          onChange={(e) => handleFilterChange('minWeight', e.target.value)}
                          className="font-avenir text-sm border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                        />
                  </div>
                  <span className="text-gray-400 font-medium">—</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Max (5.2g)"
                      value={filters.maxWeight}
                      onChange={(e) => handleFilterChange('maxWeight', e.target.value)}
                      className="font-avenir text-sm border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Footer - Action Buttons */}
            <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-3">
              <button
                onClick={() => {
                  handleApplyFilters();
                  setShowFilters(false);
                }}
                className="w-full font-montserrat font-semibold text-base bg-gray-900 text-white px-6 py-3.5 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Apply Filters
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setFilters({
                      minPrice: '',
                      maxPrice: '',
                      minPopularity: '',
                      maxPopularity: '',
                      minWeight: '',
                      maxWeight: ''
                    });
                    setAppliedFilters({
                      minPrice: '',
                      maxPrice: '',
                      minPopularity: '',
                      maxPopularity: '',
                      minWeight: '',
                      maxWeight: ''
                    });
                  }}
                  className="w-full font-avenir text-sm bg-white text-gray-700 px-6 py-2.5 rounded-lg border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </>
      )}

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

export default memo(ProductList);
