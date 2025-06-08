import React from 'react';

interface BoostTimerWrapperProps {
  children: React.ReactNode;
}

const BoostTimerWrapper: React.FC<BoostTimerWrapperProps> = ({ children }) => {
  // Uncomment this to use the boost timer hook that opens the boost modal after a certain time
  // useBoostTimer();

  return <>{children}</>;
};

export default BoostTimerWrapper;
