import ProductPackageContract from "../../../truffle/build/contracts/ProductPackage.json";
import web3Provider from "../config";

const ProductPackageContractEntity = new web3Provider.eth.Contract(
  ProductPackageContract.abi,
  "0x8D19D478537Ded02B8eC8879A18020e13Db112D7"
);

ProductPackageContractEntity.events.ProductCreated()
    .on('data', event => {
        console.log('Product Created:', event.returnValues);
        // Update UI or perform necessary actions
    })

ProductPackageContractEntity.events.ProductCreated()
.on('error', error => {
  console.error('Error with ProductCreated event:', error);
});

export default ProductPackageContractEntity;
