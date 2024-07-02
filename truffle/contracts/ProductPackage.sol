// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ProductPackage {
    mapping(bytes32 => string[]) private packageDataMap;

    function addPackageData(string memory _cid, bytes32 _packageId) public {
        packageDataMap[_packageId].push(_cid);
    }

    function getCIDsByPackageId(bytes32 _packageId) public view returns (string[] memory) {
        return packageDataMap[_packageId];
    }
}