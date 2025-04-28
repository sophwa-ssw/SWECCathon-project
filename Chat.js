import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Chat = () => {
  return (
    <View style={styles.newElement}>
      <Text>Chat</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  newElement: {
    height: 280,
    width: 310,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    position: 'absolute',
    top: 550,
    left: 15,
    alignItems: 'center'
  },
});

export default Chat;
