import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export class Backup {
    async backupUserData() {
        try {
            const userData = {
                username: await AsyncStorage.getItem('username'),
                password: await AsyncStorage.getItem('password'),
                publicKey: await AsyncStorage.getItem('publicKey'),
                privateKey: await AsyncStorage.getItem('privateKey'),
            };

            const filePath = FileSystem.documentDirectory + 'ghost_data.json';
            await FileSystem.writeAsStringAsync(filePath, JSON.stringify(userData));
            console.log('User data has been backed up');
        } catch (error) {
            console.error('ERROR IN BACKUP USER DATA: ', error);
            throw error;
        }
    }

    async restoreUserData() {
        try {
            const filePath = FileSystem.documentDirectory + 'ghost_data.json';
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (!fileInfo.exists) {
                console.warn('No backup found');
                return null;
            }
            const data = await FileSystem.readAsStringAsync(filePath);
            const userData = JSON.parse(data);
            await AsyncStorage.setItem('username', userData.username);
            await AsyncStorage.setItem('password', userData.password);
            await AsyncStorage.setItem('publicKey', userData.publicKey);
            await AsyncStorage.setItem('privateKey', userData.privateKey);
            console.log('User data has been restored');
        } catch (error) {
            console.error('ERROR IN RESTORE USER DATA: ', error);
            return null;
        }
    }

    async deleteBackup() {
        try {
            const filePath = FileSystem.documentDirectory + 'ghost_data.json';
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (fileInfo.exists) {
                await FileSystem.deleteAsync(filePath);
                console.log('Backup deleted successfully');
            }
        } catch (error) {
            console.error('ERROR IN DELETE BACKUP: ', error);
            throw error;
        }
    }
}

export const BackupManager = new Backup();