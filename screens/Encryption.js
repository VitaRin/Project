import forge from 'node-forge';
import { JSHash, CONSTANTS } from "react-native-hash";
import Aes from 'react-native-aes-crypto';
import CryptoJS from "react-native-crypto-js";
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

    async generateSessionKey(){
        try {
            //Get user's password
            const password = await AsyncStorage.getItem('password');
            //Get time as salt
            const time = new Date().toTimeString();
            //Generate the session key by Aes.pbkdf2(password, salt, cost, length)
            const sessionKey =  await Aes.pbkdf2(password, time, 5000, 256);
            console.log('The session key is:', sessionKey);
            return sessionKey;
        }catch (error){
            console.error('ERROR IN GENERATE SESSION KEY: ', error);
        }

    }

    //Original version of encrypting messages
    async encryptRSA(input){
        try {
            const publicKeyPem = await AsyncStorage.getItem('publicKey');
            //return (publicKeyPem, message) => { const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);}
            const Encrypt = (publicKeyPem, input) => {
                //Extract the public key from Pem
                const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
                const cipher = publicKey.encrypt(input, 'RSA-OAEP', {
                    md: forge.md.sha256.create(),
                    mgf1: { md: forge.md.sha256.create(), },
                });
                //Encode the cipher with Base64
                return forge.util.encode64(cipher);
            };
            return Encrypt(publicKeyPem, input);
        }catch (error){
            console.error('ERROR WHEN RSA ENCRYPTION: ', error);
            return null;
        }
    }


    //Formal version of encrypting messages with a specific user's public key
    /*
    async encryptRSA(input, uid){
        try {
            const publicKeyPem = await AsyncStorage.getItem(uid);
            const Encrypt = (publicKeyPem, input) => {
                const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
                const cipher = publicKey.encrypt(input, 'RSA-OAEP', {
                    md: forge.md.sha256.create(),
                    mgf1: { md: forge.md.sha256.create(), },
                });
                return forge.util.encode64(cipher);
            };
            return Encrypt(publicKeyPem, input);
        }catch (error){
            console.error('ERROR WHEN RSA ENCRYPTION: ', error);
            return null;
        }
    }
    * */


    async decryptRSA(encryptedInput){
        try{
            const privateKeyPem = await AsyncStorage.getItem('privateKey');
            const Decrypt = (privateKeyPem, encryptedInput) => {
                //Extract the private key from Pem
                const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
                //Decode the cipher with Base64
                const encrypted = forge.util.decode64(encryptedInput);
                return privateKey.decrypt(encrypted, 'RSA-OAEP', {
                    md: forge.md.sha256.create(),
                    mgf1: { md: forge.md.sha256.create(), },
                });
            };
            return Decrypt(privateKeyPem, encryptedInput);
        }catch (error){
            console.error('ERROR WHEN RSA DECRYPTION: ', error);
            return null;
        }
    }

    async encryptAES(message, key){
        try {
            return CryptoJS.AES.encrypt(message, key).toString();
        }catch (error){
            console.log('ERROR WHEN AES ENCRYPTION: ', error);
            return null;
        }
    }

    async decryptAES(message, key){
        try {
            return CryptoJS.AES.decrypt(message, key).toString();
        }catch (error){
            console.log('ERROR WHEN AES DECRYPTION: ', error);
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
