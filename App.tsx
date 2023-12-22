import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {colors} from './src/constants/colors';
import HomeScreen from './src/screens/homes/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import Router from './src/routers/Router';

const App = () => {
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#f3f3f3'}}>
        {/* <StatusBar barStyle="light-content" backgroundColor={colors.bgColor} /> */}
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
};

export default App;
