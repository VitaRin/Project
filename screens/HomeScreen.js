import React , { usersData , useLayoutEffect } from 'react';
import { StyleSheet,
   Text, 
   View, 
   Button, 
   TouchableOpacity, 
   Animated, 
   Image,
   StatusBar,
   FlatList } from 'react-native';

export default function HomeScreen({ navigation }) {


  const contactsData = [
    { id: '1', name: 'Ray' },
    { id: '2', name: 'Apple' },
    { id: '3', name: 'Cris' },
    { id: '4', name: 'Tina' },
    { id: '5', name: 'Jessica' },
    { id: '6', name: 'Mid' },
    { id: '7', name: 'Thresh' },
  ];

 
  const handlePressUser = (userName) => {
    navigation.navigate('Chat');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#141414', 
      },
      headerTintColor: '#fff', 
      headerTitleStyle: {
        fontWeight: 'bold',
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
       <Image
        source={require('../assets/logo.png')} 
        style={styles.image}
      />
     
     <StatusBar barStyle="light-content" />
     <View style={styles.header}>
     <Text style={styles.title}>Active Chat</Text>
     </View>
      
      <FlatList
        data={contactsData}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        style={styles.userList}
      />

    
      <View style={styles.navbar}>
        <Button 
          title="Contacts"
          color="#fff"
           onPress={() => navigation.navigate("Contact")}
        />
        <Button 
          title="Home"
          color="#fff"
           onPress={() => navigation.navigate("Home")}
        />
        <Button 
          title="Settings"
          color="#fff"
          onPress={() => navigation.navigate("Settings")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F1F',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#141414',
    height: 60, 
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  image: {
    width: 150, 
    height: 150, 
    marginTop: 20,
    alignSelf: 'center',
    marginBottom: 30, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#292929', 
    
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userList: {
    width: '100%',
  },
  listContainer: {
    marginTop: 20, 
  },
  userItem: {
    flexDirection: 'row',
    padding: 35,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#A9A9A9',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
  },
});
