import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Tasks = () => {
  return (
    <View style={styles.newElement}>
      <Text style={styles.text}>Tasks</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  newElement: {
    height: 280,
    width: 310,
    backgroundColor: '#b7a57a',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    position: 'absolute',
    top: 440,
    left: 15,
    alignItems: 'center',
  },
  text: {
    fontSize: 30
  }
});

export default Tasks;
