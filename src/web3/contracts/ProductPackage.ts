import ProductPackageContract from "../../../truffle/build/contracts/ProductPackage.json";
import web3Provider from "../config";

const ProductPackageContractEntity = new web3Provider.eth.Contract(
  ProductPackageContract.abi,
  "0xC1a15fbd403095c85FC0B3040ed918a58f3498A6"
);

// ProductPackageContractEntity.events.addPackageData().on("data", (event) => {
//   console.log("Product Created:", event.returnValues);
//   // Update UI or perform necessary actions
// });

// ProductPackageContractEntity.events.addPackageData().on("error", (error) => {
//   console.error("Error with ProductCreated event:", error);
// });

export default ProductPackageContractEntity;
