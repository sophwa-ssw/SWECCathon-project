import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const chatlog = [];
  const handleSubmit = () => {
    if (text.trim() !== '') {
      setMessages([
        ...messages,
        { id: String(messages.length + 1), text: text },
      ]);
      setText('');
    }
  };
  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );
  return (
    
    <View style={styles.newElement}>
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <Text style={styles.text}>Chat</Text>
      
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      
      <View style={styles.textline}>
        <TextInput
          style={styles.inputContainer}
          placeholder="Type here to talk with the game admin:"
          onChangeText={(newText) => setText(newText)}
          defaultValue={text}
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity style={styles.blackButton} onPress={handleSubmit}>
          <Text style={styles.blackButtonText}>Send</Text>
        </TouchableOpacity>
      </View></ScrollView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  newElement: {
    height: 280,
    width: 310,
    backgroundColor: '#b7a57a',
    padding: 5,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    position: 'absolute',
    top: 440,
    left: 15,
    alignItems: 'right',
    marginBottom: '50px',
  },
  text: {
    fontSize: 30,
  },
  list: {
    flex: 1,
  },
  messageContainer: {
    backgroundColor: '#d0b8da',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  blackButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    alignItems: 'center',
    display: 'inline',
    margin: 3,
    height: 50,
    width: '20%',
  },
  inputContainer: {
    flex: 1,
    height: 40,
    marginRight: 10,
  },
  blackButtonText: { color: 'white', fontSize: 16, display: 'flex',
  justifyContent: 'center',
  alignItems: 'center', lineHeight: '50',},
  textline: {flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,},
});

export default Chat;
