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
    // 告诉HomeScreen要删除这个用户的聊天
    navigation.navigate('Home', { deleteChat: userName });
  };


  useLayoutEffect(() => {
    navigation.setOptions({
      title: userName,
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
          title="Home"
          color="#fff"
        />
      ),
      headerRight: () => (
        <Button
        onPress={handleKillChat}
        title="Kill"
        color="#FF0000"
      />),

    });
  }, [navigation, userName]);

const [messages, setMessages] = useState([]);
const [inputText, setInputText] = useState('');

const handleSend = ()  => {
  if (inputText.trim().length > 0) {
    setMessages([...messages, { id: Date.now().toString(), text: inputText }]);
    setInputText('');
  }
};

const renderMessageItem = ({item}) => {
  return(
    <View style={styles.messageContainer}>
    <View style={styles.sentMessage}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  </View>
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
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    marginTop: 3,
    maxWidth: '80%',
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
});
