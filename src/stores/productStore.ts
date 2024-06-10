import { create } from 'zustand'
import type { TProduct } from '../common/types/product';

interface ProductState {
    products: TProduct[] | null;
    productError: string | null;
}

interface ProductStore extends ProductState {
    setProducts: (products: TProduct[]) => void;
    reset: () => void;
}

const PRODUCT_STORE_INITIAL_STATE: ProductState = {
    products: null,
    productError: null,
}

const useProductStore = create<ProductStore>()(
    (set, get) => ({
        ...PRODUCT_STORE_INITIAL_STATE,
        setProducts: (products) => {
            set({ products })
        },
        reset: () => {
            set({ ...PRODUCT_STORE_INITIAL_STATE })
        }
    }),
)

export default useProductStore;