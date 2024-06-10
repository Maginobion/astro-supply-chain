import { create } from 'zustand'
import type { TDestination } from '../common/types/destination';

interface DestinationState {
    destinations: TDestination[] | null;
    destinationError: string | null;
}

interface DestinationStore extends DestinationState {
    setDestinations: (destinations: TDestination[]) => void;
    reset: () => void;
}

const DESTINATION_STORE_INITIAL_STATE: DestinationState = {
    destinations: null,
    destinationError: null,
}

const useDestinationStore = create<DestinationStore>()(
    (set, get) => ({
        ...DESTINATION_STORE_INITIAL_STATE,
        setDestinations: (destinations) => {
            set({ destinations })
        },
        reset: () => {
            set({ ...DESTINATION_STORE_INITIAL_STATE })
        }
    }),
)

export default useDestinationStore;