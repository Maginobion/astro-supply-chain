const Migrations = artifacts.require("../contracts/ProductPackage.sol");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
