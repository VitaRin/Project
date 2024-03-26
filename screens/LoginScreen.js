import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Encryptor} from "./Encryption";
import { LanguageContext } from "./LanguageProvider";
import i18n from "../i18n.js";
// import bcrypt from 'bcryptjs';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { locale } = useContext(LanguageContext);
  const [placeholder, setPlaceholder] = useState('Welcome');


  useEffect(() => {
    const loadUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername !== null) {
          setPlaceholder(`Welcome ${storedUsername}`); 
        }
      } catch (error) {
        console.error('Error retrieving username:', error);
      }
    };
  
    loadUsername();
  }, []);


  const handleLogin = async () => {
    try {
      // Retrieve stored username and hashed password from AsyncStorage
      const storedUsername = await AsyncStorage.getItem('username');
      const storedHashedPassword = await AsyncStorage.getItem('password');
      //Hash the input password
      const hashedPassword = await Encryptor.hash(password);
      console.log(storedUsername);
      console.log(storedHashedPassword);

      // Check if the entered username matches the stored username
      
        // Compare the entered password with the stored hashed password using bcrypt
        // const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

        if (hashedPassword === storedHashedPassword) {
          await AsyncStorage.setItem('username', username);
          console.log('Your username is:', username);
          console.log('Your password is:', password); 
          navigation.navigate("Main");

          setUsername('');
          setPassword('');
    
        } else {
          console.log('Incorrect password');
          // setErrorMessage('Incorrect password');
        }
      
    } catch (error) {
      console.error('Error retrieving stored credentials:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo or Image at the top */}
      <Image
        source={require('../assets/ghost.png')} // Replace with the actual path or use require for local images
        style={styles.logo}/>
      <Text style = {styles.AppText}>{placeholder}!!!</Text>
      <View style={styles.loginBox}>


      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholderTextColor="#fff" //white text color
      />

      {/* Login button */}
      <TouchableOpacity style={styles.button} 
        onPress={handleLogin}>
        <Text style={styles.buttonText}>{i18n.t("login")}</Text>
      </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 20,
    resizeMode: 'contain',
  },

  AppText: {
    marginBottom: 10, //adding margin bottom for spacing
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold', // Make text bold
  },

  input: {
    height: 40,
    width: '90%',
    borderColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    color: '#fff',
    fontSize: 14,
  },
  button: {
    backgroundColor: 'green',
    width: '50%',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  goBackText: {
    marginTop: 20,
    color: '#fff',
  },
  loginBox: {
    width: '80%', 
    padding: 20,
    borderColor: '#242424', 
    borderWidth: 2, 
    borderRadius: 10, 
    marginBottom: 20, 
  },
});
