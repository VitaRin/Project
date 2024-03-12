import React, { useState, useLayoutEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SectionList, 
  TouchableOpacity, 
  Alert, 
  TextInput, 
  StatusBar,
  Button,
 } from 'react-native';

const contactsData = [
  { id: '1', name: 'Ray' },
  { id: '2', name: 'Apple' },
  { id: '3', name: 'Cris' },
];


// grouped by first letter
const processContactsData = (contacts) => {
  const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
  const groupedContacts = [];
  let currentLetter = '';

  sortedContacts.forEach(contact => {
    if (contact.name[0] !== currentLetter) {
      currentLetter = contact.name[0];
      groupedContacts.push({
        title: currentLetter,
        data: []
      });
    }
    groupedContacts[groupedContacts.length - 1].data.push(contact);
  });

  return groupedContacts;
};

export default function ContactScreen({navigation}) {

  const [searchQuery, setSearchQuery] = useState('');
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#000', 
      },
      headerTintColor: '#fff', 
      
    });
  }, [navigation]);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Function to handle the selection from the contact action menu
  const handleContactAction = (action, contactName) => {
    if (action === 'Start Chat') {
      // Navigate to the ChatScreen with the contactName
      navigation.navigate('ChatScreen', { contactName });
    }
  };

  // Function to show the contact action menu
  const showContactActionMenu = (contact) => {
    Alert.alert(
      contact.name,
      "Choose an action for this contact:",
      [
        { text: 'Start Chat', onPress: () => handleContactAction('Start Chat', contact.name) },
        { text: 'Remove', onPress: () => handleContactAction('Remove', contact.name) },
        { text: 'Edit', onPress: () => handleContactAction('Edit', contact.name) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // Render each contact in the FlatList
  const renderContactItem = ({ item }) => (
    <View style={styles.contactItem}>
      <Text style={styles.contactName}>{item.name}</Text>
      <TouchableOpacity onPress={() => showContactActionMenu(item)} style={styles.infoButton}>
        <Text style={styles.infoButtonText}>💬</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <TouchableOpacity style={styles.addIcon} onPress={() => {/* handle add contact */}}>
          <Text style={styles.addIconText}>+</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <SectionList
        sections={processContactsData(contactsData)} 
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => showContactActionMenu(item)} style={styles.contactItem}>
            <Text style={styles.contactName}>{item.name}</Text>
            {/* <Text style={styles.infoButtonText}>💬</Text> */}
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />


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
    backgroundColor: '#000',
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
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchInput: {
    backgroundColor: '#333', 
    color: '#fff', 
    borderRadius: 10,
    fontSize: 16,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  addContactButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContactButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  contactItem: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactName: {
    fontSize: 18,
    color: '#fff'
  },
  infoButton: {
    padding: 10,
  },
  infoButtonText: {
    fontSize: 22,
    color:'#007AFF'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000', 
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addIcon: {
    
  },
  addIconText: {
    color: '#fff',
    fontSize: 24, // Increase size if necessary
    fontWeight: 'bold',
  },
  sectionHeader: {
    backgroundColor: '#333', 
    color: '#fff', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    fontSize: 16, 
    fontWeight: 'bold', 
  },

});
