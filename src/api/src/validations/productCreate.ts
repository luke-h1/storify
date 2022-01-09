import { ProductCreateInput } from '../inputs/product/ProductCreateInput';

export const validateProductCreate = (input: ProductCreateInput) => {
  if (!input.name) {
    return [
      {
        field: 'name',
        message: 'name is a required field',
      },
    ];
  }
  if (!input.image) {
    return [
      {
        field: 'image',
        message: 'image is a required field',
      },
    ];
  }
  if (!input.brand) {
    return [
      {
        field: 'brand',
        message: 'brand is a required field',
      },
    ];
  }
  if (!input.description) {
    return [
      {
        field: 'description',
        message: 'description is a required field',
      },
    ];
  }
  if (!input.price) {
    return [
      {
        field: 'price',
        message: 'price is a required field',
      },
    ];
  }
  return null;
};
