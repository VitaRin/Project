import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Image } from 'react-native';
import HomeScreen from './HomeScreen';
import ContactScreen from './ContactScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator 
      initialRouteName="Home"
      screenOptions={{
        "tabBarShowLabel": false,
        "tabBarStyle": styles.tabBar,
        "tabBarHideOnKeyboard": true,
      }}
    >
      <Tab.Screen 
        name="Contact" 
        component={ContactScreen} 
        options={{
          tabBarIcon: () => (
            <Image 
              source={require('../assets/icons/contact_icon.png')} 
              style={styles.tabIcon} 
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: () => (
            <Image 
              source={require('../assets/icons/home_icon.png')} 
              style={styles.tabIcon} 
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: () => (
            <Image 
              source={require('../assets/icons/settings_icon.png')} 
              style={styles.tabIcon} 
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    "display": "flex",
    "backgroundColor": "#000000",
    "borderColor": 'grey',
    "borderRadius": 1,
  },
  tabIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export default MainTabNavigator;