/*import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ContactScreen from './screens/ContactScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/native';
import SocketIOClient from 'socket.io-client';
const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
              name="Home"
              component={HomeScreen}
          />
          <Stack.Screen
              name="Chat"
              component={ChatScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const HomeScreen = () => (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
);

const socket = SocketIOClient('http://3ugas2dxa3u6gknx7qoak7b2rroqcmolarx6k3fqivpn4x2uwgl2g3ad.onion',{
  agent: Agent,
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('chat message', (msg) => {
  console.log('New message:', msg);
});

const sendMessage = (msg) => {
  socket.emit('chat message', msg);
};

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages([...messages, msg]);
    });
  }, [messages]);

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage('');
  };

  return (
      <View style={styles.container}>
        <Text>Chat Screen</Text>
        <View>
          {messages.map((msg, index) => (
              <Text key={index}>{msg}</Text>
          ))}
        </View>
        <TextInput
            value={message}
            onChangeText={setMessage}
        />
        <Button
            title="Send"
            onPress={handleSendMessage}
        />
      </View>
  );
};