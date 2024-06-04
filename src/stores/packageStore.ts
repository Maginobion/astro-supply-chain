import { create } from 'zustand'
import type { TPackage } from '../common/types/package';
import { getPackages } from '../lib/repositories/packageRepository';

interface PackageState {
    packages: TPackage[] | null;
    packageError: string | null;
}

interface PackageStore extends PackageState {
  getPackages: () => Promise<TPackage[]>;
  reset: () => void;
}

const PACKAGE_STORE_INITIAL_STATE: PackageState = {
    packages: null,
    packageError: null,
}

const usePackageStore = create<PackageStore>()(
    (set, get) => ({
        ...PACKAGE_STORE_INITIAL_STATE,
        getPackages: async () => {
            const { packages: availablePackages } = get()
            if (availablePackages) return availablePackages;
            try {
                const packages = await getPackages()
                set({ packages: packages })
                return packages;
            } catch (e) {
                set({ packageError: "There was a problem fetching packages" })
                return []
            }
        },
        reset: () => {
            set({ ...PACKAGE_STORE_INITIAL_STATE })
        }
    }),
)

export default usePackageStore;