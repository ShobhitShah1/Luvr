import { BlurView } from '@react-native-community/blur';
import remoteConfig from '@react-native-firebase/remote-config';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as RNIap from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';
import CommonIcons from '../../Common/CommonIcons';
import CommonImages from '../../Common/CommonImages';
import { FONTS } from '../../Common/Theme';
import ApiConfig from '../../Config/ApiConfig';
import { useTheme } from '../../Contexts/ThemeContext';
import UserService from '../../Services/AuthService';
import { SubscriptionPlanProps } from '../../Types/Interface';
import { useCustomToast } from '../../Utils/toastUtils';
import OpenURL from '../OpenURL';

export const subscriptionData = {
  subscriptions: [
    {
      key: 'com.luvr.platinum.monthly',
      title: 'Platinum',
      description: 'This is a paid membership that includes all the features of Gold Membership plus additional perks.',
      price: '$45',
      popularityTag: 'Most popular',
      icon: 'ic_dark_heart_purple',
      colors: {
        light: {
          title: 'rgba(18, 18, 19, 1)',
          secondary: 'rgba(235, 235, 235, 1)',
          background: 'rgba(255, 255, 255, 1)',
          border: 'rgba(130, 130, 130, 1)',
          checkIcon: 'rgba(255, 184, 0, 1)',
          featuresBackground: 'rgba(255, 255, 255, 1)',
          featuresBackgroundDark: 'rgba(54, 60, 76, 1)',
          crownBackground: 'rgba(255, 255, 255, 1)',
          crownBorder: 'rgba(255, 184, 0, 1)',
          priceUnselectedColor: 'rgba(119, 119, 119, 1)',
          gradientColors: ['rgba(240, 236, 255, 0.01)', 'rgba(240, 236, 255, 0.04)', 'rgba(240, 236, 255, 0.9)'],
          buyButton: ['rgba(253, 235, 92, 1)', 'rgba(224, 187, 18, 1)'],
          buyButtonText: 'rgba(45, 45, 47, 1)',
          buyButtonBorder: 'rgba(173, 151, 7, 1)',
          priceContainerBorder: 'rgba(130, 130, 130, 1)',
        },
        dark: {
          title: 'rgba(255, 255, 255, 1)',
          secondary: 'rgba(43, 47, 59, 1)',
          background: 'rgba(35, 35, 36, 1)',
          border: 'rgba(219, 219, 219, 1)',
          checkIcon: 'rgba(255, 184, 0, 1)',
          featuresBackground: 'rgba(0, 0, 0, 0.5)',
          featuresBackgroundDark: 'rgba(54, 60, 76, 1)',
          priceUnselectedColor: 'rgba(119, 119, 119, 1)',
          crownBackground: 'rgba(17, 16, 16, 0.3)',
          crownBorder: 'rgba(255, 184, 0, 1)',
          gradientColors: ['rgba(22, 3, 42, 0)', 'rgba(22, 3, 42, 0.88)', 'rgba(22, 3, 42, 1)'],
          buyButton: ['rgba(253, 235, 92, 1)', 'rgba(224, 187, 18, 1)'],
          buyButtonText: 'rgba(45, 45, 47, 1)',
          buyButtonBorder: 'rgba(173, 151, 7, 1)',
          priceContainerBorder: 'transparent',
        },
      },
      benefits: [
        'All the features of free membership',
        'Incognito mode',
        'Ability to make yourself visible offline',
        'Hide yourself from users who signed up with your contact list',
        'Control who you see',
      ],
    },
    {
      key: 'com.luvr.gold.monthly',
      title: 'Gold',
      description: 'This is a paid membership that includes all the features of free membership plus additional perks.',
      price: '$45',
      popularityTag: 'Popular',
      icon: 'ic_dark_heart_gold_focus',
      colors: {
        light: {
          title: 'rgba(255, 184, 0, 1)',
          secondary: 'rgba(251, 239, 204, 1)',
          background: 'rgba(255, 255, 255, 1)',
          border: 'rgba(255, 215, 0, 0.5)',
          checkIcon: 'rgba(255, 184, 0, 1)',
          featuresBackground: 'rgba(255, 255, 255, 1)',
          featuresBackgroundDark: 'rgba(54, 60, 76, 1)',
          priceUnselectedColor: 'rgba(119, 119, 119, 1)',
          crownBackground: 'rgba(255, 255, 255, 1)',
          crownBorder: 'rgba(255, 184, 0, 1)',
          gradientColors: ['rgba(240, 236, 255, 0.01)', 'rgba(240, 236, 255, 0.04)', 'rgba(240, 236, 255, 0.9)'],
          buyButton: ['rgba(253, 235, 92, 1)', 'rgba(224, 187, 18, 1)'],
          buyButtonText: 'rgba(45, 45, 47, 1)',
          buyButtonBorder: 'rgba(173, 151, 7, 1)',
          priceContainerBorder: 'rgba(255, 215, 0, 0.5)',
        },
        dark: {
          title: 'rgba(255, 184, 0, 1)',
          secondary: 'rgba(43, 47, 59, 1)',
          background: 'rgba(35, 35, 36, 1)',
          border: 'rgba(255, 215, 0, 0.5)',
          checkIcon: 'rgba(255, 184, 0, 1)',
          featuresBackground: 'rgba(0, 0, 0, 0.5)',
          featuresBackgroundDark: 'rgba(54, 60, 76, 1)',
          priceUnselectedColor: 'rgba(119, 119, 119, 1)',
          crownBackground: 'rgba(17, 16, 16, 0.3)',
          crownBorder: 'rgba(255, 184, 0, 1)',
          gradientColors: ['rgba(22, 3, 42, 0)', 'rgba(22, 3, 42, 0.88)', 'rgba(22, 3, 42, 1)'],
          buyButton: ['rgba(253, 235, 92, 1)', 'rgba(224, 187, 18, 1)'],
          buyButtonText: 'rgba(45, 45, 47, 1)',
          buyButtonBorder: 'rgba(173, 151, 7, 1)',
          priceContainerBorder: 'transparent',
        },
      },
      benefits: [
        'All the features of free membership',
        'Chatting feature',
        'See who likes you',
        'Block user',
        'Top pick limit',
        'Share profile',
        'No advertisement',
        'See who is online',
      ],
    },
    {
      key: 'Free',
      title: 'Free',
      description: 'This is a paid membership that includes all the features of Gold Membership plus additional perks.',
      price: '$0',
      popularityTag: 'Most popular',
      icon: 'ic_dark_heart_purple',
      colors: {
        light: {
          title: 'rgba(157, 133, 240, 1)',
          secondary: 'rgba(240, 236, 255, 1)',
          background: 'rgba(255, 255, 255, 1)',
          border: 'rgba(157, 133, 240, 1)',
          checkIcon: 'rgba(255, 184, 0, 1)',
          featuresBackground: 'rgba(255, 255, 255, 1)',
          featuresBackgroundDark: 'rgba(54, 60, 76, 1)',
          crownBackground: 'rgba(255, 255, 255, 1)',
          crownBorder: 'rgba(255, 184, 0, 1)',
          priceUnselectedColor: 'rgba(119, 119, 119, 1)',
          gradientColors: ['rgba(240, 236, 255, 0.01)', 'rgba(240, 236, 255, 0.04)', 'rgba(240, 236, 255, 0.9)'],
          buyButton: ['rgba(253, 235, 92, 1)', 'rgba(224, 187, 18, 1)'],
          buyButtonText: 'rgba(45, 45, 47, 1)',
          buyButtonBorder: 'rgba(173, 151, 7, 1)',
          priceContainerBorder: 'rgba(157, 133, 240, 1)',
        },
        dark: {
          title: 'rgba(157, 133, 240, 1)',
          secondary: 'rgba(43, 47, 59, 1)',
          background: 'rgba(35, 35, 36, 1)',
          border: 'rgba(157, 133, 240, 1)',
          checkIcon: 'rgba(255, 184, 0, 1)',
          featuresBackground: 'rgba(0, 0, 0, 0.5)',
          featuresBackgroundDark: 'rgba(54, 60, 76, 1)',
          crownBackground: 'rgba(17, 16, 16, 0.3)',
          crownBorder: 'rgba(255, 184, 0, 1)',
          priceUnselectedColor: 'rgba(119, 119, 119, 1)',
          gradientColors: ['rgba(22, 3, 42, 0)', 'rgba(22, 3, 42, 0.88)', 'rgba(22, 3, 42, 1)'],
          buyButton: ['rgba(253, 235, 92, 1)', 'rgba(224, 187, 18, 1)'],
          buyButtonText: 'rgba(45, 45, 47, 1)',
          buyButtonBorder: 'rgba(173, 151, 7, 1)',
          priceContainerBorder: 'transparent',
        },
      },
      benefits: [
        'All the features of free membership',
        'Incognito mode',
        'Ability to make yourself visible offline',
        'Hide yourself from users who signed up with your contact list',
        'Control who you see',
      ],
    },
  ],
};

