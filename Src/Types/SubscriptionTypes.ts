export interface SubscriptionData {
  _id: string;
  date: number;
  payment_response: {
    autoRenewing: boolean;
    productId: string;
    purchaseState: number | string;
    transactionDate: number;
    transactionId: string;
    [key: string]: any;
  };
  user_id: string;
  isActive?: boolean;
}

export interface MembershipState {
  subscription: SubscriptionData | null;
  isSubscriptionActive: boolean;
  isLoading: boolean;
  error: string | null;
  lastExpiredSubscriptionId?: string;
  lastCancelledSubscription?: {
    subscriptionId: string;
    cancelledAt: number;
    reason: string;
  };
  validationStatus?: {
    isValid: boolean;
    lastValidated: number;
    validationError?: string;
  };
}
