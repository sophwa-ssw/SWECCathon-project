import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from './supabase'; // Adjust path as needed

const Chat = () => {
  const [code, setCode] = useState('');

  const handleDelete = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter a player ID.');
      return;
    }

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('player_id', code); // make sure player_id is a string or number depending on schema

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', `Player ${code} deleted.`);
      setCode('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Player ID to remove"
        placeholderTextColor="#999"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />
      <Button title="Delete Player" onPress={handleDelete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    width: 310,
    backgroundColor: '#b7a57a',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    position: 'absolute',
    top: 440,
    left: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#000'
  }
});

export default Chat;
