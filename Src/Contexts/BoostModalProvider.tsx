import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BoostModal from '../Components/Subscription/BoostModal';
import { hideBoostModal, purchaseBoost } from '../Redux/Action/BoostModalActions';
import { RootState } from '../Redux/Store/store';
import { AppDispatch } from '../Redux/Action/Index';

interface BoostModalProviderProps {
  children: React.ReactNode;
}

export const BoostModalProvider: React.FC<BoostModalProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isVisible, isLoading } = useSelector(
    (state: RootState) => state.boostModal || { isVisible: false, isLoading: false }
  );

  const handleClose = () => {
    dispatch(hideBoostModal());
  };

  const handleBoostMe = () => {
    dispatch(purchaseBoost());
  };

  return (
    <>
      {children}
      <BoostModal isVisible={isVisible} onClose={handleClose} isLoading={isLoading} onBoostMe={handleBoostMe} />
    </>
  );
};
