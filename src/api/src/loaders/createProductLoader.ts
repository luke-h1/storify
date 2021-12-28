import DataLoader from 'dataloader';
import { Product } from '../entities/Product';

export const createProductLoader = () =>
  new DataLoader<number, Product>(async productIds => {
    const products = await Product.findByIds(productIds as number[]);
    const productIdToProduct: Record<number, Product> = {};
    products.forEach(p => {
      productIdToProduct[p.id] = p;
    });
    const sortedProducts = productIds.map(
      productId => productIdToProduct[productId],
    );
    return sortedProducts;
  });
