import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type AuthStackParamList = {
  Register: undefined;
  Login: undefined;
};

export type AuthStackNav<RouteName extends keyof AuthStackParamList> = {
  navigation: StackNavigationProp<AuthStackParamList, RouteName>;
  route: RouteProp<AuthStackParamList, RouteName>;
};
