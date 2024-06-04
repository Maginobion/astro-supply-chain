export type TPackage = {
    _id: string;
    locationId: string;
    lpn: string;
    contents: ProductInstance[]
}

export type ProductInstance = {
    productId: string;
    serial: string;
    tag: string;
}