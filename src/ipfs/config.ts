import * as Client from "@web3-storage/w3up-client";
import { Signer } from '@web3-storage/w3up-client/principal/ed25519';
import * as Proof from '@web3-storage/w3up-client/proof';
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory';

if(!import.meta.env.IPFS_KEY) {
  throw new Error('Invalid environment variable: "IPFS_KEY"');
}

if(!import.meta.env.IPFS_PROOF) {
  throw new Error('Invalid environment variable: "IPFS_PROOF"');
}

const principal = Signer.parse(import.meta.env.IPFS_KEY)
const store = new StoreMemory()
const ipfsClient = await Client.create({ principal, store })
const proof = await Proof.parse(import.meta.env.IPFS_PROOF)
const space = await ipfsClient.addSpace(proof)
await ipfsClient.setCurrentSpace(space.did())

// // first time setup!
// if (!Object.keys(ipfsClient.accounts()).length) {
//   // waits for you to click the link in your email to verify your identity
//   const account = await ipfsClient.login("1913010909@untels.edu.pe");
//   // create a space for your uploads
//   const space = await ipfsClient.createSpace("supply-chain");
//   // save the space to the store, and set as "current"
//   await space.save();
//   // associate this space with your account
//   await account.provision(space.did());
// }

// const root = ipfsClient.spaces();
// console.log(root);

export default ipfsClient;
