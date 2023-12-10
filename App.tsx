import {View, Text, StatusBar, SafeAreaView} from 'react-native';
import React from 'react';
import HomeScreen from './src/homes/HomeScreen';

const App = () => {
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <HomeScreen />
      </SafeAreaView>
    </>
  );
};

export default App;
