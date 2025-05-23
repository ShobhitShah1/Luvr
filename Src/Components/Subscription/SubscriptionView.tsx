import { BlurView } from '@react-native-community/blur';
import remoteConfig from '@react-native-firebase/remote-config';
import React, { memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as RNIap from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';

import CommonIcons from '../../Common/CommonIcons';
import CommonImages from '../../Common/CommonImages';
import TextString from '../../Common/TextString';
import { FONTS } from '../../Common/Theme';
import ApiConfig from '../../Config/ApiConfig';
import { useSubscriptionModal } from '../../Contexts/SubscriptionModalContext';
import { useTheme } from '../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../Hooks/useCustomNavigation';
import UserService from '../../Services/AuthService';
import { debouncedGetSubscription } from '../../Services/SubscriptionService';
import type { SubscriptionPlanProps } from '../../Types/Interface';
import { getProfileData } from '../../Utils/profileUtils';
import { useCustomToast } from '../../Utils/toastUtils';
import OpenURL from '../OpenURL';

const { width } = Dimensions.get('window');

function SubscriptionView({
  selectedPlan: initialSelectedPlan,
  handlePlanSelection: externalHandlePlanSelection,
}: {
  selectedPlan?: string;
  handlePlanSelection?: (key: string) => void;
}) {
  const navigation = useCustomNavigation();

  const { isDark, colors } = useTheme();
  const { showToast } = useCustomToast();
  const { hideSubscriptionModal } = useSubscriptionModal();

  const [isProductFetchLoading, setIsProductFetchLoading] = useState(true);
  const [apiSubscriptionData, setApiSubscriptionData] = useState<SubscriptionPlanProps[]>([]);
  const [internalSelectedPlan, setInternalSelectedPlan] = useState<string>(
    initialSelectedPlan || '',
  );

  const [remoteConfigLinks, setRemoteConfigLinks] = useState<any>();
  const [subscriptionProducts, setSubscriptionProducts] = useState<RNIap.Subscription[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseProcessed, setPurchaseProcessed] = useState(false);

  const selectedPlan = initialSelectedPlan || internalSelectedPlan;

  const handlePlanSelection = (key: string) => {
    if (externalHandlePlanSelection) {
      externalHandlePlanSelection(key);
      setInternalSelectedPlan(key);
    } else {
      setInternalSelectedPlan(key);
    }
  };

  useEffect(() => {
    if (apiSubscriptionData.length > 0 && !selectedPlan) {
      const firstPlan = apiSubscriptionData[0]?.key;

      if (firstPlan) {
        handlePlanSelection(firstPlan);
      }
    }
  }, [apiSubscriptionData, selectedPlan]);

  const getRemoteConfigValue = async () => {
    await remoteConfig().fetch(100);
    const GetRemoteConfigLinks = remoteConfig().getAll();
    if (GetRemoteConfigLinks) {
      setRemoteConfigLinks(GetRemoteConfigLinks);
    }
  };

  const connectIAP = async (data: SubscriptionPlanProps[]) => {
    try {
      const connected = await RNIap.initConnection();

      if (connected) {
        const skus = data
          ? data.map(plan => plan.key)?.filter(value => value !== 'Free')
          : apiSubscriptionData.map(plan => plan.key)?.filter(value => value !== 'Free');

        if (skus?.length === 0) {
          return;
        }

        const products = await RNIap.getSubscriptions({ skus });
        setSubscriptionProducts(products);
      }
    } catch (error: any) {
      showToast(
        TextString.error?.toUpperCase(),
        error?.message?.toString() ||
          error?.Error?.toString() ||
          error?.error?.toString() ||
          error?.toString(),
        TextString.error,
      );
    } finally {
      setIsProductFetchLoading(false);
    }
  };

  useEffect(() => {
    setIsProductFetchLoading(apiSubscriptionData?.length === 0);
    getSubscriptionData();
    getRemoteConfigValue();
  }, []);

  useEffect(() => {
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async purchase => {
      if (purchase.transactionReceipt) {
        try {
          if (Platform.OS === 'android' && purchase.purchaseToken) {
            await RNIap.acknowledgePurchaseAndroid({ token: purchase.purchaseToken });
          }

          // For iOS, we don't need to acknowledge, but we should finish the transaction
          await RNIap.finishTransaction({ purchase, isConsumable: false });

          setPurchaseProcessed(true);
          setIsPurchasing(false);
        } catch (error: any) {
          setIsPurchasing(false);
          showToast(TextString.error?.toUpperCase(), error?.message?.toString(), TextString.error);
        }
      }
    });

    const purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
      setIsPurchasing(false);
      if (error.code !== 'E_USER_CANCELLED') {
        showToast(
          'Purchase Error',
          error?.message?.toString() || 'Failed to validate your purchase. Please contact support.',
          'error',
        );
      }
    });

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
      RNIap.endConnection();
    };
  }, []);

  const getSubscriptionData = async () => {
    try {
      const APIResponse = await UserService.UserRegister({ eventName: ApiConfig.GetSubscription });
      if (APIResponse?.code === 200 && APIResponse.data) {
        setApiSubscriptionData(APIResponse.data);
        connectIAP(APIResponse.data);
      }
    } catch (error: any) {
      showToast('Error', String(error?.message || error), 'error');
    } finally {
      setIsProductFetchLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPlan) {
      showToast('Alert', 'Please select a subscription plan first.', 'error');

      return;
    }

    if (selectedPlan == 'Free') {
      navigation.navigate('QRCodeScreen');
      hideSubscriptionModal();

      return;
    }

    try {
      setIsPurchasing(true);

      const product = subscriptionProducts.find(prod => prod.productId === selectedPlan);

      if (!product) {
        throw new Error('Selected product not found');
      }

      if (Platform.OS === 'android') {
        const androidProduct = product as RNIap.SubscriptionAndroid;

        const response = await RNIap.requestSubscription({
          subscriptionOffers: [
            {
              sku: product.productId,
              offerToken: androidProduct.subscriptionOfferDetails?.[0]?.offerToken || '',
            },
          ],
        } as RNIap.RequestSubscriptionAndroid);

        if (response) {
          callPurchaseAPI(Array.isArray(response) ? response[0] : response);
        }
      } else {
        // iOS
        const response = await RNIap.requestSubscription({
          sku: product.productId,
        } as RNIap.RequestSubscriptionIOS);

        if (response) {
          callPurchaseAPI(Array.isArray(response) ? response[0] : response);
        }
      }
    } catch (error: any) {
      setIsPurchasing(false);

      if (error?.code !== 'E_USER_CANCELLED') {
        showToast(
          'Error',
          error?.message || 'Failed to initiate purchase. Please try again later.',
          'error',
        );
      }
    }
  };

  const callPurchaseAPI = async (purchaseResponse: RNIap.SubscriptionPurchase) => {
    try {
      if (!purchaseResponse) {
        return;
      }

      Alert.alert('Subscription Data:', JSON.stringify(purchaseResponse, null, 2));

      let payment_response;

      if (Platform.OS === 'android') {
        payment_response = {
          platform: 'android',
          productId: purchaseResponse.productId,
          productIds: purchaseResponse.productIds || [],
          purchaseToken: purchaseResponse.purchaseToken,
          transactionId: purchaseResponse.transactionId,
          transactionDate: purchaseResponse.transactionDate,
          autoRenewing: purchaseResponse.autoRenewingAndroid,
          isAcknowledged: purchaseResponse.isAcknowledgedAndroid,
          purchaseState: purchaseResponse.purchaseStateAndroid,
          packageName: purchaseResponse.packageNameAndroid,
          signature: purchaseResponse.signatureAndroid,
          developerPayload: purchaseResponse.developerPayloadAndroid || '',
          obfuscatedAccountId: purchaseResponse.obfuscatedAccountIdAndroid || '',
          obfuscatedProfileId: purchaseResponse.obfuscatedProfileIdAndroid || '',
          transactionReceipt: JSON.parse(purchaseResponse.transactionReceipt || '{}'),
          dataAndroid: JSON.parse(purchaseResponse.dataAndroid || '{}'),
        };
      } else {
        // iOS payment response
        const transactionReceipt = JSON.parse(purchaseResponse.transactionReceipt || '{}');

        payment_response = {
          platform: 'ios',
          productId: purchaseResponse.productId,
          productIds: purchaseResponse.productIds || [],
          transactionId: purchaseResponse.transactionId,
          transactionDate: purchaseResponse.transactionDate,
          originalTransactionDate: purchaseResponse.originalTransactionDateIOS,
          originalTransactionIdentifier: purchaseResponse.originalTransactionIdentifierIOS,
          transactionReceipt,
          // iOS specific fields
          appAccountToken: purchaseResponse.appAccountToken || '',
          // Receipt validation data
          receiptData: purchaseResponse.transactionReceipt,
          // Auto-renewal info (extracted from receipt if needed)
          autoRenewing: true, // Default for subscriptions, can be updated based on receipt validation
          purchaseState: 1, // Active state for iOS
          // Additional iOS fields
          webOrderLineItemId: transactionReceipt.web_order_line_item_id || '',
          subscriptionGroupIdentifier: transactionReceipt.subscription_group_identifier || '',
          isInIntroOfferPeriod: transactionReceipt.is_in_intro_offer_period === 'true',
          isTrialPeriod: transactionReceipt.is_trial_period === 'true',
          expiresDate: transactionReceipt.expires_date_ms
            ? parseInt(transactionReceipt.expires_date_ms)
            : null,
          gracePeriodExpiresDate: transactionReceipt.grace_period_expires_date_ms
            ? parseInt(transactionReceipt.grace_period_expires_date_ms)
            : null,
        };
      }

      const dataToSend = { eventName: 'purchase', payment_response };
      const APIResponse = await UserService.UserRegister(dataToSend);

      if (APIResponse.code === 200) {
        await getProfileData();
        showToast(
          TextString.success.toUpperCase(),
          APIResponse?.message?.toString(),
          TextString.success,
        );
      }
    } catch (error: any) {
      showToast(TextString.error, error?.message?.toString(), TextString.error);
    } finally {
      setIsPurchasing(false);
      debouncedGetSubscription(1000);
      hideSubscriptionModal();
    }
  };

  const getSelectedPlan = () => {
    return apiSubscriptionData && apiSubscriptionData.find(plan => plan.key === selectedPlan);
  };

  const getThemeColors = () => {
    const plan = getSelectedPlan();
    if (!plan) {
      return null;
    }

    return isDark ? plan.colors.dark : plan.colors.light;
  };

  const themeColors = getThemeColors();

  const getProductPrice = (productId: string): string => {
    if (!productId) {
      return '';
    }

    const product = subscriptionProducts.find(p => p.productId === productId);

    if (!product) {
      return apiSubscriptionData.find(p => p.key === productId)?.price || '';
    }

    if (Platform.OS === 'ios') {
      return (product as RNIap.SubscriptionIOS).localizedPrice || '';
    }

    // Android
    const androidProduct = product as RNIap.SubscriptionAndroid;
    const offerDetails = androidProduct.subscriptionOfferDetails?.[0];
    const pricingPhase = offerDetails?.pricingPhases?.pricingPhaseList?.[0];

    return pricingPhase?.formattedPrice || '';
  };

  return isProductFetchLoading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', bottom: 30 }}>
      <ActivityIndicator size="large" color={colors.Primary} />
    </View>
  ) : (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        source={CommonImages.SubscriptionBackground}
        style={styles.backgroundImage}
      />

      <View style={styles.contentContainer}>
        <View
          style={[
            styles.featuresContainer,
            {
              backgroundColor: themeColors?.featuresBackground,
              borderColor: themeColors?.border,
              shadowColor: themeColors?.title,
            },
          ]}
        >
          {isDark && (
            <BlurView style={styles.blurView} blurAmount={5} blurRadius={3} blurType="dark" />
          )}
          <View style={styles.featuresContent}>
            <View
              style={[
                styles.crownContainer,
                {
                  backgroundColor: themeColors?.crownBackground,
                  borderColor: themeColors?.border,
                },
              ]}
            >
              <Image source={CommonIcons.ic_crown} resizeMode="contain" style={styles.crownIcon} />
            </View>

            <View style={styles.featuresGrid}>
              {getSelectedPlan?.() &&
                getSelectedPlan()?.benefits?.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Image
                      source={CommonIcons.Check}
                      resizeMode="contain"
                      tintColor={themeColors?.border}
                      style={styles.checkIcon}
                    />
                    <Text
                      style={[styles.featureText, { color: isDark ? colors.White : colors.Black }]}
                    >
                      {feature}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </View>

        <LinearGradient
          colors={themeColors?.gradientColors || ['transparent', 'transparent']}
          style={styles.gradient}
        />

        <View style={styles.plansContainer}>
          {apiSubscriptionData.map(plan => {
            const planColors = isDark ? plan.colors.dark : plan.colors.light;
            const isSelected = selectedPlan === plan.key;
            const productPrice = getProductPrice(plan.key);

            return (
              <Pressable
                key={plan.key}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: planColors.background,
                    borderColor: planColors.border,
                    shadowColor: isSelected ? planColors.border : 'transparent',
                    shadowOpacity: isSelected ? 1 : 0,
                    borderWidth: isSelected ? 1 : 1,
                  },
                ]}
                onPress={() => {
                  handlePlanSelection(plan.key);
                }}
              >
                <Text style={[styles.planName, { color: planColors.title }]}>{plan.title}</Text>
                <View style={[styles.priceWrap, { backgroundColor: planColors.secondary }]}>
                  <View
                    style={[
                      styles.priceContainer,
                      {
                        borderColor: planColors.priceContainerBorder,
                        backgroundColor: isDark
                          ? planColors.featuresBackgroundDark
                          : planColors.featuresBackground,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priceText,
                        { color: isSelected ? planColors.title : planColors.priceUnselectedColor },
                      ]}
                    >
                      {productPrice}
                    </Text>
                  </View>
                </View>

                <Image
                  source={
                    plan.key?.includes('platinum')
                      ? isDark
                        ? CommonIcons.ic_dark_heart_platinum
                        : CommonIcons.ic_light_heart_platinum
                      : plan.key?.includes('gold')
                      ? isDark
                        ? CommonIcons.ic_dark_heart_gold_focus
                        : CommonIcons.ic_light_heart_gold_focus
                      : isDark
                      ? CommonIcons.ic_dark_heart_purple
                      : CommonIcons.ic_light_heart_purple
                  }
                  style={{
                    width: 40,
                    height: 40,
                    position: 'absolute',
                    top: -15,
                    right: -15,
                    zIndex: 9999,
                  }}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.buyButtonContainer}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={
              (Array.isArray(themeColors?.buyButton) && themeColors?.buyButton) || [
                'rgba(253, 235, 92, 1)',
                'rgba(224, 187, 18, 1)',
              ]
            }
            style={[styles.buyButton, { borderColor: themeColors?.buyButtonBorder }]}
          >
            <Pressable
              style={styles.buyButtonContent}
              onPress={handlePurchase}
              onLongPress={() =>
                navigation.navigate('RedeemReferralCode', { fromRegistration: false })
              }
              disabled={isPurchasing || !selectedPlan || purchaseProcessed}
            >
              {isPurchasing ? (
                <ActivityIndicator color={themeColors?.buyButtonText || '#fff'} />
              ) : (
                <Text
                  style={[
                    styles.buyButtonText,
                    { color: themeColors?.buyButtonText || colors.White },
                  ]}
                >
                  {selectedPlan == 'Free'
                    ? 'Share'
                    : purchaseProcessed
                    ? 'Subscribed'
                    : `Buy now ${getProductPrice(getSelectedPlan?.()?.key || '') || ''}`?.trim()}
                </Text>
              )}
            </Pressable>
          </LinearGradient>
          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: colors.TextColor }]}>
              Subscription renews annually unless canceled at least 24 hours before the end of the
              term. Manage in Account Settings. Unused trial time is forfeited upon purchase. By
              subscribing, you agree to our{' '}
              <Text
                onPress={() => OpenURL({ URL: remoteConfigLinks?.TermsOfService?.asString() })}
                style={{ color: colors.Primary }}
              >
                Terms of Use
              </Text>{' '}
              and{' '}
              <Text
                onPress={() => OpenURL({ URL: remoteConfigLinks?.PrivacyPolicy?.asString() })}
                style={{ color: colors.Primary }}
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default memo(SubscriptionView);

