import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import InputField from '../../components/InputField';
import Page from '../../components/Page';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createurqlClient } from '../../utils/createUrqlClient';
import toErrorMap from '../../utils/toErrorMap';

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState<string>('');

  return (
    <Page title="Change password | Storify" description="Change password">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === 'string' ? router.query.token : '',
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data?.changePassword.errors);
            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="new password"
              type="password"
            />
            <button className="btn" type="submit" disabled={isSubmitting}>
              Change password
            </button>
            {tokenError && (
              <div className="flex">
                <p>{tokenError}</p>
                <div>
                  <Link href="/forgot-password">
                    <a>Click here to get a new password</a>
                  </Link>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </Page>
  );
};
export default withUrqlClient(createurqlClient, { ssr: false })(ChangePassword);
