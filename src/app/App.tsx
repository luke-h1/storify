import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import React from 'react';
import { Provider } from 'urql';
import Routes from './src/Routes';
import { client } from './src/utils/client';

const App = () => {
  return (
    <Provider value={client}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light }}>
        <Layout
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Routes />
        </Layout>
      </ApplicationProvider>
    </Provider>
  );
};
export default App;
