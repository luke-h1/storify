import Clipboard from '@react-native-clipboard/clipboard';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { Button, Text } from '@ui-kitten/components';
import * as Linking from 'expo-linking';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import FullScreenLoading from './components/FullScreenloading';
import ScreenWrapper from './components/ScreenWrapper';
import { useMeQuery } from './generated/graphql';
import AuthStack from './modules/AuthStack';

const Routes = () => {
  const [{ data, fetching }] = useMeQuery();

  let body: any = null;

  if (fetching && !data) {
    body = <FullScreenLoading />;
  } else if (!data?.me) {
    body = <AuthStack />;
  } else if (data?.me) {
    body = <Text>Logged in</Text>;
  }
  return (
    <ScreenWrapper>
      <NavigationContainer>{body}</NavigationContainer>
    </ScreenWrapper>
  );
};
export default Routes;
