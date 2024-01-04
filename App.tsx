import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StatusBar} from 'react-native';
import {colors} from './src/constants/colors';
import Router from './src/routers/Router';
import linking from './linking';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgColor} />
      <NavigationContainer linking={linking}>
        <Router />
      </NavigationContainer>
    </>
  );
};

export default App;
