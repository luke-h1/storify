import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import AuthStack from './AuthStack';
import { AuthStackParamList } from './AuthStack/AuthNav';
import LoginScreen from './AuthStack/LoginScreen';
import RegisterScreen from './AuthStack/RegisterScreen';

const Tabs = createBottomTabNavigator<AuthStackParamList>();

const AuthTabs = () => {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Login') {
            return <AntDesign name="login" size={size} color={color} />;
          }
          return <AntDesign name="user" size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Login" component={LoginScreen} />
      <Tabs.Screen name="Register" component={RegisterScreen} />
    </Tabs.Navigator>
  );
};
export default AuthTabs;
