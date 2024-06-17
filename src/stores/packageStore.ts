import { create } from "zustand";
import type { TPackage } from "../common/types/package";

interface PackageState {
  packages: TPackage[] | null;
  packageError: string | null;
}

interface PackageStore extends PackageState {
  setPackages: (packages: TPackage[]) => void;
  reset: () => void;
}

const PACKAGE_STORE_INITIAL_STATE: PackageState = {
  packages: null,
  packageError: null,
};

const usePackageStore = create<PackageStore>()((set, get) => ({
  ...PACKAGE_STORE_INITIAL_STATE,
  setPackages: (packages) => {
    set({ packages });
  },
  reset: () => {
    set({ ...PACKAGE_STORE_INITIAL_STATE });
  },
}));

export default usePackageStore;
