import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { mplex } from '@libp2p/mplex'
import { tcp } from '@libp2p/tcp'
import { createLibp2p } from 'libp2p'
import { identify } from '@libp2p/identify'
import { kadDHT } from '@libp2p/kad-dht'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { webSockets } from '@libp2p/websockets'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generatePeerId } from './generatePeerId.js'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'

const topic = "topic";

const username = AsyncStorage.getItem("username");

const createNode = async () => {
  const node = await createLibp2p({
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0']
    },
    
    transports: [
      tcp(), webSockets(),
    ],
    streamMuxers: [
      yamux(), mplex()
    ],
    connectionEncryption: [
      noise()
    ],
    peerDiscovery: [
      pubsubPeerDiscovery(),
    ],
    dht: kadDHT({
      kBucketSize: 20,
      clientMode: false,
    }),
    config: {
      pubsub: { enabled: true },
      dht: {
        enabled: true,
        kBucketSize: 20, 
      },
    },
    services: {
      dht: kadDHT({kBucketSize:20}),
      identify: identify(),
      pubsub: gossipsub({emitSelf:true}),
    },
    peerId: generatePeerId(username)
  })

  await node.start()

  return node
}

// Function to initialize peer store in async storage
const initializePeerStore = async () => {
  // Check if peer store already exists in async storage
  let peerStore = await AsyncStorage.getItem('peerStore');
  // let peerStore = peerstore;
  if (!peerStore) {
      // If peer store doesn't exist, create an empty object
      peerStore = {};
      // Save the empty peer store in async storage
      await AsyncStorage.setItem('peerStore', JSON.stringify(peerStore));
      // setpeerstore(JSON.stringify(peerstore));
  }
};

// Function to add a peer to the peer store in async storage
const addPeerToStore = async (peerId, multiaddr) => {
  // Retrieve current peer store from async storage
  let peerStore = await AsyncStorage.getItem('peerStore');
  // let peerStore = peerstore;
  if (!peerStore) {
      // If peer store doesn't exist, initialize it
      await initializePeerStore();
      // Retrieve initialized peer store
      peerStore = await AsyncStorage.getItem('peerStore');
  }
  // Parse peer store JSON string into JavaScript object
  peerStore = JSON.parse(peerStore);
  // Add the new peer to the peer store
  peerStore[peerId] = multiaddr;
  // Save the updated peer store in async storage
  await AsyncStorage.setItem('peerStore', JSON.stringify(peerStore));
  console.log(AsyncStorage.getItem('peerStore'));
};


const getMultiaddrForPeer = async (peerId) => {
  // Retrieve current peer store from async storage
  const peerStore = await AsyncStorage.getItem('peerStore');
  // const peerStore = peerstore
  if (!peerStore) {
      // If peer store doesn't exist, return null
      return null;
  }
  // Parse peer store JSON string into JavaScript object
  const parsedPeerStore = JSON.parse(peerStore);
  // Retrieve multiaddr for the given peerId from the peer store
  return parsedPeerStore[peerId] || null;
};

// Function to send a message from one node to another by peer ID
const sendMessage = (senderNode, receiverPeerId, message) => {
  if (!receiverPeerId || !receiverPeerId.isValid()) {
      console.error("Invalid receiver Peer ID:", receiverPeerId);
      return;
  }

  senderNode.dial(receiverPeerId, (err) => {
      if (err) {
          console.error("Error dialing peer:", err);
          return;
      }
      senderNode.send(receiverPeerId, message, (err) => {
          if (err) {
              console.error("Error sending message:", err);
              return;
          }
          console.log(`Message sent from ${senderNode.peerId.toB58String()} to ${receiverPeerId.toB58String()}:`, message);
      });
  });
};

const sendMessageByPeerId = (senderNode, receiverPeerId, message) => {
  senderNode.dial(receiverPeerId, async (err) => {
    if (err) {
      console.error("Error dialing peer:", err);
      return;
    }
    try {
      const { stream } = await senderNode.newStream(receiverPeerId, '/pubsub/1.0.0');
      stream.write(message);
      console.log(`Message sent from ${senderNode.peerId.toB58String()} to ${receiverPeerId.toB58String()}:`, message);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });
};

// ;(async () => {
//   const [node1, node2] = await Promise.all([
//     createNode(),
//     createNode()
//   ])

//   console.log(node1.peerId)
//   console.log(node2.peerId)

//   node1.addEventListener('peer:discovery', (evt) => {
//     console.log('node 1 Discovered:', evt.detail.id.toString());
//     addPeerToStore(evt.detail.id, evt.detail.multiaddrs);
//     node1.dial(evt.detail.multiaddrs);
//   })
//   node2.addEventListener('peer:discovery', (evt) => {
//     console.log('node 2 Discovered:', evt.detail.id.toString());
//     addPeerToStore(evt.detail.id, evt.detail.multiaddrs);
//     node2.dial(evt.detail.multiaddrs);
//   })

//   console.log("a",node1.getConnections())

//   node1.addEventListener('peer:connect', (evt) => { console.log('node 1 connect:', evt.detail.toString());   console.log("a",node1.getConnections())})
//   node2.addEventListener('peer:connect', (evt) => console.log('node 2 connect:', evt.detail.toString()))

//   node1.services.pubsub.subscribe(topic);
//   node2.services.pubsub.subscribe(topic);

//   node1.services.pubsub.addEventListener('message', (message) => {
//     console.log(`node 1: ${message.detail.topic}:`, message.detail.data)
//   })
//   node2.services.pubsub.addEventListener('message', (message) => {
//     console.log(`node 2: ${message.detail.topic}:`, message.detail)
//   })

//   await node1.services.pubsub.publish(topic, "hello");

//   // Send message from node1 to node2
//   sendMessageByPeerId(node1, node2.peerId, "Hello from node 1");

//   // Send message from node2 to node1
//   sendMessageByPeerId(node2, node1.peerId, "Hello from node 2");

// })()
