/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { flushFailedPurchasesCachedAsPendingAndroid, initConnection, requestPurchase } from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { FONTS, GROUP_FONT } from '../../Common/Theme';
import GradientButton from '../../Components/AuthComponents/GradientButton';
import { skus } from '../../Config/ApiConfig';
import { useTheme } from '../../Contexts/ThemeContext';
import UserService from '../../Services/AuthService';
import { useCustomToast } from '../../Utils/toastUtils';

const BackgroundImageSize = 150;

const DonationScreen = () => {
  const navigation = useNavigation();

  const { isDark, colors } = useTheme();
  const { showToast } = useCustomToast();

  const donationStore = useSelector((state: any) => state.donation);
  const donationAmount =
    donationStore?.donationProducts?.[1]?.price || donationStore?.donationProducts?.[0]?.price || 0;

  const [isPaymentSuccess, setPaymentSuccess] = useState(false);
  const [isPaymentLoading, setPaymentLoader] = useState(false);

  useEffect(() => {
    initializedConnection();
  }, []);

  const initializedConnection = async () => {
    try {
      const connected = await initConnection();

      if (connected) {
        if (Platform.OS === 'android') {
          await flushFailedPurchasesCachedAsPendingAndroid();
        }
        return;
      }

      showToast(TextString.error.toUpperCase(), 'Failed to connect to the store.', TextString.error);
    } catch (error) {
      setPaymentLoader(false);
    } finally {
      setPaymentLoader(false);
    }
  };

  const requestDonationPurchase = async ({ id }: { id: string[] }) => {
    try {
      const skuID = id || skus;
      setPaymentLoader(true);

      if (skuID) {
        await requestPurchase({ skus: skuID });
        donationAPICall();
      }
    } catch (error: any) {
      if (error?.message?.incudes('Cancelled')) {
        return;
      }
      showToast('Error', String(error?.message || error), 'error');
    } finally {
      setPaymentLoader(false);
    }
  };

  const donationAPICall = async () => {
    try {
      const userDataForApi = {
        eventName: 'donation',
        donation_amount: donationAmount,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        setPaymentSuccess(!isPaymentSuccess);
        showToast('Success', APIResponse?.message || 'Thanks for your donation', 'success');
      }
    } catch (error) {
    } finally {
      setPaymentLoader(false);
    }
  };

  return (
    <GradientView>
      <View style={styles.container}>
        <SafeAreaView />
        <Pressable
          style={{
            zIndex: 9999,
            left: 20,
            position: 'absolute',
            top: Platform.OS === 'ios' ? 60 : 20,
          }}
          onPress={() => navigation.canGoBack() && navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            tintColor={colors.TextColor}
            source={CommonIcons.TinderBack}
            resizeMode="contain"
            style={{ width: 28, height: 28 }}
          />
        </Pressable>
        <View style={styles.ItemContainerView}>
          <View style={styles.TitleAndImageView}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={isDark ? colors.ButtonGradient : [colors.White, colors.White]}
              style={styles.DonateIconView}
            >
              <Image
                tintColor={isDark ? colors.White : colors.Primary}
                source={CommonIcons.ic_donation_new}
                style={styles.DonateIcon}
              />
            </LinearGradient>

            <View style={styles.DonationTextView}>
              <Text style={[styles.DonateTitle, { color: colors.TitleText }]}>
                {isPaymentSuccess ? 'Thanks for yo support' : 'Help us'}
              </Text>

              <Text style={[styles.DonateDescription, { color: isDark ? 'rgba(198, 198, 198, 1)' : colors.TextColor }]}>
                {isPaymentSuccess
                  ? `Your donation of ${donationAmount} will help us a lot, It will make a big difference.`
                  : 'Donate us something to make this app more better!'}
              </Text>
            </View>
          </View>

          <View style={styles.DonateButtonContainer}>
            <GradientButton
              Title={isPaymentSuccess ? 'Make another donation' : `Donate now ${donationAmount}`}
              isLoading={isPaymentLoading}
              Navigation={() => requestDonationPurchase({ id: [donationStore?.donationProducts?.[1]?.productId] })}
              Disabled={false}
            />
            {!isPaymentSuccess && (
              <Text
                onPress={() => navigation.canGoBack() && navigation.goBack()}
                style={[styles.MayBeLaterButton, { color: colors.TextColor }]}
              >
                Maybe later
              </Text>
            )}
          </View>
        </View>
      </View>
    </GradientView>
  );
};

export default memo(DonationScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  ItemContainerView: {
    flex: 1,
    alignItems: 'center',
  },
  TitleAndImageView: {
    flex: 0.6,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  DonateIconView: {
    width: BackgroundImageSize,
    height: BackgroundImageSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 500,
  },
  DonateIcon: {
    width: BackgroundImageSize / 1.8,
    height: BackgroundImageSize / 1.8,
    alignSelf: 'center',
  },
  DonationTextView: {
    width: '100%',
    marginVertical: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  DonateTitle: {
    ...GROUP_FONT.h2,
    marginVertical: 5,
    fontSize: 25,
    textAlign: 'center',
  },
  DonateDescription: {
    width: '75%',
    marginTop: 8,
    ...GROUP_FONT.body3,
    textAlign: 'center',
  },
  DonateButtonContainer: {
    position: 'absolute',
    bottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  MayBeLaterButton: {
    marginVertical: 8,
    fontSize: 15.5,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },
});
