import * as yup from 'yup';

const registerSchema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required().min(7),
});
export default registerSchema;
