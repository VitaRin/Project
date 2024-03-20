import forge from 'node-forge';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class Encryption {

    async generateAndStoreKey() {
        try {
            const generateRSAKeys = () => {
                const keys = forge.pki.rsa.generateKeyPair(2048);
                return { publicKey: forge.pki.publicKeyToPem(keys.publicKey), privateKey: forge.pki.privateKeyToPem(keys.privateKey),
                };
            };
            const { publicKey, privateKey } = generateRSAKeys();
            await AsyncStorage.setItem('privateKey', privateKey);
            console.log('Private key has been generated and stored.');
            await AsyncStorage.setItem('publicKey', publicKey);
            console.log('Public key has been generated and stored.');
        } catch (error) {
            console.error('ERROR IN GENERATE AND STORE KEY:', error);
            throw error;
        }
    }


    //Original version of encrypting messages
    async encryptMessage(message){
        try {
            const publicKeyPem = await AsyncStorage.getItem('publicKey');
            //return (publicKeyPem, message) => { const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);}
            const rsaEncrypt = (publicKeyPem, message) => {
                const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
                const encrypted = publicKey.encrypt(message, 'RSA-OAEP', {
                    md: forge.md.sha256.create(),
                    mgf1: { md: forge.md.sha256.create(), },
                });
                return forge.util.encode64(encrypted);
            };
            return rsaEncrypt(publicKeyPem, message);
        }catch (error){
            console.error('ERROR WHEN ENCRYPTING MESSAGE', error);
            return null;
        }
    }


    //Formal version of encrypting messages with a specific user's public key
    /*
    async encryptMessage(message, uid){
        try {
            const publicKeyPem = await AsyncStorage.getItem(uid);
            const rsaEncrypt = (publicKeyPem, message) => { const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
                const encrypted = publicKey.encrypt(message, 'RSA-OAEP', { md: forge.md.sha256.create(), mgf1: { md: forge.md.sha256.create(), }, });
                return forge.util.encode64(encrypted); };
            return rsaEncrypt(publicKeyPem, message);
        }catch (error){
            console.error('ERROR WHEN ENCRYPTING MESSAGE', error);
            return null;
        }
    }
    * */


    async decryptMessage(message){
        try{
            const privateKeyPem = await AsyncStorage.getItem('privateKey');
            const rsaDecrypt = (privateKeyPem, encryptedBase64) => {
                const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
                const encrypted = forge.util.decode64(encryptedBase64);
                return privateKey.decrypt(encrypted, 'RSA-OAEP', {
                    md: forge.md.sha256.create(),
                    mgf1: { md: forge.md.sha256.create(), },
                });
            };
            return rsaDecrypt(privateKeyPem, message);
        }catch (error){
            console.error('ERROR WHEN DECRYPTING MESSAGE', error);
            return null;
        }
    }


}

export const Encryptor = new Encryption();
