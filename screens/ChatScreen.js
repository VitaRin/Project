import React, {useLayoutEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Button, 
  KeyboardAvoidingView,
  FlatList,
  TextInput,
  Platform
} from 'react-native';
import { io } from "socket.io-client";
const serverUrl = "ws://192.168.177.136:4000";
const socket = io(serverUrl);

export default function ChatScreen({route, navigation}) {
  socket.on('connect', () => {
    socket.emit('get messages',"get");
    console.log('Connected to server via SOCKS proxy');
  });

  const {userName} = route.params;

  const handleKillChat = () => {
    socket.emit("kill", () => {
      console.log("dead");
    })
    navigation.navigate('Home', { deleteChat: userName });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
    
      title: userName,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#141414', 
      },
      headerTintColor: '#fff', 
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerLeft: () => (
     <Button
        onPress={() => navigation.navigate('Home', { newChat: userName })}
          title="< Home"
          color={Platform.OS === "ios" ? "#fff" : "#111"}
        />
      
      ),
      headerRight: () => (
      <View  style={{ paddingRight: 15 }}>
        <Button 
         marginRight='5'
         onPress={handleKillChat}
         title="Kill"
         color="#FF0000"
        />
      </View>),

    });
  }, [navigation, userName]);

const [messages, setMessages] = useState([]);
const [inputText, setInputText] = useState('');



socket.on('got messages', (msg) =>{
  console.log("got messages");
  setMessages(msg);
});

socket.on('rec message', (msg) => {
  console.log(msg);
  setMessages(msg);

});

const handleSend = ()  => {
  if (inputText.trim().length > 0) {
    socket.emit('sent message', { id: Date.now().toString(), text: inputText, name:userName });
    //setMessages(messages)
    //setMessages([...messages, { id: Date.now().toString(), text: inputText, name:userName }]);
    console.log(messages);
    setInputText('');
  }
};

const renderMessageItem = ({item}) => {
  if (item.name === userName) {
    return (
        <View style={styles.messageContainer}>
          <View style={styles.sentMessage}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        </View>
    );
  }
  else {
    return (
        <View style={styles.messageContainer}>
          <View style={styles.recMessage}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        </View>
    );
  }
};

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 100}
        >
         <FlatList
         data={messages}
         keyExtractor={(item) => item.id}
         renderItem={renderMessageItem}
         style={styles.chatArea}
         />
         
        <View  style={styles.inputContainer}>
          <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          keyboardAppearance="dark"
          keyboardType="default"
          onSubmitEditing={handleSend}
          />
        </View>
        </KeyboardAvoidingView>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F1F',
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    position: 'relative',
    alignSelf: "center",
  },
  sentMessage: {
    right:  "-200%",
    borderTopRightRadius: 10,
    backgroundColor: 'green',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 3,
    maxWidth: '80%',
    alignItems: 'flex-end',
    alignSelf:"flex-end",
  },
  recMessage: {
    left: "-200%",
    borderTopLeftRadius:10,
    backgroundColor: 'grey',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 3,
    maxWidth: '80%',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#292929',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