const styles = StyleSheet.create({
  backgroundImage: {
    height: '52%',
    top: -20,
    width: '100%',
  },
  blurView: {
    flex: 1,
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  buyButton: {
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginTop: 10,
    overflow: 'hidden',
    width: '50%',
  },
  buyButtonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  buyButtonContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  buyButtonText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
  },
  checkIcon: {
    height: 12,
    marginRight: 5,
    width: 12,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  contentContainer: {
    bottom: '25%',
    flexGrow: 1,
    width: '100%',
  },
  crownContainer: {
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    top: 0,
    width: 42,
  },
  crownIcon: {
    height: 30,
    width: 30,
  },
  featureItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    width: '50%',
  },
  featureText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 11.4,
    maxWidth: '90%',
  },
  featuresContainer: {
    borderRadius: 20,
    borderWidth: 1,
    elevation: 15,
    height: 150,
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: '100%',
    zIndex: 999,
  },
  featuresContent: {
    alignItems: 'center',
    flexGrow: 1,
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  featuresGrid: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gradient: {
    bottom: '60%',
    height: '30%',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  planCard: {
    alignItems: 'center',
    borderRadius: 20,
    elevation: 20,
    height: 120,
    justifyContent: 'space-between',
    padding: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    width: width * 0.29,
  },
  planName: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    textAlign: 'center',
  },
  plansContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    zIndex: 999999,
  },
  priceContainer: {
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  priceText: {
    fontFamily: FONTS.Bold,
    fontSize: 13,
  },
  priceWrap: {
    alignItems: 'center',
    borderRadius: 20,
    height: '75%',
    justifyContent: 'center',
    width: '95%',
  },
  termsContainer: {
    marginTop: 10,
  },
  termsText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 11,
    textAlign: 'center',
  },
});
