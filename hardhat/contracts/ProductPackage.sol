// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ProductPackage {
    mapping(bytes32 => string[]) private packageDataMap;

    function addPackageData(string memory _cid, bytes32 _packageId) public {
        packageDataMap[_packageId].push(_cid);
    }

    function getCIDsByPackageId(bytes32 _packageId) public view returns (string[] memory) {
        return packageDataMap[_packageId];
    }
}
