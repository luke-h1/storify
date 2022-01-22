import { Button, Text } from '@ui-kitten/components';
import { Formik } from 'formik';
import { View } from 'react-native';
import Center from '../../components/Center';
import FormSpacer from '../../components/FormSpacer';
import KeyboardAwareScrollView from '../../components/KeyboardAwareScrollView';
import ScreenWrapper from '../../components/ScreenWrapper';
import TextField from '../../components/form/TextField';
import { useRegisterMutation } from '../../generated/graphql';
import toErrorMap from '../../utils/toErrorMap';
import { AuthStackNav } from './AuthNav';

interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const RegisterScreen = ({ navigation }: AuthStackNav<'Register'>) => {
  const [, register] = useRegisterMutation();
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
            firstName: '',
            lastName: '',
            email: '',
            password: '',
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
            }
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <FormSpacer>
                <TextField
                  label="firstName"
                  textContentType="name"
                  autoCapitalize="none"
                  name="firstName"
                />
              </FormSpacer>
              <FormSpacer>
                <TextField
                  label="lastName"
                  textContentType="name"
                  autoCapitalize="none"
                  name="lastName"
                />
              </FormSpacer>
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
              </FormSpacer>
              <Button
                disabled={isSubmitting}
                onPress={() => handleSubmit()}
                status="primary"
              >
                Register
              </Button>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};
export default RegisterScreen;
