import { Product, ProductResponse, Review } from '../../types';
import storifyApi from './Client';


const productService = {
  create: async (): Promise<Product> => {
    const { data } = await storifyApi.post('/api/products', {})
    return data;
  },
  update: async (product: Product): Promise<Product | { message: string }> => {
    const { data } = await storifyApi.put(`/api/products/${product._id}`)
    return data;
  },
  list: async (keyword: string, pageNumber: string): Promise<ProductResponse> => {
    const { data } = await storifyApi.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`)
    return data;
  },
  listDetails: async (id: string): Promise<Product> => {
    const { data } = await storifyApi.get(`/api/products/${id}`)
    return data;
  },
  delete: async (id: string): Promise<{message: string}> => {
    const { data } = await storifyApi.delete(`/api/products/${id}`)
    return data;
  },
  createReview: async (productId: string, review: Review): Promise<{ message: string }> => {
    const { data } = await storifyApi.post(`/api/products/${productId}/reviews`, review)
    return data;
  },
  listTop: async (): Promise<Product[]> => {
    const { data } = await storifyApi.get(`/api/products/top`)
    return data;
  }
}

export default productService;
