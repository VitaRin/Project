import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Encryptor } from "./Encryption";
import { LanguageContext } from "./LanguageProvider";
import i18n from "../i18n.js";
import * as LocalAuthentication from "expo-local-authentication";
import { useFocusEffect } from "@react-navigation/native"; // 引入 useFocusEffect

// import bcrypt from 'bcryptjs';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const loadBiometricPreference = async () => {
    try {
      const bioState = await AsyncStorage.getItem("biometricsEnabled");
      console.log("Biometrics Enabled from AsyncStorage (Login):", bioState); // 确保变量名匹配
      setBiometricsEnabled(bioState === "true");
    } catch (error) {
      console.error("Error loading biometric preference:", error);
    }
  };

  useEffect(() => {
    loadBiometricPreference();
  }, []);

  // 使用 useFocusEffect 监听页面获得焦点事件
  useFocusEffect(
    React.useCallback(() => {
      loadBiometricPreference();
    }, [])
  );

  const handleBiometricLogin = async () => {
    const biometricAuthResult = await LocalAuthentication.authenticateAsync({
      promptMessage: i18n.t("authenticatePrompt"),
      fallbackLabel: i18n.t("fallbackLabel"),
      cancelLabel: i18n.t("cancel"),
    });

    if (biometricAuthResult.success) {
      navigation.navigate("Main");
    } else {
      Alert.alert(
        "Biometric Authentication Failed",
        "Please try again or use username and password."
      );
    }
  };

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

      {/* Biometric login button, only shown if biometrics is enabled */}
      {biometricsEnabled && (
        <TouchableOpacity style={styles.button} onPress={handleBiometricLogin}>
          <Text style={styles.buttonText}>{i18n.t("loginWithBiometrics")}</Text>
        </TouchableOpacity>
      )}

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