const { width } = Dimensions.get('window');

const SubscriptionView = ({
  selectedPlan,
  handlePlanSelection,
}: {
  selectedPlan: string;
  handlePlanSelection: (key: string) => void;
}) => {
  const navigation = useNavigation();

  const { isDark, colors } = useTheme();
  const { showToast } = useCustomToast();

  const [apiSubscriptionData, setApiSubscriptionData] = useState<SubscriptionPlanProps[]>([]);

  const [remoteConfigLinks, setRemoteConfigLinks] = useState<any>();
  const [subscriptionProducts, setSubscriptionProducts] = useState<Array<RNIap.Subscription>>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseProcessed, setPurchaseProcessed] = useState(false);

  const getRemoteConfigValue = async () => {
    await remoteConfig().fetch(100);
    const GetRemoteConfigLinks = remoteConfig().getAll();
    if (GetRemoteConfigLinks) {
      setRemoteConfigLinks(GetRemoteConfigLinks);
    }
  };

  const connectIAP = async () => {
    try {
      const connected = await RNIap.initConnection();

      if (connected) {
        const skus = apiSubscriptionData.map((plan) => plan.key);
        const products = await RNIap.getSubscriptions({ skus });
        setSubscriptionProducts(products);
      }
    } catch (error) {
      showToast('Alert', 'Failed to connect to the store. Please try again later.', 'error');
    }
  };

  useEffect(() => {
    getSubscriptionData();
    getRemoteConfigValue();
    connectIAP();
  }, []);

  useEffect(() => {
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
      console.log('Purchase updated:', purchase);

      if (purchase.transactionReceipt) {
        try {
          await validatePurchase(purchase);

          if (Platform.OS === 'android' && purchase.purchaseToken) {
            await RNIap.acknowledgePurchaseAndroid({ token: purchase.purchaseToken });
          }

          await RNIap.finishTransaction({ purchase, isConsumable: false });

          setPurchaseProcessed(true);
          setIsPurchasing(false);
          showToast('Success', 'Your subscription has been activated successfully!', 'success');
        } catch (error) {
          console.error('Purchase validation error:', error);
          setIsPurchasing(false);
          showToast('Error', 'Failed to validate your purchase. Please contact support.', 'error');
        }
      }
    });

    const purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      console.error('Purchase error:', error);
      setIsPurchasing(false);
      if (error.code !== 'E_USER_CANCELLED') {
        showToast(
          'Purchase Error',
          error?.message?.toString() || 'Failed to validate your purchase. Please contact support.',
          'error'
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
      if (APIResponse?.code === 200) {
        setApiSubscriptionData(APIResponse.data);
      }
    } catch (error) {}
  };

  const validatePurchase = async (purchase: RNIap.Purchase) => {
    // TODO: modify this
    try {
      const response = await fetch(`${ApiConfig.BASE_URL}/validate-purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchaseToken: purchase.purchaseToken,
          productId: purchase.productId,
          transactionReceipt: purchase.transactionReceipt,
          transactionDate: purchase.transactionDate,
        }),
      });
      if (!response.ok) {
        throw new Error('Server validation failed');
      }
      const data = await response.json();
      console.log('Purchase validation response:', data);
      return data;
    } catch (error) {
      console.error('API validation error:', error);
      throw error;
    }
  };

  const handlePurchase = async () => {
    if (!selectedPlan) {
      showToast('Alert', 'Please select a subscription plan first.', 'error');
      return;
    }

    if (selectedPlan == 'Free') {
      navigation.navigate('QRCodeScreen');
      return;
    }

    try {
      setIsPurchasing(true);

      const product = subscriptionProducts.find((prod) => prod.productId === selectedPlan);

      if (!product) {
        throw new Error('Selected product not found');
      }

      if (product.platform === RNIap.SubscriptionPlatform.android) {
        const androidProduct = product as RNIap.SubscriptionAndroid;

        await RNIap.requestSubscription({
          subscriptionOffers: [
            {
              sku: product.productId,
              offerToken: androidProduct.subscriptionOfferDetails?.[0]?.offerToken || '',
            },
          ],
        } as RNIap.RequestSubscriptionAndroid);
      } else {
        await RNIap.requestSubscription({
          sku: product.productId,
        } as RNIap.RequestSubscriptionIOS);
      }
    } catch (error: any) {
      console.error('Purchase request error:', error);
      setIsPurchasing(false);

      if (error?.code !== 'E_USER_CANCELLED') {
        showToast('Error', error?.message || 'Failed to initiate purchase. Please try again later.', 'error');
      }
    }
  };

  const getSelectedPlan = () => {
    return apiSubscriptionData && apiSubscriptionData.find((plan) => plan.key === selectedPlan);
  };

  const getThemeColors = () => {
    const plan = getSelectedPlan();
    if (!plan) return null;
    return isDark ? plan.colors.dark : plan.colors.light;
  };

  const themeColors = getThemeColors();

  const getProductPrice = (productId: string): string => {
    if (!productId) return '';

    const product = subscriptionProducts.find((p) => p.productId === productId);

    if (product) {
      if (product.platform === RNIap.SubscriptionPlatform.ios) {
        return (product as RNIap.SubscriptionIOS).localizedPrice || '';
      }
    }

    const plan = apiSubscriptionData.find((p) => p.key === productId);
    return plan?.price || '';
  };

  return (
    <View style={styles.container}>
      <Image resizeMode="contain" source={CommonImages.SubscriptionBackground} style={styles.backgroundImage} />

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
          {isDark && <BlurView style={styles.blurView} blurAmount={5} blurRadius={3} blurType="dark" />}
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
              {getSelectedPlan() &&
                getSelectedPlan()?.benefits?.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Image
                      source={CommonIcons.Check}
                      resizeMode="contain"
                      tintColor={themeColors?.border}
                      style={styles.checkIcon}
                    />
                    <Text style={[styles.featureText, { color: isDark ? colors.White : colors.Black }]}>{feature}</Text>
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
          {apiSubscriptionData.map((plan) => {
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
                        backgroundColor: isDark ? planColors.featuresBackgroundDark : planColors.featuresBackground,
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
              </Pressable>
            );
          })}
        </View>

        <View style={styles.buyButtonContainer}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={(Array.isArray(themeColors?.buyButton) && themeColors?.buyButton) || []}
            style={[styles.buyButton, { borderColor: themeColors?.buyButtonBorder }]}
          >
            <Pressable
              style={styles.buyButtonContent}
              onPress={handlePurchase}
              disabled={isPurchasing || !selectedPlan || purchaseProcessed}
            >
              {isPurchasing ? (
                <ActivityIndicator color={themeColors?.buyButtonText || '#fff'} />
              ) : (
                <Text style={[styles.buyButtonText, { color: themeColors?.buyButtonText }]}>
                  {selectedPlan == 'Free' ? 'Share' : purchaseProcessed ? 'Subscribed' : 'Buy now'}
                </Text>
              )}
            </Pressable>
          </LinearGradient>
          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: colors.TextColor }]}>
              Subscription renews annually unless canceled at least 24 hours before the end of the term. Manage in
              Account Settings. Unused trial time is forfeited upon purchase. By subscribing, you agree to our{' '}
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
};

export default memo(SubscriptionView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '52%',
    top: -20,
  },
  contentContainer: {
    bottom: '25%',
    width: '100%',
    flexGrow: 1,
  },
  featuresContainer: {
    width: '100%',
    borderRadius: 20,
    height: 150,
    marginBottom: 20,
    zIndex: 999,
    overflow: 'hidden',
    justifyContent: 'center',
    borderWidth: 1,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 15,
  },
  blurView: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  featuresContent: {
    flexGrow: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  crownContainer: {
    top: 0,
    right: 20,
    position: 'absolute',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    width: 42,
    height: 36,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownIcon: {
    width: 30,
    height: 30,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  checkIcon: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
  featureText: {
    fontSize: 12,
    maxWidth: '90%',
    fontFamily: FONTS.SemiBold,
  },
  gradient: {
    position: 'absolute',
    zIndex: 1,
    bottom: '60%',
    height: '30%',
    width: '100%',
  },
  plansContainer: {
    gap: 8,
    width: '100%',
    zIndex: 999999,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  planCard: {
    width: width * 0.29,
    borderRadius: 20,
    padding: 5,
    height: 120,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 10,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  planName: {
    fontSize: 16,
    fontFamily: FONTS.Bold,
    textAlign: 'center',
  },
  priceWrap: {
    borderRadius: 20,
    width: '95%',
    height: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceContainer: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 5,
    borderWidth: 1,
  },
  priceText: {
    fontSize: 14,
    fontFamily: FONTS.Bold,
  },
  buyButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buyButton: {
    width: '50%',
    height: 50,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 16,
    fontFamily: FONTS.Bold,
  },
  termsContainer: {
    marginTop: 10,
  },
  termsText: {
    fontSize: 11,
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
  },
});
