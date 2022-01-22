import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './AuthStack/AuthNav';
import LoginScreen from './AuthStack/LoginScreen';
import RegisterScreen from './AuthStack/RegisterScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        options={{ headerTitle: 'Login' }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="Register"
        options={{ headerTitle: 'Register' }}
        component={RegisterScreen}
      />
    </Stack.Navigator>
  );
};
export default AuthStack;
