import React from 'react';
import { Button } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';


export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text>Aaaaa testest</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate("Login")}
      />
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
      <Button
        title="Contacts"
        onPress={() => navigation.navigate("Contact")}
      />
      <Button
        title="Settings"
        onPress={() => navigation.navigate("Settings")}
      />
      <Button
        title="Chat"
        onPress={() => navigation.navigate("Chat")}
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
});
