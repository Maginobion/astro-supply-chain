import * as Client from "@web3-storage/w3up-client";

const ipfsClient = await Client.create();

// first time setup!
if (!Object.keys(ipfsClient.accounts()).length) {
  // waits for you to click the link in your email to verify your identity
  const account = await ipfsClient.login("1913010909@untels.edu.pe");
  // create a space for your uploads
  const space = await ipfsClient.createSpace("supply-chain");
  // save the space to the store, and set as "current"
  await space.save();
  // associate this space with your account
  await account.provision(space.did());
}

const root = ipfsClient.spaces();
console.log(root);

export default ipfsClient;
