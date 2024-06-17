import type { TPackage } from "../../common/types/package.ts";
import { Package } from "../models/package.ts";

export const getPackages = async (): Promise<TPackage[]> => {
  const packages = await Package.find().exec();
  return packages;
};

export const getPackageById = async (id: string): Promise<TPackage | null> => {
  const packageItem = await Package.findById(id).exec();
  return packageItem;
};

export const getPackagesById = async (
  packageIds: string[]
): Promise<TPackage[]> => {
  const packages = await Package.find({ _id: { $in: packageIds } }).exec();
  return packages;
};

export const createPackage = async (
  packageData: Omit<TPackage, "_id">
): Promise<TPackage> => {
  const packageItem = await Package.create(packageData);
  return packageItem;
};

export const updatePackagesLocation = async (
  packageIds: string[],
  newLocationId: string
): Promise<boolean> => {
  const packageItem = await Package.updateMany(
    { _id: { $in: packageIds } },
    { locationId: newLocationId }
  ).exec();
  return packageItem.acknowledged;
};

export const deletePackage = async (packageId: string): Promise<boolean> => {
  const packageItem = await Package.deleteOne({ _id: packageId });
  return packageItem.acknowledged;
};

export const isProductTagUnique = async (tag: string): Promise<boolean> => {
  const packageItem = await Package.findOne({ "contents.tag": tag });
  return packageItem === null;
};
