import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native';
import * as RNIap from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import CommonIcons from '../../Common/CommonIcons';
import TextString from '../../Common/TextString';
import { FONTS } from '../../Common/Theme';
import { boostSkus } from '../../Config/ApiConfig';
import { useTheme } from '../../Contexts/ThemeContext';
import { useUserData } from '../../Contexts/UserDataContext';
import { useBoost } from '../../Hooks/useBoost';
import UserService from '../../Services/AuthService';
import { debouncedGetBoost } from '../../Services/BoostService';
import { getProfileData } from '../../Utils/profileUtils';
import { useCustomToast } from '../../Utils/toastUtils';
import GradientButton from '../AuthComponents/GradientButton';
import GradientBorder from '../GradientBorder/GradientBorder';

const { width } = Dimensions.get('window');

const benefits = [
  'Your profile appears at the top of the stack for nearby users',
  "You're highlighted for 30 minutes, increasing your chances of getting more matches",
];

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

  const [countdown, setCountdown] = useState<string>(formatTimeRemaining(timeRemaining * 60));
  // Timer interval reference to clean up
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRemainingRef = useRef<number>(timeRemaining * 60);

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isProductFetchLoading, setIsProductFetchLoading] = useState(true);
  const [subscriptionProducts, setSubscriptionProducts] = useState<Array<RNIap.Product>>([]);
  const [internalSelectedPlan, setInternalSelectedPlan] = useState<string>(subscriptionProducts[0]?.productId || '');

  useEffect(() => {
    connectIAP();
  }, []);

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

  const connectIAP = async () => {
    try {
      const connected = await RNIap.initConnection();

      if (connected && boostSkus) {
        const products = await RNIap.getProducts({ skus: boostSkus });
        setInternalSelectedPlan(products[0]?.productId || '');
        setSubscriptionProducts(products);
      }
    } catch (error: any) {
      showToast(
        TextString.error?.toUpperCase(),
        error?.message?.toString() || error?.Error?.toString() || error?.error?.toString() || error?.toString(),
        TextString.error
      );
    } finally {
      setIsProductFetchLoading(false);
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
        const response = await RNIap.requestPurchase({ skus: [product.productId] });

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
        onClose();
        showToast(TextString.success.toUpperCase(), APIResponse?.message?.toString(), TextString.success);
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
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriver
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
      presentationStyle="overFullScreen"
    >
      <View style={[styles.modalContainer, { backgroundColor: isDark ? 'rgba(18, 18, 19, 2)' : colors.White }]}>
        {isBoostActive ? (
          renderActiveBoost()
        ) : (
          <>
            <View style={styles.imageContainer}>
              <Image
                resizeMode="cover"
                style={styles.boostImage}
                source={isDark ? CommonIcons.ic_dark_boost : CommonIcons.ic_light_boost}
              />
            </View>

            <View style={styles.boostCardContainer}>
              {subscriptionProducts ? (
                subscriptionProducts?.map((product, index) => {
                  return (
                    <View
                      key={index}
                      style={[styles.boostCard, { backgroundColor: isDark ? 'rgba(60, 40, 90, 0.5)' : colors.White }]}
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
                      <Text style={[styles.dayText, { color: colors.TextColor }]}>{product.title?.slice(0, 8)}</Text>
                      <Text style={[styles.priceText, { color: isDark ? colors.White : colors.Primary }]}>
                        {product.localizedPrice}
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
                    <Image source={CommonIcons.ic_rocket} style={styles.rocket} />
                  </View>
                  <Text style={[styles.benefitText, { color: isDark ? colors.White : colors.Black }]}>{benefit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <GradientButton
                Title="Boost me"
                Navigation={handlePurchase}
                isLoading={isPurchasing || isLoading}
                Disabled={isPurchasing || isLoading}
              />
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

export default BoostModal;

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
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boostImage: {
    width: '100%',
    height: '100%',
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
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
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
});
