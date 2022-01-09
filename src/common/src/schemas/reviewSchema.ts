import * as yup from 'yup';

const reviewSchema = yup.object({
  title: yup.string().required().max(50),
  rating: yup.number().min(1).max(5).required(),
  comment: yup.string().required().max(255),
});
export default reviewSchema;
