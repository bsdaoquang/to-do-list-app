import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {colors} from './src/constants/colors';
import Router from './src/routers/Router';
import linking from './linking';
import codePush from 'react-native-code-push';

const codePushOptions = {
  checkFrenquency: codePush.CheckFrequency.MANUAL,
};

const App = () => {
  useEffect(() => {
    codePush.sync({
      updateDialog: {
        title: 'New version',
        optionalIgnoreButtonLabel: 'Cancel',
        optionalInstallButtonLabel: 'Install',
        optionalUpdateMessage: 'The new version available',
      },
      installMode: codePush.InstallMode.IMMEDIATE,
    });

    codePush.checkForUpdate().then(res => {
      console.log(res);
    });
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgColor} />
      <NavigationContainer linking={linking}>
        <Router />
      </NavigationContainer>
    </>
  );
};

export default codePush(codePushOptions)(App);
