import loginSchema from '@storify/common/src/schemas/loginSchema';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import toast from 'react-hot-toast';
import InputField from '../../components/InputField';
import Page from '../../components/Page';
import { useLoginMutation } from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';
import toErrorMap from '../../utils/toErrorMap';

interface FormValues {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Page title="Login | Storify">
      <Formik<FormValues>
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const res = await login(values);
          if (res.data?.login.errors) {
            setErrors(toErrorMap(res.data.login.errors));
          } else {
            toast.success('Logged in!');

            setTimeout(() => {
              router.push('/');
            }, 700);
          }
        }}
        validationSchema={loginSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="email" name="email" />
            <InputField label="password" name="password" type="password" />

            <Link href="/forgot-password">Forgot password?</Link>
            <button
              style={{ marginLeft: '1rem' }}
              disabled={isSubmitting}
              className="btn btn-blue"
              type="submit"
            >
              {isSubmitting ? 'submitting..' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(Login);
