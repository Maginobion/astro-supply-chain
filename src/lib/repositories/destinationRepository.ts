import type { TDestination } from "../../common/types/destination.ts";
import { Destination } from "../models/destinations.ts";

export const getDestinations = async (): Promise<TDestination[]> => {
    const destinations = await Destination.find().exec();
    return destinations;
}

export const getDestinationById = async (id: string): Promise<TDestination | null> => {
    const product = await Destination.findById(id).exec();
    return product;
}

export const createDestination = async (destinationData: Omit<TDestination, '_id'>): Promise<TDestination> => {
    const product = await Destination.create(destinationData);
    return product;
}

export const deleteDestination = async (productId: string): Promise<boolean> => {
    const product = await Destination.deleteOne({ _id: productId });
    return product.acknowledged;
}