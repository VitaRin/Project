import React, { useState, useLayoutEffect, useEffect} from 'react';
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
  Modal,
 } from 'react-native';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import { LanguageContext } from "./LanguageProvider";
 import i18n from "../i18n.js";

const STORAGE_KEY = '@contacts';


// grouped by first letter
const processContactsData = (contacts, query) => {
  if (!contacts) {
    console.error('processContactsData was called with undefined contacts');
    return [];
  }
  const lowercasedQuery = query.toLowerCase();
  const filteredContacts = query ? contacts.filter(contact =>
    contact.name.toLowerCase().includes(lowercasedQuery)
  ) : contacts;

  const sortedContacts = filteredContacts.sort((a, b) => a.name.localeCompare(b.name));
  const groupedContacts = [];
  let currentLetter = '';

  sortedContacts.forEach(contact => {
    if (contact.name[0].toUpperCase() !== currentLetter) {
      currentLetter = contact.name[0].toUpperCase();
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

const [contacts, setContacts] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [isAddModalVisible, setAddModalVisible] = useState(false);
const [newContactName, setNewContactName] = useState('');
const [isEditMode, setIsEditMode] = useState(false); 
const [editingContactId, setEditingContactId] = useState(null);

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

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedContacts) {
          setContacts(JSON.parse(storedContacts));
        }
      } catch (e) {
        console.error('Failed to load contacts.', e);
      }
    };

    loadContacts();
  }, []);


  const saveContacts = async (updatedContacts) => {
    try {
      const jsonValue = JSON.stringify(updatedContacts);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save contacts to storage', e);
    }
  };

  // Function to handle the selection from the contact action menu
  const handleContactAction = (action, userName) => {
    if (action === 'Start Chat') {
      navigation.navigate('Chat', {userName: userName});
    }
  };


  //add
  const handleAddNewContact = () => {
    if (newContactName.trim()) {
      if (!contacts.some(contact => contact.name.toLowerCase() === newContactName.toLowerCase())) {
        const newContact = { id: Date.now().toString(), name: newContactName.trim() };
        const newContacts = [...contacts, newContact];
        setContacts(newContacts);
        saveContacts(newContacts); // save new contacts
        setNewContactName('');
        setAddModalVisible(false);
      } else {
        Alert.alert('Error', 'A contact with this name already exists.');
      }
    } else {
      Alert.alert('Error', 'Contact name cannot be empty.');
    }
  };
  

//remove
  const removeContact = (contactId) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    setContacts(updatedContacts); 
    saveContacts(updatedContacts);
  };


//edit
  const handleEditContact = (contactId, newName) => {
    const updatedContacts = contacts.map(contact =>
      contact.id === contactId ? { ...contact, name: newName } : contact
    );
    setContacts(updatedContacts); 
    saveContacts(updatedContacts); 

    setAddModalVisible(false);
    setIsEditMode(false);
    setEditingContactId(null);
    setNewContactName('');
  };

  // show the edit one 
  const showEditContactModal = (contact) => {
    setIsEditMode(true);
    setEditingContactId(contact.id);
    setNewContactName(contact.name);
    setAddModalVisible(true);
  };


  // Function to show the contact action menu
  const showContactActionMenu = (contact) => {
    Alert.alert(
      contact.name,
      "Choose an action for this contact:",
      [
        { text: 'Start Chat', onPress: () => handleContactAction('Start Chat', contact.name) },
        { text: 'Remove', onPress: () => removeContact(contact.id) },
        { text: 'Edit', onPress: () => showEditContactModal(contact) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };


  return (
    <View style={styles.container}>
      
      <StatusBar barStyle="light-content" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => {
          setAddModalVisible(!isAddModalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter name..."
              onChangeText={setNewContactName}
              value={newContactName}
            />
            <Button
              title={isEditMode ? "Save Changes" : "Add Contact"}
              onPress={() => {
                if (isEditMode) {
                  handleEditContact(editingContactId, newContactName);
                } else {
                  handleAddNewContact();
                }
              }}
            />
            <Button
              title="Cancel"
              color="#ff5c5c"
              onPress={() => {
                setAddModalVisible(false);
                setNewContactName('');
              }}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <TouchableOpacity
          style={styles.addIcon}
          onPress={() => setAddModalVisible(true)}>
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
        sections={processContactsData(contacts, searchQuery)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => showContactActionMenu(item)} style={styles.contactItem}>
            <Text style={styles.userName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
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
    backgroundColor: '#000',
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
  userName: {
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
    marginTop: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1F1F1F', 
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
    fontSize: 24,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 35,
    alignItems: 'center',
  },
  modalInput: {
    width: '80%',
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});
