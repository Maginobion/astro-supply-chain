import type { TDestination } from "../../common/types/destination.ts";
import { Destination } from "../models/destinations.ts";

export const getDestinations = async (): Promise<TDestination[]> => {
    const destinations = await Destination.find().exec();
    return destinations;
}

export const getDestinationById = async (id: string): Promise<TDestination | null> => {
    const destination = await Destination.findById(id).exec();
    return destination;
}

export const createDestination = async (destinationData: Omit<TDestination, '_id'>): Promise<TDestination> => {
    const destination = await Destination.create(destinationData);
    return destination;
}

export const deleteDestination = async (productId: string): Promise<boolean> => {
    const destination = await Destination.deleteOne({ _id: productId });
    return destination.acknowledged;
}