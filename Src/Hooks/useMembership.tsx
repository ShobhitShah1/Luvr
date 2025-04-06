import remoteConfig from '@react-native-firebase/remote-config';
import { useEffect, useState } from 'react';
import {
  finishTransaction,
  getAvailablePurchases,
  getSubscriptions,
  initConnection,
  ProductPurchase,
  requestSubscription,
  Subscription,
} from 'react-native-iap';
import { Platform } from 'react-native';

// Types for our subscription data
interface SubscriptionBenefit {
  key: string;
  title: string;
  description: string;
  benefits: string[];
}

interface MembershipConfig {
  subscriptions: SubscriptionBenefit[];
}

interface PricingPhase {
  recurrenceMode: number;
  priceAmountMicros: string;
  billingCycleCount: number;
  billingPeriod: string;
  priceCurrencyCode: string;
  formattedPrice: string;
}

interface SubscriptionOfferDetail {
  pricingPhases: {
    pricingPhaseList: PricingPhase[];
  };
  offerToken: string;
  offerTags: string[];
  offerId: string | null;
  basePlanId: string;
}

interface EnrichedSubscription {
  // From remote config
  key: string;
  title: string;
  description: string;
  benefits: string[];
  // From IAP
  productId: string;
  name: string;
  price: string;
  formattedPrice: string;
  currency: string;
  localizedPrice: string;
  billingPeriod?: string;
  // Android specific
  subscriptionOfferDetails?: SubscriptionOfferDetail[];
  offerToken?: string;
  // iOS specific
  introductoryPrice?: string;
  subscriptionPeriodNumberIOS?: string;
  subscriptionPeriodUnitIOS?: string;
  subscriptionPeriodAndroid?: string;
}

interface UseMembershipReturn {
  loading: boolean;
  error: string | null;
  subscriptions: EnrichedSubscription[];
  userSubscriptions: ProductPurchase[];
  isSubscribed: boolean;
  currentPlan: string | null;
  initializeIAP: () => Promise<boolean>;
  purchasePlan: (productId: string, offerToken?: string) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  refreshSubscriptions: () => Promise<void>;
}

