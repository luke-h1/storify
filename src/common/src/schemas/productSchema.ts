import * as yup from 'yup';

const productSchema = yup.object({
  name: yup.string().required(),
  image: yup.string().required(),
  brand: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
});
export default productSchema;
