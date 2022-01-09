import { ReviewUpdateInput } from 'src/inputs/review/ReviewUpdateInput';

export const validateReviewUpdate = (input: ReviewUpdateInput) => {
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
  if (!input.reviewId) {
    return [
      {
        field: 'title',
        message: 'reviewId is a required field',
      },
    ];
  }
  return null;
};
