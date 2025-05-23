import React, { memo, useEffect, useState } from 'react';
import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {
  flushFailedPurchasesCachedAsPendingAndroid,
  initConnection,
  requestPurchase,
} from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { FONTS, GROUP_FONT } from '../../Common/Theme';
import GradientButton from '../../Components/AuthComponents/GradientButton';
import { skus } from '../../Config/ApiConfig';
import { useTheme } from '../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../Hooks/useCustomNavigation';
import UserService from '../../Services/AuthService';
import { useCustomToast } from '../../Utils/toastUtils';

const BackgroundImageSize = 150;

function DonationScreen() {
  const navigation = useCustomNavigation();

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

      showToast(
        TextString.error.toUpperCase(),
        'Failed to connect to the store.',
        TextString.error,
      );
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

              <Text
                style={[
                  styles.DonateDescription,
                  { color: isDark ? 'rgba(198, 198, 198, 1)' : colors.TextColor },
                ]}
              >
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
              Navigation={() =>
                requestDonationPurchase({ id: [donationStore?.donationProducts?.[1]?.productId] })
              }
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
}

export default memo(DonationScreen);

const styles = StyleSheet.create({
  DonateButtonContainer: {
    alignItems: 'center',
    bottom: 15,
    justifyContent: 'center',
    position: 'absolute',
  },
  DonateDescription: {
    marginTop: 8,
    width: '75%',
    ...GROUP_FONT.body3,
    textAlign: 'center',
  },
  DonateIcon: {
    alignSelf: 'center',
    height: BackgroundImageSize / 1.8,
    width: BackgroundImageSize / 1.8,
  },
  DonateIconView: {
    alignItems: 'center',
    borderRadius: 500,
    height: BackgroundImageSize,
    justifyContent: 'center',
    width: BackgroundImageSize,
  },
  DonateTitle: {
    ...GROUP_FONT.h2,
    fontSize: 25,
    marginVertical: 5,
    textAlign: 'center',
  },
  DonationTextView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 35,
    width: '100%',
  },
  ItemContainerView: {
    alignItems: 'center',
    flex: 1,
  },
  MayBeLaterButton: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15.5,
    marginVertical: 8,
    textAlign: 'center',
  },
  TitleAndImageView: {
    alignItems: 'center',
    flex: 0.6,
    height: '100%',
    justifyContent: 'flex-end',
    width: '100%',
  },
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});
