import React from 'react';
import { Button } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';


export default function SettingsScreen({navigation}) {
    return (
        <View style={styles.container}>
          <Text>Aaaaa testest</Text>
          <View style={styles.navbar}>
            <Button 
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
            />
          </View>
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    height: 60, 
    width: '100%',
    position: 'absolute',
    bottom: 0
  }
});
