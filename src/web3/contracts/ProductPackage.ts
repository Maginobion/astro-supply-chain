import ProductPackageContract from "../../../truffle/build/contracts/ProductPackage.json";
import web3Provider from "../config";

const ProductPackageContractEntity = new web3Provider.eth.Contract(
  ProductPackageContract.abi,
  "0x8D19D478537Ded02B8eC8879A18020e13Db112D7"
);

export default ProductPackageContractEntity;
