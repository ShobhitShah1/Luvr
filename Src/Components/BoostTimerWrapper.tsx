import React from 'react';
import { useBoostTimer } from '../Hooks/useBoostTimer';

interface BoostTimerWrapperProps {
  children: React.ReactNode;
}

const BoostTimerWrapper: React.FC<BoostTimerWrapperProps> = ({ children }) => {
  // This will initialize the boost timer hook and handle the timer logic
  useBoostTimer();

  return <>{children}</>;
};

export default BoostTimerWrapper;
