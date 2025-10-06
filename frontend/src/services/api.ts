import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://shopping-site-3.onrender.com/api' 
  : 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export type GoldColor = 'yellow' | 'white' | 'rose';

export interface Product {
  id: number;
  name: string;
  popularityScore: number;
  popularityRating: number;
  weight: number;
  price: number;
  calculatedPrice: number;
  dateAdded?: string;
  isNew?: boolean;
  images: {
    yellow: string;
    rose: string;
    white: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GoldPriceResponse {
  price: number;
  currency: string;
  lastUpdated: string;
}

// Product API functions
export const productApi = {
  // Get all products with optional filtering
  getProducts: async (params?: {
    minPrice?: number;
    maxPrice?: number;
    minPopularity?: number;
    maxPopularity?: number;
    minWeight?: number;
    maxWeight?: number;
    page?: number;
    limit?: number;
  }): Promise<ProductsResponse> => {
    const response = await api.get<ApiResponse<ProductsResponse>>('/products', { params });
    return response.data.data;
  },

  // Get product by ID or search by name
  getProductById: async (id: string | number): Promise<Product | Product[]> => {
    const response = await api.get<ApiResponse<Product | Product[]>>(`/products/${id}`);
    return response.data.data;
  },

  // Get sorted products
  getSortedProducts: async (sortType: 'price_high_to_low' | 'price_low_to_high' | 'most_popular' | 'new'): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>('/products/sort', {
      params: { sortType }
    });
    return response.data.data;
  },

  // Get gold price
  getGoldPrice: async (): Promise<GoldPriceResponse> => {
    const response = await api.get<ApiResponse<GoldPriceResponse>>('/gold-price');
    return response.data.data;
  },
};

export default api;
