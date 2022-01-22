import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { Provider } from 'urql';
import { client } from './src/utils/client';

export default function App() {
  return (
    <Provider value={client}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </Provider>
  );
}
