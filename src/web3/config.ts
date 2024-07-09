import { Web3 } from "web3";
import envConfig from "../config/env/env";

const web3Provider = new Web3(envConfig.web3Url);

if (envConfig.walletPrivateKey)
  web3Provider.eth.accounts.wallet.add("0x" + envConfig.walletPrivateKey);

export default web3Provider;
