import {View, Text, StyleSheet, Button} from 'react-native';
import React from 'react';
import {fontFamilies} from './src/constants/fontFamilies';

const App = () => {
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: '#fafafa',
          fontSize: 18,
        }}>
        Wellcome to my first app
      </Text>
      <Text style={styles.title}>Todo List</Text>
      <Button title="Hello" onPress={() => {}} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'coral',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    color: '#fff',
  },
});
