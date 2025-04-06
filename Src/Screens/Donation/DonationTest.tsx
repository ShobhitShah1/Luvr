import remoteConfig from '@react-native-firebase/remote-config';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  flushFailedPurchasesCachedAsPendingAndroid,
  getSubscriptions,
  initConnection,
  requestPurchase,
  Subscription,
} from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { FONTS } from '../../Common/Theme';
import GradientButton from '../../Components/AuthComponents/GradientButton';
import { useTheme } from '../../Contexts/ThemeContext';
import UserService from '../../Services/AuthService';
import { useCustomToast } from '../../Utils/toastUtils';

// Types
export interface SubscriptionPlan {
  key: string;
  title: string;
  description: string;
  benefits: string[];
  price?: string;
}

export interface DonationPlan {
  productId: string;
  price: string | number;
  title?: string;
}

export interface RemoteConfigData {
  subscriptions: SubscriptionPlan[];
  donations?: DonationPlan[];
}

// Tab options
type TabType = 'subscription' | 'donation';

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDark, colors } = useTheme();
  const { showToast } = useCustomToast();
  const membershipStore = useSelector((state: any) => state.membership);

  // States
  const [products, setProducts] = useState<Subscription[]>([]);
  const [membershipProductsList, setMembershipProductsList] = useState<SubscriptionPlan[]>([]);
  const [donationPlansList, setDonationPlansList] = useState<DonationPlan[]>([]);
  const [fetchingProducts, setFetchingProducts] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('subscription');
  const [isPaymentLoading, setPaymentLoader] = useState<boolean>(false);
  const [isPaymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [selectedDonationPlan, setSelectedDonationPlan] = useState<DonationPlan | null>(null);
  const [isIAPInitialized, setIsIAPInitialized] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      await fetchRemoteConfigValues();
      await setupIAP();
    };
    init();
  }, []);

  // Watch for changes in remote config data and refetch products
  useEffect(() => {
    if (isIAPInitialized && (membershipProductsList.length > 0 || donationPlansList.length > 0)) {
      fetchProducts();
    }
  }, [isIAPInitialized, membershipProductsList.length, donationPlansList.length]);

  /** Initialize IAP connection */
  const setupIAP = async (): Promise<void> => {
    try {
      // Initialize connection
      const connected = await initConnection();
      if (!connected) {
        showToast(TextString.error.toUpperCase(), 'Failed to connect to the store.', TextString.error);
        setFetchingProducts(false);
        return;
      }

      // Flush pending purchases on Android
      if (Platform.OS === 'android') {
        await flushFailedPurchasesCachedAsPendingAndroid();
      }

      setIsIAPInitialized(true);
    } catch (error) {
      console.error('Error setting up IAP:', error);
      setFetchingProducts(false);
      showToast(TextString.error.toUpperCase(), 'Failed to initialize payment system.', TextString.error);
    }
  };

  /** Fetch subscription and donation data from Firebase Remote Config */
  const fetchRemoteConfigValues = async (): Promise<void> => {
    try {
      await remoteConfig().fetchAndActivate();
      const configData = remoteConfig().getValue('Membership').asString();

      if (configData) {
        const parsedData: RemoteConfigData = JSON.parse(configData);
        console.log('Remote config data:', parsedData);

        if (parsedData.subscriptions?.length > 0) {
          setMembershipProductsList(parsedData.subscriptions);
        }

        // Set donation plans from remote config if available, otherwise use from Redux store
        if (parsedData.donations?.length > 0) {
          setDonationPlansList(parsedData.donations);
          setSelectedDonationPlan(parsedData.donations[0]);
        } else if (membershipStore?.membershipProducts?.length > 0) {
          setDonationPlansList(membershipStore.membershipProducts);
          setSelectedDonationPlan(membershipStore.membershipProducts[0]);
        }
      } else {
        // Fallback to Redux store if remote config is empty
        if (membershipStore?.membershipProducts?.length > 0) {
          setDonationPlansList(membershipStore.membershipProducts);
          setSelectedDonationPlan(membershipStore.membershipProducts[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching remote config:', error);
      // Fallback to Redux store on error
      if (membershipStore?.membershipProducts?.length > 0) {
        setDonationPlansList(membershipStore.membershipProducts);
        setSelectedDonationPlan(membershipStore.membershipProducts[0]);
      }
    }
  };

  /** Fetch product details from the store */
  const fetchProducts = async (): Promise<void> => {
    try {
      // Collect all product IDs from memberships and donations
      const subscriptionSkus = membershipProductsList.map((item) => item.key);
      const donationSkus = donationPlansList.map((item) => item.productId);

      // Combine all SKUs and filter out empty values
      const allSkus = subscriptionSkus;
      // const allSkus = [...new Set([...subscriptionSkus, ...donationSkus])].filter(Boolean);

      if (allSkus.length === 0) {
        console.warn('No SKUs found to fetch products');
        setFetchingProducts(false);
        return;
      }

      console.log('Fetching products for SKUs:', allSkus);

      // Fetch products from the store
      const storeProducts = await getSubscriptions({ skus: allSkus });
      console.log('Fetched products:', storeProducts);

      if (storeProducts.length > 0) {
        setProducts(storeProducts);
        updateProductsWithPrices(storeProducts);
      } else {
        // Handle case when no products were returned
        showToast('Warning', 'Product information not available from the store.', 'warning');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Error', 'Failed to fetch product details from the store.', 'error');
    } finally {
      setFetchingProducts(false);
    }
  };

  /** Update local product data with prices from the store */
  const updateProductsWithPrices = (storeProducts: Subscription[]): void => {
    // Map products by ID for easy lookup
    const productsMap = storeProducts.reduce(
      (acc, product) => {
        acc[product.productId] = product;
        return acc;
      },
      {} as Record<string, Subscription>
    );

    console.log('Products Map:', productsMap);

    // Update subscription plans with prices
    const updatedSubscriptions = membershipProductsList.map((plan) => {
      const product = productsMap[plan.key];
      return {
        ...plan,
        price: product?.title || plan.price || 'Contact Support',
      };
    });

    // Update donation plans with prices
    const updatedDonations = donationPlansList.map((plan) => {
      const product = productsMap[plan.productId];
      return {
        ...plan,
        price: product?.localizedPrice || plan.price,
        title: product?.title || `Donate ${plan.price}`,
      };
    });

    setMembershipProductsList(updatedSubscriptions);
    setDonationPlansList(updatedDonations);

    // Set first donation plan as selected if available
    if (updatedDonations.length > 0 && !selectedDonationPlan) {
      setSelectedDonationPlan(updatedDonations[0]);
    }
  };

  /** Handle purchase request */
  const requestPurchaseHandler = async (sku: string): Promise<void> => {
    try {
      // Validate SKU exists in products
      const productExists = products.some((p) => p.productId === sku);
      if (!productExists) {
        showToast('Error', 'Product not available for purchase. Please try again.', 'error');
        return;
      }

      setPaymentLoader(true);
      await requestPurchase({ skus: [sku] });

      // If this is a donation, make the donation API call
      if (activeTab === 'donation' && selectedDonationPlan) {
        await donationAPICall();
      }
    } catch (error: any) {
      if (error?.message?.includes('Cancelled')) return;
      showToast('Error', String(error?.message || error), 'error');
    } finally {
      setPaymentLoader(false);
    }
  };

  /** Make API call for donation */
  const donationAPICall = async (): Promise<void> => {
    try {
      const donationAmount = selectedDonationPlan?.price || 0;
      const userDataForApi = {
        eventName: 'donation',
        donation_amount: donationAmount,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        setPaymentSuccess(true);
        showToast('Success', APIResponse?.message || 'Thanks for your donation', 'success');
      }
    } catch (error) {
      console.error('Donation API call error:', error);
    }
  };

  /** Select a donation plan */
  const selectDonationPlan = (plan: DonationPlan): void => {
    setSelectedDonationPlan(plan);
  };

  /** Retry fetching products */
  const retryFetchProducts = (): void => {
    setFetchingProducts(true);
    fetchProducts();
  };

  /** Render tab navigation buttons */
  const renderTabButtons = (): JSX.Element => (
    <View style={styles.tabContainer}>
      <LinearGradient
        colors={
          isDark
            ? ['rgba(36, 36, 48, 0.8)', 'rgba(36, 36, 48, 0.8)']
            : ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.8)']
        }
        style={styles.tabBackground}
      >
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'subscription' && styles.activeTab]}
          onPress={() => setActiveTab('subscription')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'subscription' ? colors.Primary : isDark ? colors.DescriptionGray : colors.Gray,
              },
            ]}
          >
            Membership
          </Text>
          {activeTab === 'subscription' && (
            <LinearGradient
              colors={colors.ButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tabIndicator}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'donation' && styles.activeTab]}
          onPress={() => setActiveTab('donation')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'donation' ? colors.Primary : isDark ? colors.DescriptionGray : colors.Gray,
              },
            ]}
          >
            Donation
          </Text>
          {activeTab === 'donation' && (
            <LinearGradient
              colors={colors.ButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tabIndicator}
            />
          )}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  /** Render subscription tab content */
  const renderSubscriptionTab = (): JSX.Element => (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.sectionTitle, { color: colors.TitleText }]}>Premium Memberships</Text>

      {fetchingProducts ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.Primary} />
          <Text style={[styles.loadingText, { color: colors.TextColor }]}>Loading membership options...</Text>
        </View>
      ) : membershipProductsList.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={[styles.noDataText, { color: colors.TextColor }]}>
            No membership plans available at the moment.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={retryFetchProducts}>
            <Text style={[styles.retryText, { color: colors.Primary }]}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        membershipProductsList.map((membership, index) => {
          // Find product details
          const product = products.find((p) => p.productId === membership.key);
          const isProductAvailable = product !== undefined;

          return (
            <LinearGradient
              key={index}
              colors={
                isDark
                  ? ['rgba(36, 36, 48, 1)', 'rgba(45, 45, 58, 1)']
                  : ['rgba(255, 255, 255, 1)', 'rgba(248, 248, 248, 1)']
              }
              style={[
                styles.membershipCard,
                {
                  borderColor: isDark ? colors.BorderColor : colors.BorderColor,
                  shadowColor: colors.ShadowColor,
                  opacity: isProductAvailable ? 1 : 0.7,
                },
              ]}
            >
              <View style={styles.membershipHeaderRow}>
                <Text style={[styles.membershipTitle, { color: colors.TitleText }]}>{membership.title}</Text>
                <LinearGradient
                  colors={colors.ButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.priceBadge}
                >
                  <Text style={styles.priceText}>{membership.price}</Text>
                </LinearGradient>
              </View>

              <Text style={[styles.membershipDescription, { color: colors.TextColor }]}>{membership.description}</Text>

              <Text style={[styles.benefitsTitle, { color: colors.TitleText }]}>Premium Features:</Text>

              <View style={styles.benefitsList}>
                {membership.benefits.map((benefit: string, idx: number) => (
                  <View key={idx} style={styles.benefitRow}>
                    <LinearGradient colors={colors.ButtonGradient} style={styles.checkmarkCircle}>
                      <Image source={CommonIcons.CheckMark} style={styles.checkmarkIcon} tintColor={colors.White} />
                    </LinearGradient>
                    <Text style={[styles.benefitItem, { color: colors.TextColor }]}>{benefit}</Text>
                  </View>
                ))}
              </View>

              <GradientButton
                Title={`Get ${membership.title}`}
                isLoading={isPaymentLoading}
                Navigation={() => requestPurchaseHandler(membership.key)}
                Disabled={!isProductAvailable}
              />

              {!isProductAvailable && (
                <Text style={[styles.productUnavailableText, { color: colors.red }]}>
                  Product temporarily unavailable
                </Text>
              )}
            </LinearGradient>
          );
        })
      )}
    </ScrollView>
  );

  /** Render donation tab content */
  const renderDonationTab = (): JSX.Element => (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={[styles.scrollContent, styles.donationScrollContent]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.donationContentContainer}>
        <LinearGradient
          colors={isDark ? colors.ButtonGradient : [colors.lightFiledBackground, colors.lightFiledBackground]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.donateIconContainer}
        >
          <Image
            tintColor={isDark ? colors.White : colors.Primary}
            source={CommonIcons.ic_donation_new}
            style={styles.donateIcon}
          />
        </LinearGradient>

        <Text style={[styles.donateTitle, { color: colors.TitleText }]}>
          {isPaymentSuccess ? 'Thank You for Your Support!' : 'Support Our App'}
        </Text>

        <Text
          style={[styles.donateDescription, { color: isDark ? colors.DescriptionGray : colors.SecondaryTextColor }]}
        >
          {isPaymentSuccess
            ? 'Your contribution helps us create a better experience for our entire community. We truly appreciate your generosity!'
            : 'Your donation directly supports our team in maintaining and enhancing the app with new features.'}
        </Text>

        {fetchingProducts ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.Primary} />
            <Text style={[styles.loadingText, { color: colors.TextColor }]}>Loading donation options...</Text>
          </View>
        ) : (
          !isPaymentSuccess && (
            <>
              <View style={styles.impactContainer}>
                <View style={styles.impactItem}>
                  <Text style={[styles.impactTitle, { color: colors.TitleText }]}>New Features</Text>
                  <Text style={[styles.impactDescription, { color: colors.SecondaryTextColor }]}>
                    Help us build exciting new capabilities
                  </Text>
                </View>
                <View style={styles.impactItem}>
                  <Text style={[styles.impactTitle, { color: colors.TitleText }]}>Better Security</Text>
                  <Text style={[styles.impactDescription, { color: colors.SecondaryTextColor }]}>
                    Support our privacy and security efforts
                  </Text>
                </View>
              </View>

              <Text style={[styles.chooseAmountText, { color: colors.TitleText }]}>Select your contribution:</Text>

              <View style={styles.donationOptionsContainer}>
                {donationPlansList.length > 0 ? (
                  donationPlansList.map((plan, index) => {
                    const isSelected = selectedDonationPlan?.productId === plan.productId;
                    const product = products.find((p) => p.productId === plan.productId);
                    const isProductAvailable = product !== undefined;

                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => selectDonationPlan(plan)}
                        style={[
                          styles.donationCardWrapper,
                          isSelected && styles.selectedDonationCardWrapper,
                          !isProductAvailable && styles.unavailableDonationCard,
                        ]}
                        activeOpacity={0.8}
                        disabled={!isProductAvailable}
                      >
                        <LinearGradient
                          colors={
                            isSelected
                              ? colors.ButtonGradient
                              : isDark
                                ? ['rgba(36, 36, 48, 0.8)', 'rgba(45, 45, 58, 0.8)']
                                : ['rgba(240, 236, 255, 0.8)', 'rgba(240, 236, 255, 0.8)']
                          }
                          style={[styles.donationCard, isSelected && styles.selectedDonationCard]}
                        >
                          <Text
                            style={[
                              styles.donationAmount,
                              {
                                color: isSelected ? colors.White : colors.TextColor,
                              },
                            ]}
                          >
                            {plan.price}
                          </Text>
                          {isSelected && (
                            <View style={styles.checkmarkContainer}>
                              <Image
                                source={CommonIcons.CheckMark}
                                style={styles.smallCheckIcon}
                                tintColor={colors.White}
                              />
                            </View>
                          )}
                          {!isProductAvailable && (
                            <Text style={[styles.unavailableText, { color: colors.red }]}>Unavailable</Text>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={[styles.noDataText, { color: colors.TextColor }]}>
                      No donation options available at the moment
                    </Text>
                    <TouchableOpacity style={styles.retryButton} onPress={retryFetchProducts}>
                      <Text style={[styles.retryText, { color: colors.Primary }]}>Refresh</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          )
        )}

        <View style={styles.donateButtonContainer}>
          <GradientButton
            Title={isPaymentSuccess ? 'Donate Again' : 'Support Now'}
            isLoading={isPaymentLoading}
            Navigation={() => selectedDonationPlan && requestPurchaseHandler(selectedDonationPlan.productId)}
            Disabled={
              !selectedDonationPlan ||
              fetchingProducts ||
              !products.some((p) => p.productId === selectedDonationPlan.productId)
            }
          />

          {!isPaymentSuccess && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.laterButtonContainer}>
              <Text style={[styles.mayBeLaterButton, { color: isDark ? colors.DescriptionGray : colors.Gray }]}>
                Maybe later
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <GradientView>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header with back button */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <Image
                tintColor={colors.TextColor}
                source={CommonIcons.TinderBack}
                resizeMode="contain"
                style={styles.backIcon}
              />
            </Pressable>
            <Text style={[styles.headerTitle, { color: colors.TitleText }]}>
              {activeTab === 'subscription' ? 'Memberships' : 'Support Us'}
            </Text>
          </View>

          {/* Tab Navigation */}
          {renderTabButtons()}

          {/* Tab Content */}
          <View style={styles.contentContainer}>
            {activeTab === 'subscription' ? renderSubscriptionTab() : renderDonationTab()}
          </View>
        </View>
      </SafeAreaView>
    </GradientView>
  );
};

export default memo(PaymentScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 5,
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  tabContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tabBackground: {
    flexDirection: 'row',
    borderRadius: 30,
    overflow: 'hidden',
    padding: 5,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 25,
  },
  activeTab: {},
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    width: '50%',
    height: 3,
    borderRadius: 1.5,
  },
  tabText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  donationScrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: FONTS.Bold,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 15,
    fontFamily: FONTS.Regular,
    fontSize: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    width: '100%',
  },
  noDataText: {
    fontFamily: FONTS.Regular,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(106, 90, 224, 0.1)',
  },
  retryText: {
    fontFamily: FONTS.Medium,
    fontSize: 14,
  },
  productUnavailableText: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  membershipCard: {
    borderRadius: 16,
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  membershipHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  membershipTitle: {
    fontSize: 20,
    fontFamily: FONTS.Bold,
    flex: 1,
  },
  priceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  priceText: {
    color: 'white',
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
  },
  membershipDescription: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    marginBottom: 15,
    lineHeight: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    marginBottom: 12,
  },
  benefitsList: {
    marginBottom: 20,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkmarkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkmarkIcon: {
    width: 12,
    height: 12,
  },
  smallCheckIcon: {
    width: 14,
    height: 14,
  },
  benefitItem: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    flex: 1,
  },
  donationContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  donateIconContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  donateIcon: {
    width: 65,
    height: 65,
  },
  donateTitle: {
    fontSize: 26,
    fontFamily: FONTS.Bold,
    textAlign: 'center',
    marginBottom: 16,
  },
  donateDescription: {
    fontSize: 16,
    fontFamily: FONTS.Regular,
    textAlign: 'center',
    marginBottom: 35,
    paddingHorizontal: 15,
    lineHeight: 24,
  },
  impactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  impactItem: {
    alignItems: 'center',
    width: '45%',
    padding: 16,
    borderRadius: 15,
    backgroundColor: 'rgba(240, 240, 255, 0.2)',
  },
  impactTitle: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
    marginBottom: 6,
  },
  impactDescription: {
    fontSize: 13,
    fontFamily: FONTS.Regular,
    textAlign: 'center',
    lineHeight: 18,
  },

  chooseAmountText: {
    fontSize: 19,
    fontFamily: FONTS.SemiBold,
    marginBottom: 20,
    textAlign: 'center',
  },
  donationOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 35,
    width: '100%',
  },

  // New card-style donation options
  donationCardWrapper: {
    margin: 8,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  selectedDonationCardWrapper: {
    shadowColor: '#6A5AE0',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  donationCard: {
    width: 120,
    height: 90,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedDonationCard: {
    // Selection is shown with gradient colors
  },
  donationAmount: {
    fontSize: 20,
    fontFamily: FONTS.Bold,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  donateButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 25,
    paddingTop: 20,
  },
  donateButton: {
    width: '90%',
    borderRadius: 12,
    height: 54,
  },
  laterButtonContainer: {
    padding: 12,
  },
  mayBeLaterButton: {
    fontSize: 16,
    fontFamily: FONTS.Medium,
  },
});
