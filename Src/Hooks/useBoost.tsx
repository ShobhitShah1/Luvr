import { useSelector } from 'react-redux';

import type { RootState } from '../Redux/Store/store';
import {
  cancelBoost,
  debouncedGetBoost,
  getBoostTimeRemaining,
  hasActiveBoost,
} from '../Services/BoostService';

export const useBoost = () => {
  const boostState = useSelector((state: RootState) => state.boost);

  return {
    isLoading: boostState?.isLoading || false,
    error: boostState?.error || null,
    activeBoost: boostState?.activeBoost || false,
    isBoostActive: hasActiveBoost(),
    timeRemaining: getBoostTimeRemaining(),
    refreshBoost: debouncedGetBoost,
    cancelBoost,
  };
};
