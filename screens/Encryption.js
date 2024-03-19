import { RSA } from 'react-native-rsa-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class Encryption{
    async generateAndStoreKey () {
        try {
            const key = await RSA.generateKeys(4096);
            await AsyncStorage.setItem('privateKey', key.private);
            console.log('Private key has been generated and stored.');
            await AsyncStorage.setItem('publicKey', key.public);
            console.log('Public key has been generated and stored.');
        } catch (error) {
            console.error('ERROR IN GENERATE AND STORE KEY:', error);
            throw error;
        }
    }

    //Original version of encrypting messages
    async encryptMessage(message){
        try {
            const publicKey = await AsyncStorage.getItem('publicKey');
            return RSA.encrypt(message, publicKey);
        }catch (error){
            console.error('ERROR WHEN ENCRYPTING MESSAGE', error);
            return null;
        }
    }


    //Formal version of encrypting messages with a specific user's public key
    /*
    async encryptMessage(message, uid){
        try {
            const publicKey = await AsyncStorage.getItem(uid);
            return RSA.encrypt(message, publicKey);
        }catch (error){
            console.error('ERROR WHEN ENCRYPTING MESSAGE', error);
            return null;
        }
    }
    * */


    async decryptMessage(message){
        try{
            const privateKey = await AsyncStorage.getItem('privateKey');
            return RSA.decrypt(message, privateKey);
        }catch (error){
            console.error('ERROR WHEN DECRYPTING MESSAGE', error);
            return null;
        }
    }
}
