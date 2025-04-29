import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TaskList from './components/TaskList'; // Adjust path as needed

const Tasks = ({ gameId, userId }) => {
  return (
    <View style={styles.newElement}>
      <Text style={styles.text}>Tasks</Text>
      <TaskList gameId={gameId} userId={userId} />
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
    padding: 10,
  },
  text: {
    fontSize: 30,
    marginBottom: 10,
  }
});

export default Tasks;
