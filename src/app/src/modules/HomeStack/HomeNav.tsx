import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type HomeStackParamList = {
  Home: undefined;
  Search: undefined;
  CreateProduct: undefined;
  Profile: {
    id: number;
  };
  UpdateProduct: {
    id: number;
  };
};

export type AuthStackNav<RouteName extends keyof HomeStackParamList> = {
  navigation: StackNavigationProp<HomeStackParamList, RouteName>;
  route: RouteProp<HomeStackParamList, RouteName>;
};
