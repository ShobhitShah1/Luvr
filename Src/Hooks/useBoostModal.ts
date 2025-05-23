import { useDispatch, useSelector } from 'react-redux';

import { showBoostModal, hideBoostModal } from '../Redux/Action/BoostModalActions';
import type { AppDispatch } from '../Redux/Action/Index';
import type { RootState } from '../Redux/Store/store';

export const useBoostModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isVisible, isLoading, error } = useSelector(
    (state: RootState) => state.boostModal || { isVisible: false, isLoading: false, error: null },
  );

  const showModal = () => {
    dispatch(showBoostModal());
  };

  const hideModal = () => {
    dispatch(hideBoostModal());
  };

  return {
    isVisible,
    isLoading,
    error,
    showModal,
    hideModal,
  };
};
