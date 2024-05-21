import type { TDestination } from "../../common/types/destination.ts";
import { getMongo } from "../mongo.ts";

const mongo = await getMongo();

const destinationSchema = new mongo.Schema<TDestination>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: Boolean, required: true },
    type: { type: String, required: true },
});

export const Destination = mongo.model('Destination', destinationSchema);