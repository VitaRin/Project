import forge from 'node-forge';
import { JSHash, JSHmac, CONSTANTS } from "react-native-hash";
import AsyncStorage from '@react-native-async-storage/async-storage';

export class Encryption {

    async generateAndStoreKey() {
        try {
            const generateKeys = () => {
                const keys = forge.pki.rsa.generateKeyPair(2048);
                return { publicKey: forge.pki.publicKeyToPem(keys.publicKey), privateKey: forge.pki.privateKeyToPem(keys.privateKey),
                };
            };
            const { publicKey, privateKey } = generateKeys();
            await AsyncStorage.setItem('privateKey', privateKey);
            console.log('Private key has been generated and stored.');
            await AsyncStorage.setItem('publicKey', publicKey);
            console.log('Public key has been generated and stored.');
        } catch (error) {
            console.error('ERROR IN GENERATE AND STORE KEY: ', error);
            throw error;
        }
    }


    //Original version of encrypting messages
    async encryptMessage(message){
        try {
            const publicKeyPem = await AsyncStorage.getItem('publicKey');
            //return (publicKeyPem, message) => { const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);}
            const Encrypt = (publicKeyPem, message) => {
                //Extract the public key from Pem
                const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
                const cipher = publicKey.encrypt(message, 'RSA-OAEP', {
                    md: forge.md.sha256.create(),
                    mgf1: { md: forge.md.sha256.create(), },
                });
                //Encode the cipher with Base64
                return forge.util.encode64(cipher);
            };
            return Encrypt(publicKeyPem, message);
        }catch (error){
            console.error('ERROR WHEN ENCRYPTING MESSAGE: ', error);
            return null;
        }
    }


    //Formal version of encrypting messages with a specific user's public key
    /*
    async encryptMessage(message, uid){
        try {
            const publicKeyPem = await AsyncStorage.getItem(uid);
            const Encrypt = (publicKeyPem, message) => {
                const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
                const cipher = publicKey.encrypt(message, 'RSA-OAEP', {
                    md: forge.md.sha256.create(),
                    mgf1: { md: forge.md.sha256.create(), },
                });
                return forge.util.encode64(cipher);
            };
            return Encrypt(publicKeyPem, message);
        }catch (error){
            console.error('ERROR WHEN ENCRYPTING MESSAGE', error);
            return null;
        }
    }
    * */


    async decryptMessage(encryptedMessage){
        try{
            const privateKeyPem = await AsyncStorage.getItem('privateKey');
            const Decrypt = (privateKeyPem, encryptedMessage) => {
                //Extract the private key from Pem
                const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
                //Decode the cipher with Base64
                const encrypted = forge.util.decode64(encryptedMessage);
                return privateKey.decrypt(encrypted, 'RSA-OAEP', {
                    md: forge.md.sha256.create(),
                    mgf1: { md: forge.md.sha256.create(), },
                });
            };
            return Decrypt(privateKeyPem, encryptedMessage);
        }catch (error){
            console.error('ERROR WHEN DECRYPTING MESSAGE: ', error);
            return null;
        }
    }

    async hash(input){
        try {
            const Hash = await JSHash(input, CONSTANTS.HashAlgorithms.sha256);
            console.log('the hash of ', input, 'is ', Hash);
            return Hash;
        }catch (error){
            console.error('ERROR WHEN HASHING: ', error);
            return null;
        }
    }


}

export const Encryptor = new Encryption();
