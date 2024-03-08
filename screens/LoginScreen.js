import React from 'react';
import { Button } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';


export default function LoginScreen({navigation}) {
    return (
        <View style={styles.container}>
          <Text>Aaaaa testest</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.navigate("Home")}
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
