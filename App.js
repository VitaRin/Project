import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ContactScreen from './screens/ContactScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChatScreen from './screens/ChatScreen';
import MainTabNavigator from './screens/TabNavigator';
import { LanguageProvider } from "./screens/LanguageProvider";
import ChatScreen2 from "./screens/ChatScreen2";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    checkIfUserRegistered();
  }, []);

  const checkIfUserRegistered = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      setUsername(storedUsername);
      setIsReady(true);
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <LanguageProvider>
      <>
        {username ? (
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
              <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }}/>
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Chat2" component={ChatScreen2} />
            </Stack.Navigator>
          </NavigationContainer>
        ) : (
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Register">
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
              <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }}/>
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Chat2" component={ChatScreen2} />
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </>
    </LanguageProvider>
  );
};

export default App;