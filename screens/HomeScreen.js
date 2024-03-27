import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Animated,
  Image,
  StatusBar,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LanguageContext } from "./LanguageProvider";
import i18n from "../i18n.js";

const STORAGE_KEY = "activeChats";
export default function HomeScreen({ navigation, route }) {
  const [activeChats, setActiveChats] = useState([]);
  const { locale } = useContext(LanguageContext);

  // 从AsyncStorage加载聊天数据
  const loadChatsFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Error loading data", e);
      return []; // If there is any error, return an empty array
    }
  };

  // 保存聊天数据到AsyncStorage
  const saveChatsToStorage = async (chats) => {
    try {
      const jsonValue = JSON.stringify(chats);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Error saving data", e);
    }
  };

  // 加载数据
  useEffect(() => {
    loadChatsFromStorage().then(setActiveChats);
  }, []);

  // 监听route参数变化，处理新聊天和删除聊天的逻辑
  useEffect(() => {
    if (route.params?.newChat) {
      const newChat = { id: Date.now().toString(), name: route.params.newChat };
      // 检查聊天是否已经存在
      const isChatExists = activeChats.some(
        (chat) => chat.name === newChat.name
      );

      if (!isChatExists) {
        const updatedChats = [...activeChats, newChat];
        saveChatsToStorage(updatedChats).then(() => {
          setActiveChats(updatedChats);
          navigation.setParams({ newChat: undefined }); // 重置参数，避免重复添加
        });
      } else {
        // 如果聊天已存在，只重置参数
        navigation.setParams({ newChat: undefined });
      }
    } else if (route.params?.deleteChat) {
      const updatedChats = activeChats.filter(
        (chat) => chat.name !== route.params.deleteChat
      );
      saveChatsToStorage(updatedChats).then(() => {
        setActiveChats(updatedChats);
        navigation.setParams({ deleteChat: undefined }); // 重置参数，避免重复删除
      });
    }
  }, [route.params]);

  const handlePressUser = (userName) => {
    navigation.navigate("Chat", { userName: userName });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#141414",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    });
  }, [navigation]);

  // Render each user
  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handlePressUser(item.name)}
    >
      <Text style={styles.userName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={require("../assets/ghost.png")} style={styles.image} />

      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t("activechat")}</Text>
      </View>

      <FlatList
        data={activeChats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
        style={styles.userList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1F1F",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#141414",
    height: 60,
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 55,
    alignSelf: "center",
    marginBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#292929",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  userList: {
    width: "100%",
  },
  listContainer: {
    marginTop: 20,
  },
  userItem: {
    flexDirection: "row",
    padding: 35,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#A9A9A9",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userName: {
    color: "#fff",
    fontSize: 18,
  },
});
