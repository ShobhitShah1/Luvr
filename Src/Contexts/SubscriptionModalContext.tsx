import React, { createContext, useCallback, useContext, useState } from 'react';
import SubscriptionModalView from '../Components/Subscription/SubscriptionModalView';

interface SubscriptionModalContextType {
  showSubscriptionModal: (options?: ShowSubscriptionModalOptions) => void;
  hideSubscriptionModal: () => void;
  isVisible: boolean;
  selectedPlan?: string;
  handlePlanSelection?: (key: string) => void;
}

interface ShowSubscriptionModalOptions {
  selectedPlan?: string;
  handlePlanSelection?: (key: string) => void;
}

const SubscriptionModalContext = createContext<SubscriptionModalContextType | undefined>(undefined);

export const SubscriptionModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>();
  const [handlePlanSelection, setHandlePlanSelection] = useState<((key: string) => void) | undefined>();

  const showSubscriptionModal = useCallback((options?: ShowSubscriptionModalOptions) => {
    if (options?.selectedPlan) {
      setSelectedPlan(options.selectedPlan);
    }
    if (options?.handlePlanSelection) {
      setHandlePlanSelection(() => options.handlePlanSelection);
    }

    setIsVisible(true);
  }, []);

  const hideSubscriptionModal = useCallback(() => {
    setIsVisible(false);
    setSelectedPlan(undefined);
    setHandlePlanSelection(undefined);
  }, [isVisible, selectedPlan, handlePlanSelection]);

  return (
    <SubscriptionModalContext.Provider
      value={{
        showSubscriptionModal,
        hideSubscriptionModal,
        isVisible,
        selectedPlan,
        handlePlanSelection,
      }}
    >
      {children}
      <SubscriptionModalView
        isVisible={isVisible}
        onClose={hideSubscriptionModal}
        selectedPlan={selectedPlan}
        handlePlanSelection={handlePlanSelection}
      />
    </SubscriptionModalContext.Provider>
  );
};

export const useSubscriptionModal = () => {
  const context = useContext(SubscriptionModalContext);
  if (context === undefined) {
    throw new Error('useSubscriptionModal must be used within a SubscriptionModalProvider');
  }
  return context;
};
