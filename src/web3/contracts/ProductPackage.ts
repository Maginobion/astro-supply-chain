import ProductPackageContract from "../../../truffle/build/contracts/ProductPackage.json";
import envConfig from "../../config/env/env";
import web3Provider from "../config";

const ProductPackageContractEntity = new web3Provider.eth.Contract(
  ProductPackageContract.abi,
  envConfig.contractAddress
);

export default ProductPackageContractEntity;
