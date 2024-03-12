import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, Alert } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const handleRegister = () => {
    // Replace the following with your actual registration logic
    // For now, just show an alert with the collected information
    if (username == '' || password == '0'){
    Alert.alert(
      'Registration Successful',
      `Username: ${username}\nPassword: ${password}\nBiometrics Enabled: ${biometricsEnabled ? 'Yes' : 'No'}`,
      [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]
    );
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.switchContainer}>
        <Text>Enable Biometrics</Text>
        <Switch
          value={biometricsEnabled}
          onValueChange={(value) => setBiometricsEnabled(value)}
        />
      </View>
      <Button
        title="Register"
        onPress={handleRegister}
      />
      <Button
        title="Go Back"
        onPress={() => navigation.navigate('Home')}
      />
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
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});
