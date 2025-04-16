export interface SubscriptionData {
  _id: string;
  date: number;
  payment_response: {
    autoRenewing: boolean;
    productId: string;
    purchaseState: number;
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
}
