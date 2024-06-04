import type { TPackage } from "../../common/types/package.ts";
import { Package } from "../models/package.ts";

export const getPackages = async (): Promise<TPackage[]> => {
    const packages = await Package.find().exec();
    return packages;
}

export const getPackageById = async (id: string): Promise<TPackage | null> => {
    const packageItem = await Package.findById(id).exec();
    return packageItem;
}

export const createPackage = async (packageData: Omit<TPackage, '_id'>): Promise<TPackage> => {
    const packageItem = await Package.create(packageData);
    return packageItem;
}

export const deletePackage = async (packageId: string): Promise<boolean> => {
    const packageItem = await Package.deleteOne({ _id: packageId });
    return packageItem.acknowledged;
}