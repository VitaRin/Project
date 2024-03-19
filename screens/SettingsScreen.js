import React, { useState } from 'react';
import { Button } from 'react-native';
import {  View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SettingsScreen = ({navigation}) => {
  const [newUsername, setNewUsername] = useState('');
  const [isChangingUsername, setIsChangingUsername] = useState(false);

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Warning',
      'This will delete your account and all your contacts. Do you want to continue?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              // Remove both the username and password from AsyncStorage
              await AsyncStorage.removeItem('username');
              await AsyncStorage.removeItem('password');
              navigation.navigate("Register");
              // Redirect to the login screen or perform any other desired action
            } catch (error) {
              console.error('Error deleting account:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleChangeUsername = async () => {
    try {
      // Update the stored username in AsyncStorage with the new value
      await AsyncStorage.setItem('username', newUsername);
      setIsChangingUsername(false);
      // Optionally, display a success message or perform any other desired action
    } catch (error) {
      console.error('Error changing username:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/icon.png')} // logo path
          style={styles.logo}
        />
      </View>

      {!isChangingUsername && (
        <TouchableOpacity onPress={() => setIsChangingUsername(true)} style={styles.button}>
          <Text style={styles.buttonText}>Change Username</Text>
        </TouchableOpacity>
      )}

      {isChangingUsername && (
        <View>
          <TextInput
            placeholder="New Username"
            value={newUsername}
            onChangeText={text => setNewUsername(text)}
          />
          <Button
            title="Submit"
            onPress={handleChangeUsername}
          />
          <Button
            title="Cancel"
            onPress={() => setIsChangingUsername(false)}
          />
        </View>
      )}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Change Language</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDeleteAccount} style={styles.button}>
        <Text style={styles.buttonText}>Delete account</Text>
      </TouchableOpacity>

      {/* <View style={styles.navbar}> */}
        {/* <Button 
          title="Contacts"
          onPress={() => navigation.navigate("Contact")}
        />
        <Button 
          title="Home"
          onPress={() => navigation.navigate("Home")}
        />
        <Button 
          title="Settings"
          onPress={() => navigation.navigate("Settings")}
        /> */}
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 100, // Set the width of  logo
    height: 100, // Set the height of  logo
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#515151', // Set background color
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff', // Set  text color
  },
  footer: {
    // Add styles for  footer, it may include icons
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#eaeaea', // Set a background color for the footer
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },


  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 100, // Set the width of  logo
    height: 100, // Set the height of  logo
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#f0f0f0', // Set background color
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000', // Set  text color
  },
  footer: {
    // Add styles for  footer, it may include icons
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#eaeaea', // Set a background color for the footer
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    width: '100%',
    position: 'absolute',
    bottom: 0
  }
});

export default SettingsScreen;
