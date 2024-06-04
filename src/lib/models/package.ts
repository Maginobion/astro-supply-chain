import type { TPackage, ProductInstance } from "../../common/types/package.ts";
import { getMongo } from "../mongo.ts";

const mongo = await getMongo();

const productInstanceSchema = new mongo.Schema<ProductInstance>({
    productId: { type: String, required: true },
    serial: { type: String, required: true, unique: true },
    tag: { type: String, required: true, unique: true}
});

const packageSchema = new mongo.Schema<TPackage>({
    lpn: { type: String, required: true, unique: true },
    locationId: { type: String, required: true },
    contents: [productInstanceSchema],
});

export const Package = mongo.model('Package', packageSchema);