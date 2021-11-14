import React, { useState } from 'react';
import AuthState from './context/auth/AuthState';
import { ThemeProvider } from 'styled-components';
import { GlobalThemeObject, ThemeObjectInitial } from './types/styled';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './pages/Home';

const initTheme = {
  theme: undefined,
};

const App = () => {
  const [themeObject, setThemeObject] = useState<ThemeObjectInitial>(initTheme);

  const getCSSVarValue = (variable: string) => {
    if (typeof window !== 'undefined') {
      return getComputedStyle(document.body).getPropertyValue(variable);
    }
    return undefined;
  };
  const changeThemeVariant: GlobalThemeObject['changeThemeVariant'] = theme => {
    setThemeObject({ theme });
  };
  const themeForContext: GlobalThemeObject = {
    ...themeObject,
    getCSSVarValue,
    changeThemeVariant,
  };
  return (
    <>
      <AuthState>
        <ThemeProvider theme={themeForContext}>
          <BrowserRouter>
            <Route component={Home} exact />
          </BrowserRouter>
        </ThemeProvider>
      </AuthState>
    </>
  );
};

export default App;
