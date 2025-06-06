import { BlurView } from '@react-native-community/blur';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as RNIap from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import CommonIcons from '../../Common/CommonIcons';
import CommonImages from '../../Common/CommonImages';
import TextString from '../../Common/TextString';
import { FONTS } from '../../Common/Theme';
import { boostSkus } from '../../Config/ApiConfig';
import { useTheme } from '../../Contexts/ThemeContext';
import { useUserData } from '../../Contexts/UserDataContext';
import { useBoost } from '../../Hooks/useBoost';
import { useBoostTimer } from '../../Hooks/useBoostTimer';
import UserService from '../../Services/AuthService';
import { debouncedGetBoost } from '../../Services/BoostService';
import { getProfileData } from '../../Utils/profileUtils';
import { useCustomToast } from '../../Utils/toastUtils';
import GradientButton from '../AuthComponents/GradientButton';
import { GradientBorderView } from '../GradientBorder';
import GradientBorder from '../GradientBorder/GradientBorder';

const { width } = Dimensions.get('window');

export interface BoostModalProps {
  isVisible: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onBoostMe?: () => void;
}

const formatTimeRemaining = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '0:00';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}hr : ${paddedMinutes}min : ${paddedSeconds}sec`;
  } else {
    return `${minutes}min : ${paddedSeconds}sec`;
  }
};

const BoostModal = ({ isVisible, onClose, isLoading = false, onBoostMe }: BoostModalProps) => {
  const { colors, isDark } = useTheme();
  const { showToast } = useCustomToast();
  const { userData } = useUserData();
  const { isBoostActive, timeRemaining } = useBoost();
  const { resetBoostTimer } = useBoostTimer();

  const [countdown, setCountdown] = useState<string>(formatTimeRemaining(timeRemaining * 60));
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRemainingRef = useRef<number>(timeRemaining * 60);

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [subscriptionProducts, setSubscriptionProducts] = useState<Array<RNIap.Subscription>>([]);
  const [internalSelectedPlan, setInternalSelectedPlan] = useState<string>(subscriptionProducts[0]?.productId || '');

  const benefits = [
    'Your profile appears at the top of the stack for nearby users',
    `${subscriptionProducts?.find((prod) => prod.productId === internalSelectedPlan)?.description}, increasing your chances of getting more matches`,
  ];

  useEffect(() => {
    isVisible && connectIAP();
  }, [isVisible]);

  useEffect(() => {
    if (isBoostActive && isVisible) {
      secondsRemainingRef.current = timeRemaining * 60;

      setCountdown(formatTimeRemaining(secondsRemainingRef.current));

      timerRef.current = setInterval(() => {
        secondsRemainingRef.current -= 1;

        if (secondsRemainingRef.current <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          debouncedGetBoost(0);
        }

        setCountdown(formatTimeRemaining(secondsRemainingRef.current));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isBoostActive, isVisible, timeRemaining]);

  useEffect(() => {
    if (isBoostActive) {
      secondsRemainingRef.current = timeRemaining * 60;
      setCountdown(formatTimeRemaining(secondsRemainingRef.current));
    }
  }, [timeRemaining, isBoostActive]);

  const handleClose = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    resetBoostTimer();
    onClose();
  };

  const connectIAP = async () => {
    try {
      const connected = await RNIap.initConnection();

      if (connected && boostSkus) {
        const products = await RNIap.getSubscriptions({ skus: boostSkus });
        setInternalSelectedPlan(products[0]?.productId || '');
        setSubscriptionProducts(products);
      }
    } catch (error: any) {
      showToast(
        TextString.error?.toUpperCase(),
        error?.message?.toString() || error?.Error?.toString() || error?.error?.toString() || error?.toString(),
        TextString.error
      );
    }
  };

  const handlePurchase = async () => {
    if (!internalSelectedPlan) {
      showToast('Alert', 'Please select a subscription plan first.', 'error');
      return;
    }

    try {
      setIsPurchasing(true);

      const product = subscriptionProducts.find((prod) => prod.productId === internalSelectedPlan);

      if (!product) {
        throw new Error('Selected product not found');
      }

      if (Platform.OS === 'android') {
        const androidProduct = product as RNIap.SubscriptionAndroid;

        const response = await RNIap.requestSubscription({
          subscriptionOffers: [
            {
              sku: product.productId,
              offerToken: androidProduct?.subscriptionOfferDetails?.[0]?.offerToken || '',
            },
          ],
        } as RNIap.RequestSubscriptionAndroid);

        if (response) callPurchaseAPI(Array.isArray(response) ? response[0] : response);
      } else {
        const response = await RNIap.requestSubscription({
          sku: product.productId,
        } as RNIap.RequestSubscriptionIOS);

        if (response) callPurchaseAPI(Array.isArray(response) ? response[0] : response);
      }
    } catch (error: any) {
      setIsPurchasing(false);

      if (error?.code !== 'E_USER_CANCELLED') {
        showToast('Error', error?.message || 'Failed to initiate purchase. Please try again later.', 'error');
      }
    }
  };

  const callPurchaseAPI = async (purchaseResponse: RNIap.SubscriptionPurchase) => {
    try {
      if (!purchaseResponse) {
        return;
      }

      const payment_response = {
        platform: Platform.OS?.toLowerCase(),
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

      const dataToSend = { eventName: 'boost', user_id: userData?._id, payment_response };
      const APIResponse = await UserService.UserRegister(dataToSend);

      if (APIResponse.code === 200) {
        await getProfileData();
      }
    } catch (error: any) {
      showToast(TextString.error, error?.message?.toString(), TextString.error);
    } finally {
      setIsPurchasing(false);
      debouncedGetBoost(1000);
    }
  };

  const renderActiveBoost = () => {
    return (
      <View style={styles.activeBoostContainer}>
        <Text style={[styles.activeBoostTitle, { color: isDark ? colors.White : colors.Black }]}>
          You have an active boost!
        </Text>
        <View style={styles.countdownContainer}>
          <Text style={[styles.activeBoostText, { color: isDark ? colors.White : colors.Gray }]}>
            Your profile is currently boosted for the next
          </Text>
          <Text style={[styles.countdownText, { color: isDark ? colors.Primary : colors.Primary }]}>{countdown}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <GradientButton Disabled={false} Title="Close" Navigation={onClose} isLoading={false} />
        </View>
      </View>
    );
  };

  return (
    <Modal
      hasBackdrop
      isVisible={isVisible}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      useNativeDriver
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
      presentationStyle="overFullScreen"
      backdropOpacity={1}
      customBackdrop={
        <Pressable onPress={handleClose} style={{ flex: 1 }}>
          {isDark ? (
            <LinearGradient
              colors={
                isDark
                  ? [
                      'rgba(22, 3, 42, 0.55)',
                      'rgba(22, 3, 42, 0.66)',
                      'rgba(22, 3, 42, 0.77)',
                      'rgba(22, 3, 42, 0.88)',
                      'rgba(22, 3, 42, 1)',
                    ]
                  : ['white', 'white']
              }
              style={{ flex: 1, backgroundColor: isDark ? colors.Primary : 'transparent' }}
            />
          ) : (
            <BlurView blurType="dark" blurAmount={5} style={{ flex: 1 }} />
          )}
        </Pressable>
      }
    >
      <GradientBorderView
        gradientProps={{ colors: colors.ButtonGradient }}
        style={[
          styles.modalContainer,
          { backgroundColor: isDark ? 'rgba(18, 18, 19, 2)' : colors.White, shadowColor: colors.Primary },
        ]}
      >
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Image source={CommonIcons.CloseModal} style={styles.closeIcon} />
        </Pressable>
        {isBoostActive ? (
          renderActiveBoost()
        ) : (
          <>
            <View style={styles.imageContainer}>
              <Image style={styles.boostImage} source={isDark ? CommonImages.boost_dark : CommonImages.boost_light} />
            </View>

            <View style={styles.boostCardContainer}>
              {subscriptionProducts ? (
                subscriptionProducts?.map((product, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        styles.boostCard,
                        {
                          backgroundColor: isDark ? 'rgba(60, 40, 90, 0.5)' : colors.White,
                          shadowColor: isDark ? 'rgba(60, 40, 90, 0.5)' : colors.Primary,
                        },
                      ]}
                    >
                      <GradientBorder
                        borderWidth={1.5}
                        borderRadius={20}
                        gradientProps={{
                          colors: colors.ButtonGradient,
                          start: { x: 0, y: 0 },
                          end: { x: 1, y: 0 },
                        }}
                      />
                      <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={colors.ButtonGradient}
                        style={{ width: '100%', height: 30, justifyContent: 'center', alignItems: 'center' }}
                      >
                        <Text style={[styles.boostText, { color: colors.White }]}>Boost</Text>
                      </LinearGradient>
                      <Text style={[styles.dayNumber, { color: isDark ? colors.White : colors.Primary }]}>1</Text>
                      <Text style={[styles.dayText, { color: colors.TextColor }]}>{'Boost'}</Text>
                      <Text style={[styles.priceText, { color: isDark ? colors.White : colors.Primary }]}>
                        {Platform.OS === 'android'
                          ? (product as RNIap.SubscriptionAndroid)?.subscriptionOfferDetails?.[0]?.pricingPhases
                              ?.pricingPhaseList?.[0]?.formattedPrice
                          : (product as RNIap.SubscriptionIOS)?.localizedPrice}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                  <Text
                    style={[
                      styles.boostText,
                      { color: isDark ? colors.White : colors.Primary, fontFamily: FONTS.Bold, fontSize: 20 },
                    ]}
                  >
                    No Boosts Available
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.benefitsContainer}>
              <Text style={[styles.benefitsTitle, { color: isDark ? colors.White : colors.Black }]}>
                Benefits of using Boosts
              </Text>
              <View
                style={[styles.divider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.LightGray }]}
              />

              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <View style={styles.bulletPointContainer}>
                    <Image
                      tintColor={!isDark ? colors.Primary : undefined}
                      source={CommonIcons.ic_rocket}
                      style={styles.rocket}
                    />
                  </View>
                  <Text style={[styles.benefitText, { color: isDark ? colors.White : colors.Black }]}>{benefit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <GradientButton
                Title="Boost me"
                icon={
                  <Image
                    tintColor={colors.White}
                    source={CommonIcons.ic_rocket}
                    style={[styles.rocket, { right: 5 }]}
                  />
                }
                Navigation={handlePurchase}
                isLoading={isPurchasing || isLoading}
                Disabled={isPurchasing || isLoading}
              />
            </View>
          </>
        )}
      </GradientBorderView>
    </Modal>
  );
};

export default memo(BoostModal);

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    borderRadius: 25,
    alignItems: 'center',
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    overflow: 'visible',
    borderWidth: 2,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  boostImage: {
    width: '105%',
    height: '105%',
    resizeMode: 'contain',
  },
  boostCardContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  boostCard: {
    width: 110,
    height: 135,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  boostText: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  dayNumber: {
    fontSize: 32,
    fontFamily: FONTS.SemiBold,
  },
  dayText: {
    marginBottom: 4,
    fontSize: 15,
    fontFamily: FONTS.Medium,
  },
  priceText: {
    fontSize: 16,
    fontFamily: FONTS.Medium,
  },
  benefitsContainer: {
    width: '100%',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  benefitsTitle: {
    marginBottom: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    marginBottom: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  bulletPointContainer: {
    marginRight: 12,
  },
  bulletPoint: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulletIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  benefitText: {
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 25,
    marginTop: 15,
  },
  rocket: {
    width: 20,
    height: 20,
  },
  activeBoostContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  activeBoostImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  activeBoostTitle: {
    fontSize: 22,
    fontFamily: FONTS.Bold,
    marginBottom: 10,
  },
  activeBoostText: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  countdownText: {
    fontSize: 28,
    fontFamily: FONTS.Bold,
    marginVertical: 5,
  },
  countdownLabel: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
  },
  closeButton: {
    position: 'absolute',
    top: -9,
    right: -9,
    zIndex: 1,
    padding: 5,
  },
  closeIcon: {
    width: 27,
    height: 27,
  },
});
