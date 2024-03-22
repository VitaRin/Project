import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Encryptor } from "./Encryption";
import { LanguageContext } from "./LanguageProvider";
import i18n from "../i18n.js";
// import bcrypt from 'bcryptjs';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Retrieve stored username and hashed password from AsyncStorage
      const storedUsername = await AsyncStorage.getItem("username");
      const storedHashedPassword = await AsyncStorage.getItem("password");
      //Hash the input password
      const hashedPassword = await Encryptor.hash(password);
      console.log(storedUsername);
      console.log(storedHashedPassword);

      // Check if the entered username matches the stored username
      if (username === storedUsername) {
        // Compare the entered password with the stored hashed password using bcrypt
        // const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

        if (hashedPassword === storedHashedPassword) {
          navigation.navigate("Main");
        } else {
          // setErrorMessage('Incorrect password');
        }
      } else {
        // setErrorMessage('Username not found');
      }
    } catch (error) {
      console.error("Error retrieving stored credentials:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo or Image at the top */}
      <Image
        source={require("../assets/ghost.png")} // Replace with the actual path or use require for local images
        style={styles.logo}
      />
      <Text style={styles.appText}>Secure Chat</Text>
      {/* Username input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
        placeholderTextColor="#fff" //white text color
      />

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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{i18n.t("login")}</Text>
      </TouchableOpacity>

      {/* Go Back button */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 20,
    resizeMode: "contain",
  },

  AppText: {
    marginBottom: 10, //adding margin bottom for spacing
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold", // Make text bold
  },

  input: {
    height: 40,
    width: "80%",
    borderColor: "#fff",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    color: "#fff",
    fontSize: 14,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  goBackText: {
    marginTop: 20,
    color: "blue",
  },
});
