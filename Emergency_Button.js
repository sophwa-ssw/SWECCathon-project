import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Emergency_Button = () => {
  return (
    <View style={styles.newElement}>
      <Text>This is the element!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  newElement: {
    height: 730,
    width: 310,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    position: 'absolute',
    top: 100,
    left: 15,
    alignItems: 'center',
    fontSize: 40
  },
});

export default Emergency_Button;
