import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {colors} from './src/constants/colors';
import HomeScreen from './src/screens/homes/HomeScreen';

const App = () => {
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.bgColor}}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bgColor} />
        <HomeScreen />
      </SafeAreaView>
    </>
  );
};

export default App;
