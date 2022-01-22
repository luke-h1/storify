import { Button, Text } from '@ui-kitten/components';
import { Formik } from 'formik';
import { View } from 'react-native';
import Center from '../../components/Center';
import FormSpacer from '../../components/FormSpacer';
import KeyboardAwareScrollView from '../../components/KeyboardAwareScrollView';
import ScreenWrapper from '../../components/ScreenWrapper';
import TextField from '../../components/form/TextField';
import { useLoginMutation } from '../../generated/graphql';
import toErrorMap from '../../utils/toErrorMap';
import { AuthStackNav } from './AuthNav';

interface FormValues {
  email: string;
  password: string;
}

const LoginScreen = ({ navigation }: AuthStackNav<'Login'>) => {
  const [, login] = useLoginMutation();
  return (
    <ScreenWrapper>
      <View style={{ padding: 31, flex: 1 }}>
        <Center>
          <Text style={{ fontSize: 26 }}>Register</Text>
        </Center>
      </View>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Formik<FormValues>
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={async (values, { setErrors }) => {
            const res = await login({
              email: values.email,
              password: values.password,
            });
            if (res.data?.login.errors) {
              setErrors(toErrorMap(res.data.login.errors));
            }
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <FormSpacer>
                <TextField
                  label="email"
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  name="email"
                />
              </FormSpacer>
              <FormSpacer>
                <TextField
                  label="password"
                  textContentType="password"
                  autoCapitalize="none"
                  name="password"
                />
                <Button
                  disabled={isSubmitting}
                  onPress={() => handleSubmit()}
                  status="primary"
                >
                  Login
                </Button>
              </FormSpacer>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};
export default LoginScreen;
