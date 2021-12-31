import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-hot-toast';
import InputField from '../../components/InputField';
import { useRegisterMutation } from '../../generated/graphql';
import styles from '../../styles/forms.module.scss';
import { createurqlClient } from '../../utils/createUrqlClient';
import toErrorMap from '../../utils/toErrorMap';

interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const Register = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <div className={styles.container}>
      <Formik<FormValues>
        initialValues={{
          email: '',
          password: '',
          firstName: '',
          lastName: '',
        }}
        onSubmit={async (values, { setErrors }) => {
          const res = await register({
            options: {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              password: values.password,
            },
          });

          if (res.data?.register.errors) {
            setErrors(toErrorMap(res.data.register.errors));
          } else {
            toast.success('Succesfully registered!');
            setTimeout(() => {
              router.push('/');
            }, 700);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={styles.form}>
              <InputField label="First Name" name="firstName" />
              <InputField label="Last Name" name="lastName" />

              <InputField label="email" name="email" />
              <InputField label="password" name="password" type="password" />

              <button
                style={{ marginLeft: '1rem' }}
                disabled={isSubmitting}
                className="btn submit"
                type="submit"
              >
                {isSubmitting ? 'submitting..' : 'Add product'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(Register);
