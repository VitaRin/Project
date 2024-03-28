import cryptico from "cryptico";
import { marshalPrivateKey, marshalPublicKey } from "@libp2p/crypto/keys";
import { peerIdFromKeys } from "@libp2p/peer-id";

const mapToJWK = (key) => {
  return { kty: 'RSA',
    n: Buffer.from(key.n.toByteArray()),
    e: Buffer.from([key.e]),
    d: Buffer.from(key.d.toByteArray()),
    p: Buffer.from(key.p.toByteArray()),
    q: Buffer.from(key.q.toByteArray()),
    dp: Buffer.from(key.dmp1.toByteArray()),
    dq: Buffer.from(key.dmq1.toByteArray()),
    qi: Buffer.from(key.coeff.toByteArray())
  };
};

export async function generatePeerId(username) {
  // Generate RSA key for the username  
  const rsaKey = cryptico.generateRSAKey(username, 1024);
  const jwkPrivate = mapToJWK(rsaKey);  // Map RSA key to JWK for private key

  // Create JWK public key object
  const jwkPublic = {
    kty: jwkPrivate.kty,
    n: jwkPrivate.n,
    e: jwkPrivate.e
  };

  // Convert RSA public key to protobuf serialized format
  const serializedPublicKey = marshalPublicKey({
    bytes: jwkPublic.n, // JWK public key mapped to 'n' component 
  });

  // Convert RSA private key to protobuf serialized format
  const serializedPrivateKey = marshalPrivateKey({
    bytes: jwkPrivate.d, // JWK private key mapped to 'd' component
  });

  // Return peer ID generated from the keys
  return await peerIdFromKeys(serializedPublicKey, serializedPrivateKey);
}

