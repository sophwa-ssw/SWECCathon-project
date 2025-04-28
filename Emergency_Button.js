import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Emergency_Button = () => {
  return (
    <View style={styles.newElement}>
      <Text style={styles.text}>Emergency Meeting</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  newElement: {
    paddingTop: 15,
    height: 620,
    width: 310,
    backgroundColor: '#b7a57a',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    position: 'absolute',
    top: 100,
    left: 15,
    alignItems: 'center',
  },
  text: {
    fontSize: 30
  }
});

export default Emergency_Button;
