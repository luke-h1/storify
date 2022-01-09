import { ProductUpdateInput } from '../inputs/product/ProductUpdateInput';

export const validateProductUpdate = (input: ProductUpdateInput) => {
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
  if (!input.stripeProductId) {
    return [
      {
        field: 'name',
        message: 'stripeProductId is a required field',
      },
    ];
  }
  if (!input.stripePriceId) {
    return [
      {
        field: 'name',
        message: 'stripePriceId is a required field',
      },
    ];
  }
  return null;
};
