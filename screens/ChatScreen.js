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

export default function ChatScreen({route, navigation}) {

  const {userName} = route.params;
  

  const handleKillChat = () => {
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
          color={Platform.OS == "ios" ? "#fff" : "#111"}
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

const handleSend = ()  => {
  if (inputText.trim().length > 0) {
    setMessages([...messages, { id: Date.now().toString(), text: inputText }]);
    setInputText('');

    setTimeout(() => {
      const botReply = {
        id: Date.now().toString(),
        text: "Hi, I am a bot",
        isReceived: true,
      };
      setMessages(currentMessages => [...currentMessages, botReply]);
    }, 1000);
  }
};

const renderMessageItem = ({item}) => {
  return(

    <View style={[styles.messageContainer, item.isReceived ? { justifyContent: 'flex-start' } : { justifyContent: 'flex-end' }]}>
      <View style={item.isReceived ? styles.receivedMessage : styles.sentMessage}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    </View>
  //   <View style={styles.messageContainer}>
  //   <View style={styles.sentMessage}>
  //     <Text style={styles.messageText}>{item.text}</Text>
  //   </View>
  // </View>
  );
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
    justifyContent: 'flex-end',
  },
  sentMessage: {
    backgroundColor: 'green',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    marginTop: 5,
    maxWidth: '70%',
    alignItems: 'flex-end',
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
  receivedMessage: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    maxWidth: '70%',
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
  },
});
