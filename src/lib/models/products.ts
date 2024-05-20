import type { TProduct } from "../../common/types/product.ts";
import { getMongo } from "../mongo.ts";

const mongo = await getMongo();

const productSchema = new mongo.Schema<TProduct>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
});

export const Product = mongo.model('Product', productSchema);