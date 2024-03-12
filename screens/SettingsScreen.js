import React from 'react';
import { Button } from 'react-native';
import {  View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';


export default function SettingsScreen({navigation}) {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/icon.png')} // logo path
            style={styles.logo}
          />
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Change Username</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Change Language</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Delete account</Text>
        </TouchableOpacity>

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
    height: 60, 
    width: '100%',
    position: 'absolute',
    bottom: 0
  }
});
