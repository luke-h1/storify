import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import React from 'react';
import { Provider } from 'urql';
import { client } from './src/utils/client';

const App = () => {
  return (
    <Provider value={client}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light }}>
        <Layout
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>Welcome to UI Kitten</Text>
        </Layout>
      </ApplicationProvider>
    </Provider>
  );
};
export default App;
