import { Product, ProductResponse, Review } from '../../types';
import storifyApi from './Client';


const productService = {
  createProduct: async (): Promise<Product> => {
    const { data } = await storifyApi.post('/api/products', {})
    return data;
  },
  updateProduct: async (product: Product): Promise<Product | { message: string }> => {
    const { data } = await storifyApi.put(`/api/products/${product._id}`)
    return data;
  },
  listProducts: async (keyword: string, pageNumber: string): Promise<ProductResponse> => {
    const { data } = await storifyApi.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`)
    return data;
  },
  listProductDetails: async (id: string): Promise<Product> => {
    const { data } = await storifyApi.get(`/api/products/${id}`)
    return data;
  },
  deleteProduct: async (id: string): Promise<{message: string}> => {
    const { data } = await storifyApi.delete(`/api/products/${id}`)
    return data;
  },
  createProductReview: async (productId: string, review: Review): Promise<{ message: string }> => {
    const { data } = await storifyApi.post(`/api/products/${productId}/reviews`, review)
    return data;
  },
  listTopProducts: async (): Promise<Product[]> => {
    const { data } = await storifyApi.get(`/api/products/top`)
    return data;
  }
}

export default productService;
