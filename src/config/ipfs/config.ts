import * as Client from "@web3-storage/w3up-client";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";
import * as Proof from "@web3-storage/w3up-client/proof";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import envConfig from "../env/env";

const principal = Signer.parse(envConfig.ipfsKey);
const store = new StoreMemory();
const ipfsClient = await Client.create({ principal, store });
const proof = await Proof.parse(envConfig.ipfsProof);
const space = await ipfsClient.addSpace(proof);
await ipfsClient.setCurrentSpace(space.did());

export default ipfsClient;
