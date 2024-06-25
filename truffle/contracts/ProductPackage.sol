// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ProductPackage {

    // Struct definition
    struct TProduct {
        bytes32 productId;
        bytes32 name;
        uint256 price;
        bytes32 description;
    }

    event ProductCreated(bytes32 indexed productId, bytes32 name, uint256 price, bytes32 description);


    // Mapping to store products
    mapping(string => TProduct) public products;

    // Function to create a new product
    function createProduct(string memory productId, bytes32 name, uint256 price, bytes32 description) public {
        require(products[productId].productId == bytes32(0), "Product already exists");

        TProduct memory newProduct = TProduct({
            productId: bytes32(abi.encodePacked(productId)),
            name: name,
            price: price,
            description: description
        });

        products[productId] = newProduct;

        emit ProductCreated(newProduct.productId, newProduct.name, newProduct.price, newProduct.description);
    }
}