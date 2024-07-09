if (!import.meta.env.IPFS_KEY) {
  throw new Error('Invalid environment variable: "IPFS_KEY"');
}

if (!import.meta.env.IPFS_PROOF) {
  throw new Error('Invalid environment variable: "IPFS_PROOF"');
}

if (!import.meta.env.TEST_ADDRESS) {
  throw new Error('Invalid environment variable: "TEST_ADDRESS"');
}

if (!import.meta.env.CONTRACT_ADDRESS) {
  throw new Error('Invalid environment variable: "CONTRACT_ADDRESS"');
}

if (!import.meta.env.WEB3_URL) {
  throw new Error('Invalid environment variable: "WEB3_URL"');
}

const envConfig = {
  ipfsKey: import.meta.env.IPFS_KEY as string,
  ipfsProof: import.meta.env.IPFS_PROOF as string,
  testAddress: import.meta.env.TEST_ADDRESS as string,
  contractAddress: import.meta.env.CONTRACT_ADDRESS as string,
  web3Url: import.meta.env.WEB3_URL as string,
  walletPrivateKey: import.meta.env.WALLET_PRIVATE_KEY as string,
} as const;

export default envConfig;
