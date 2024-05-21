import type { TProduct } from "../../common/types/product.ts";
import { Product } from "../models/products.ts";

export const getProducts = async (): Promise<TProduct[]> => {
    const products = await Product.find().exec();
    return products;
}

export const getProductById = async (id: string): Promise<TProduct | null> => {
    const product = await Product.findById(id).exec();
    return product;
}

export const createProduct = async (productData: Omit<TProduct, '_id'>): Promise<TProduct> => {
    const product = await Product.create(productData);
    return product;
}

export const deleteProduct = async (productId: string): Promise<boolean> => {
    const product = await Product.deleteOne({ _id: productId });
    return product.acknowledged;
}