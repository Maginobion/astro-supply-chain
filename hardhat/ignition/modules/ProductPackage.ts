import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ProductPackageModule = buildModule("ProductPackageModule", (m) => {
  const productPackage = m.contract("ProductPackage");

  return { productPackage };
});

export default ProductPackageModule;
