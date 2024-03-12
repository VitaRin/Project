import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement your login logic here
    console.log('Username:', username);
    console.log('Password:', password);
    if (username === correctUsername && password === correctPassword) {
      // Successful login, navigate to the Home screen
      navigation.navigate('Home');
    } else {
      // Display an alert for failed login
      Alert.alert('Invalid Credentials', 'Please check your username OR/AND password.');
    }
  };

   const handleSignup = () => {
      //Implement your signup navigation logic
      navigation.navigate('Register');
   };

  return (
    <View style={styles.container}>
      {/* Logo or Image at the top */}
      {/* <Image
        source={require('path/to/your/logo.png')} // Replace with the actual path or use require for local images
        style={styles.logo}
      /> */}

      {/* Username input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      {/* Login button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Go Back button */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 20,
    resizeMode: 'contain',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
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
});
