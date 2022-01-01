import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useState } from 'react';
import InputField from '../components/InputField';
import Page from '../components/Page';
import { useForgotPasswordMutation } from '../generated/graphql';
import styles from '../styles/forms.module.scss';
import { createurqlClient } from '../utils/createUrqlClient';

const ForgotPassword = () => {
  const [complete, setComplete] = useState<Boolean>(false);
  const [, forgotPassword] = useForgotPasswordMutation();

  return (
    <Page title="Reset Password | Storify" description="reset password">
      <h1 style={{ marginBottom: '3.5rem' }}>Forgot password</h1>
      <p style={{ marginBottom: '2rem' }}>
        Enter your email in the form below to reset your password
      </p>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async values => {
          await forgotPassword({ email: values.email });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <h2>If an account with that email exists, we sent you an email</h2>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="email"
                type="email"
              />
              <button
                className="btn success"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'submitting' : 'submit'}
              </button>
            </Form>
          )
        }
      </Formik>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(ForgotPassword);
