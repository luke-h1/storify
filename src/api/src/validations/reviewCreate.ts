import { ReviewCreateInput } from '../inputs/review/ReviewCreateInput';

export const validateReviewCreate = (input: ReviewCreateInput) => {
  if (!input.comment) {
    return [
      {
        field: 'comment',
        message: 'Comment is a required field',
      },
    ];
  }
  if (!input.rating) {
    return [
      {
        field: 'rating',
        message: 'rating is a required field',
      },
    ];
  }
  if (!input.title) {
    return [
      {
        field: 'title',
        message: 'title is a required field',
      },
    ];
  }
  if (!input.productId) {
    return [
      {
        field: 'title',
        message: 'productId is a required field',
      },
    ];
  }
  return null;
};
