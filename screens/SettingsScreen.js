import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  Linking,
} from "react";
import { Button } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LanguageContext } from "./LanguageProvider";
import i18n from "../i18n.js";
import * as LocalAuthentication from "expo-local-authentication";

const SettingsScreen = ({ navigation }) => {
  const [newUsername, setNewUsername] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(); // Remove default state

  const { changeLanguage } = useContext(LanguageContext);

  useEffect(() => {
    // const loadBiometricPreference = async () => {
    //   const bioState = await AsyncStorage.getItem("biometricsEnabled");
    //   console.log("Current biometricsEnabled value (Settings):", bioEnabled); // 输出当前值
    //   setBiometricsEnabled(bioState === "true"); // 确保状态为布尔值
    // };
    const loadBiometricPreference = async () => {
      try {
        const bioEnabled = await AsyncStorage.getItem("biometricsEnabled");
        console.log("Biometric Enablement from AsyncStorage.", bioEnabled);
        if (bioEnabled !== null) {
          // Make sure bioEnabled is not null
          setBiometricsEnabled(bioEnabled === "true");
        } else {
          // Handle cases where values have not yet been set in AsyncStorage
          console.log("bioEnabled is not set in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error loading biometric preferences.", error);
      }
    };

    loadBiometricPreference();
  }, []);

  const showLanguageOptions = () => {
    Alert.alert(
      i18n.t("selectlanguage"), //
      "",
      [
        { text: "中文", onPress: () => changeLanguage("zh") },
        { text: "English", onPress: () => changeLanguage("en") },
      ],
      { cancelable: true }
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#000",
      },
      headerTintColor: "#fff",
    });
  }, [navigation]);

  const handleDeleteAccount = async () => {
    Alert.alert(
      i18n.t("warning"),
      i18n.t("warnings"),
      [
        {
          text: i18n.t("no"),
          style: "cancel",
        },
        {
          text: i18n.t("yes"),
          onPress: async () => {
            try {
              // Remove both the username and password from AsyncStorage
              // await AsyncStorage.removeItem("username");
              // await AsyncStorage.removeItem("password");
              AsyncStorage.getAllKeys().then((keys) =>
                AsyncStorage.multiRemove(keys)
              );
              navigation.navigate("Register");
              // Redirect to the login screen or perform any other desired action
            } catch (error) {
              console.error("Error deleting account:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = () => {
    // Called when the user clicks "Logout".
    Alert.alert(i18n.t("confirmLogouttitle"), i18n.t("confirmlogout"), [
      { text: i18n.t("cancel"), style: "cancel" },
      { text: i18n.t("ok"), onPress: () => navigation.navigate("Login") }, //
    ]);
  };

  const handleChangeUsername = async () => {
    try {
      // Update the stored username in AsyncStorage with the new value
      await AsyncStorage.setItem("username", newUsername);
      setModalVisible(false);
      // Optionally, display a success message or perform any other desired action
    } catch (error) {
      console.error("Error changing username:", error);
    }
  };

  const handleEnableBiometrics = async () => {
    // Read current preferences first
    const bioEnabled = await AsyncStorage.getItem("biometricsEnabled");
    const isEnabled = bioEnabled === "true";

    // Check if biometric hardware is supported and if biometric data has been recorded
    const hasBiometricHardware = await LocalAuthentication.hasHardwareAsync();
    const biometricsEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (isEnabled) {
      // Prompt user to disable if already enabled
      Alert.alert(
        i18n.t("disableBiometricsTitle"),
        i18n.t("disableBiometricsMessage"),
        [
          { text: i18n.t("cancel"), onPress: () => {}, style: "cancel" },

          {
            text: i18n.t("yes"),
            onPress: async () => {
              await AsyncStorage.setItem("biometricsEnabled", "false");
              console.log("Biometrics has been disabled."); //  Outputs the state after the disable operation

              setBiometricsEnabled(false);
              Alert.alert(i18n.t("biometricsDisabledConfirmation"));
            },
          },
        ]
      );
    } else if (hasBiometricHardware && biometricsEnrolled) {
      // Provides the option to enable if not enabled but supported by the device and data has been entered
      Alert.alert(
        i18n.t("enableBiometricsTitle"),
        i18n.t("enableBiometricsMessage"),
        [
          { text: i18n.t("cancel"), onPress: () => {}, style: "cancel" },
          {
            text: i18n.t("yes"),
            onPress: async () => {
              const authResult = await LocalAuthentication.authenticateAsync({
                promptMessage: i18n.t("authenticatePrompt"),
                fallbackLabel: i18n.t("fallbackLabel"),
                cancelLabel: i18n.t("cancel"),
              });
              if (authResult.success) {
                await AsyncStorage.setItem("biometricsEnabled", "true");
                setBiometricsEnabled(true);
                console.log("Biometrics has been enabled."); // Outputs the state after the enable operation

                //setBiometricsEnabled(true);
                Alert.alert(i18n.t("biometricsEnabledConfirmation"));
              } else {
                Alert.alert(
                  i18n.t("authenticationFailedTitle"),
                  i18n.t("authenticationFailedMessage")
                );
              }
            },
          },
        ]
      );
    } else {
      // Notify the user if data is not supported or not entered
      Alert.alert(i18n.t("unavailable"), i18n.t("deviceNotSupported"));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/ghost.png")} // logo path
          style={styles.logo}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>{i18n.t("changeusername")}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.modalTextInput}
              placeholder={i18n.t("newUsernamePlaceholder")}
              value={newUsername}
              onChangeText={setNewUsername}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>{i18n.t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleChangeUsername}
              >
                <Text style={styles.modalButtonText}>{i18n.t("save")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.button} onPress={showLanguageOptions}>
        <Text style={styles.buttonText}>{i18n.t("changelanguage")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleEnableBiometrics}>
        <Text style={styles.buttonText}>{i18n.t("biometrics")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>{i18n.t("logout")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>{i18n.t("deleteaccount")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1F1F",
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    width: 100, // Set the width of  logo
    height: 100, // Set the height of  logo
    marginTop: 80,

    resizeMode: "contain",
  },
  button: {
    backgroundColor: "#515151", // Set background color
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff", // Set  text color
  },
  footer: {
    // Add styles for  footer, it may include icons
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#eaeaea", // Set a background color for the footer
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#292929",
    height: 70,
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  navItem: {
    padding: 20, // Navigation item padding
    marginVertical: 0, // Reduce top and bottom margins
    marginTop: 0, //
    marginBottom: 0, //
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 25,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 45,
    alignItems: "center",
  },
  modalTextInput: {
    width: "100%", // Set the width of the input box
    marginBottom: 15,
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderColor: "#ddd", //
    borderWidth: 1, //
    borderRadius: 4, //Set input box rounded corners
    color: "#000",
  },

  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1, // Buttons divide available space equally
    width: 100, //
    backgroundColor: "#FFFFFF", // Button background color
    padding: 10, //
    margin: 5, // Margins to ensure there is space between buttons
    borderColor: "#ddd", //
    borderWidth: 1, //
    borderRadius: 5, //
  },

  modalButtonText: {
    color: "#000000", //
    textAlign: "center", //
    fontWeight: "bold", //
    fontSize: 16, //
  },
});

export default SettingsScreen;
