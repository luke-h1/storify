import Clipboard from '@react-native-clipboard/clipboard';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { Button, Text } from '@ui-kitten/components';
import * as Linking from 'expo-linking';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { ScrollView } from 'react-native-gesture-handler';
import FullScreenLoading from './components/FullScreenloading';
import ScreenWrapper from './components/ScreenWrapper';
import { useMeQuery } from './generated/graphql';
import AuthStack from './modules/AuthStack';

function ErrorFallback({ resetErrorBoundary, error }: FallbackProps) {
  return (
    <ScreenWrapper>
      <ScrollView>
        <Text style={{ fontSize: 30 }}>App Crashed:</Text>
        <Text style={{ marginVertical: 40, fontSize: 16 }}>
          {error?.message}
        </Text>
        <Button
          size="medium"
          status="danger"
          style={{ marginBottom: 20 }}
          onPress={() => {
            Clipboard.setString(error?.stack || '');
          }}
        >
          Copy stacktrace to clipboard
        </Button>
        <Button
          size="medium"
          status="danger"
          style={{ marginBottom: 20 }}
          onPress={() => {
            Linking.openURL('https://github.com/luke-h1/storify/issues');
          }}
        >
          Report a bug
        </Button>
      </ScrollView>
    </ScreenWrapper>
  );
}

const Routes = () => {
  const [{ data, fetching }] = useMeQuery();

  let body: any = null;

  if (fetching && !data) {
    body = <FullScreenLoading />;
  } else if (!data?.me) {
    body = <AuthStack />;
  }
};
