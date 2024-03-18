import React from 'react';
import { Button } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { io } from "socket.io-client";
import { SocksProxyAgent } from 'socks-proxy-agent';

export default function ChatScreen({navigation}) {
    const serverUrl = "ws://3ugas2dxa3u6gknx7qoak7b2rroqcmolarx6k3fqivpn4x2uwgl2g3ad.onion";

    //create the socks proxy
    const proxyAgent = new SocksProxyAgent("socks://localhost:9050");

    //use socks to connect to server
    const socket = io(serverUrl, {
        agent: proxyAgent
    });

    const message = () =>{
        //test the connection
        socket.on('connect', () => {
            console.log('Connected to server via SOCKS proxy');
        });
        socket.emit('chat message', "tor test message");
    }
    return (
        <View style={styles.container}>
          <Text>Aaaaa testest</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.navigate("Home")}
          />
            <Button
                title="Go"
                onPress={message}
            />
        </View>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
