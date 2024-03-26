import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Switch, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Encryptor } from "./Encryption";
import { LanguageContext } from "./LanguageProvider";
import i18n from "../i18n.js";
import {BackupManager} from "./Backup";
// import bcrypt from 'bcryptjs';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);



  const handleRegister = async () => {
    // For now, just show an alert with the collected information
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch');
      return;
    }
    // Password validation regex pattern
    // const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{|<])(?=.*\d)[^\s}\/>]{8,}$/;

    // // Check if the password meets the requirements
    // if (!passwordRegex.test(password)) {
    //   Alert.alert('Password Requirements', 'Password must contain at least 1 symbol (!@#$%^&*(),.?:{|<) and 1 numeric character, and be at least 8 characters long. It should not contain "}/> symbols.');
    //   return;
    // }

    // Proceed with signup
    // Replace the following with your actual registration logic
    // For now, just show an alert with the collected information
    // Add a new regex test to ensure that "}/> are not present in the password
    // If possible, add a regex to make sure that the username also does not contain these characters
    // and that the username is not an email (anonimity purposes)
    saveData();
};

  let message = "my secret message";
const saveData = async () => {
  setLoading(true);
  try {
    // Hash the password
    // console.log(password)
    // console.log(username)
    let hashedPassword = await Encryptor.hash(password);
    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword)
    // Store the username and hashed password locally
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('password', hashedPassword);
    await AsyncStorage.setItem('biometricsEnabled', biometricsEnabled.toString());
    console.log(biometricsEnabled.toString());
    //generate and store the public key and private key
    
    await Encryptor.generateAndStoreKey();
    //Backup user data
    await BackupManager.backupUserData();
    // Add alert
    navigation.navigate("Main");
  } catch (error) {
    console.error('Error saving data:', error);
    Alert.alert('Error', 'An error occurred while saving data.');
  } finally{
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/ghost.png')} // Replace with the actual path or use require for local images
        style={styles.logo}/>
      <Text style = {styles.signupText}>{i18n.t("welcome")}</Text>
      <View style={styles.loginBox}>
      <TextInput
        style={styles.input}
        placeholder={i18n.t("username")}
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholderTextColor="#fff" //white text color
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t("password")}
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholderTextColor="#fff" //white text color
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t("confirmpassword")}
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        placeholderTextColor="#fff" //white text color
      />
</View>
     {/* Register button */}
      {loading && (
      <View style={styles.fullScreenLoader}>
        <ActivityIndicator style={styles.indicator} />
      </View>
    )}

    {!loading && (
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>{i18n.t("register")}</Text>
      </TouchableOpacity>
    )}
     
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

  signupText: {
    marginBottom: 10, //adding margin bottom for spacing
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold', // Make text bold

  },
  logo: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 20,
    resizeMode: 'contain',
  
  },

  enableBiometricsText: {
    color: '#fff', //White color
    marginRight: 10, //add margin to separate from the switch
  },

  input: {
    height: 40,
    width: '100%',
    borderColor: '#fff',
    borderRadius: 10, 
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    color: '#fff',
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  goBackText: {
    marginTop: 20,
    color: 'blue',
  },
  indicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  fullScreenLoader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    zIndex: 1, 
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