const useMembership = (): UseMembershipReturn => {
  // States
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [configData, setConfigData] = useState<MembershipConfig | null>(null);
  const [subscriptions, setSubscriptions] = useState<EnrichedSubscription[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<ProductPurchase[]>([]);

  // Computed values
  const isSubscribed = userSubscriptions.length > 0;
  const currentPlan = isSubscribed ? userSubscriptions[0]?.productId : null;

  // Initialize connection on mount
  useEffect(() => {
    initializeIAP();
  }, []);

  // Get config data and load subscriptions when initialized
  useEffect(() => {
    if (isInitialized) {
      fetchConfigAndSubscriptions();
    }
  }, [isInitialized]);

  // Initialize IAP connection
  const initializeIAP = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await initConnection();
      setIsInitialized(true);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize IAP';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Extract price and currency information based on platform
  const extractPriceInfo = (
    product: any
  ): {
    price: string;
    currency: string;
    formattedPrice: string;
    offerToken?: string;
    billingPeriod?: string;
  } => {
    if (Platform.OS === 'android' && product.subscriptionOfferDetails) {
      // For Android, extract from the first offer in subscriptionOfferDetails
      const offer = product.subscriptionOfferDetails[0];
      const pricingPhase = offer.pricingPhases.pricingPhaseList[0];

      return {
        price: (parseInt(pricingPhase.priceAmountMicros) / 1000000).toString(),
        currency: pricingPhase.priceCurrencyCode,
        formattedPrice: pricingPhase.formattedPrice,
        offerToken: offer.offerToken,
        billingPeriod: pricingPhase.billingPeriod,
      };
    } else {
      // For iOS or older Android implementation
      return {
        price: product.price || '',
        currency: product.currency || '',
        formattedPrice: product.localizedPrice || '',
      };
    }
  };

  // Fetch config from remote config and load subscriptions
  const fetchConfigAndSubscriptions = async (): Promise<void> => {
    try {
      setLoading(true);

      // Fetch remote config
      await remoteConfig().fetchAndActivate();
      const rawConfigData = remoteConfig().getValue('Membership').asString();

      if (!rawConfigData) {
        throw new Error('No membership data found in remote config');
      }

      const parsedConfig: MembershipConfig = JSON.parse(rawConfigData);
      setConfigData(parsedConfig);

      // Get product IDs from config
      const productIds = parsedConfig.subscriptions.map((sub) => sub.key);

      // Fetch subscription details from store
      const products = await getSubscriptions({ skus: productIds });
      console.log('Products fetched:', products.length);

      // Merge remote config data with IAP product data
      const enrichedSubscriptions = products
        .map((product: Subscription) => {
          //   console.log('Processing product:', JSON.stringify(product, null, 2));
          const configItem = parsedConfig.subscriptions.find((sub) => sub.key === product.productId);

          if (!configItem) {
            console.warn(`Config not found for product: ${product.productId}`);
            return null;
          }

          const priceInfo = extractPriceInfo(product);

          return {
            ...configItem,
            productId: product.productId,
            name: product.name || '',
            title: product.title || '',
            description: configItem.description || product.description || '',
            price: priceInfo.price,
            currency: priceInfo.currency,
            formattedPrice: priceInfo.formattedPrice,
            localizedPrice: product.localizedPrice || priceInfo.formattedPrice,
            billingPeriod: priceInfo.billingPeriod,
            offerToken: priceInfo.offerToken,
            // Keep original product data for reference
            subscriptionOfferDetails: product.subscriptionOfferDetails,
            // iOS specific fields
            introductoryPrice: product.introductoryPrice,
            subscriptionPeriodNumberIOS: product.subscriptionPeriodNumberIOS,
            subscriptionPeriodUnitIOS: product.subscriptionPeriodUnitIOS,
            subscriptionPeriodAndroid: product.subscriptionPeriodAndroid,
          } as EnrichedSubscription;
        })
        .filter(Boolean) as EnrichedSubscription[];

      console.log('Enriched subscriptions:', JSON.stringify(enrichedSubscriptions, null, 2));
      setSubscriptions(enrichedSubscriptions);

      // Load user's existing purchases
      await refreshSubscriptions();
    } catch (err) {
      console.error('Error in fetchConfigAndSubscriptions:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load subscription data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Purchase a subscription
  const purchasePlan = async (productId: string, offerToken?: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Check if already subscribed to this plan
      if (currentPlan === productId) {
        return true;
      }

      // Find the subscription to get the offerToken if not provided
      if (Platform.OS === 'android' && !offerToken) {
        const subscription = subscriptions.find((sub) => sub.productId === productId);
        offerToken = subscription?.offerToken;
      }

      // Purchase the subscription
      if (Platform.OS === 'android' && offerToken) {
        await requestSubscription({
          sku: productId,
          ...(offerToken && { subscriptionOffers: [{ sku: productId, offerToken }] }),
        });
      } else {
        await requestSubscription({ sku: productId });
      }

      // Refresh the user's subscriptions
      await refreshSubscriptions();

      return true;
    } catch (err) {
      console.error('Error in purchasePlan:', err);
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Restore purchases
  const restorePurchases = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await refreshSubscriptions();

      return userSubscriptions.length > 0;
    } catch (err) {
      console.error('Error in restorePurchases:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore purchases';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user's subscriptions
  const refreshSubscriptions = async (): Promise<void> => {
    try {
      const purchases = await getAvailablePurchases();
      console.log('Available purchases:', purchases.length);

      // Filter to only active subscriptions
      const activeSubscriptions = purchases.filter((purchase) => {
        // For a more accurate check, you should implement platform-specific logic
        // to verify if subscriptions are still active based on expiry dates

        // For Android, you might need to check purchase.isAutoRenewing
        // For iOS, you might need to check the latest receipt data

        return true; // For now, assume all returned purchases are active
      });

      console.log('Active subscriptions:', activeSubscriptions.length);
      setUserSubscriptions(activeSubscriptions);

      // Finish transactions if needed
      for (const purchase of purchases) {
        if (Platform.OS === 'android' && !purchase.isAcknowledgedAndroid) {
          await finishTransaction({ purchase });
        }
      }
    } catch (err) {
      console.error('Error in refreshSubscriptions:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh subscriptions';
      setError(errorMessage);
    }
  };

  return {
    loading,
    error,
    subscriptions,
    userSubscriptions,
    isSubscribed,
    currentPlan,
    initializeIAP,
    purchasePlan,
    restorePurchases,
    refreshSubscriptions,
  };
};

export default useMembership;
