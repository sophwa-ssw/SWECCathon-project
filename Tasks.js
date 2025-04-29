import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const Tasks = () => {
  return (
    <View style={styles.newElement}>
      <Text style={styles.text}>Tasks</Text>
      <FlatList style={styles.list}
        data={[
          {task: '\u2022 Take a picture with a statue'},
          {task: '\u2022 Take a picture with a goose'},
          {task: '\u2022 Take a picture with a tree'},
          {task: '\u2022 Take a picture of a husky '},
          {task: '\u2022 Take a picture of the famous fruitless trees'},
          {task: "\u2022 Take a picture of the rock's sights"},
        ]}
        renderItem={({item}) => <Text style={styles.item}>{item.task}</Text>}/>
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
  },
  list: {
  alignItems: 'right',
  flex: 1,
  },item: {
    fontSize: 20,
  }
});

export default Tasks;
