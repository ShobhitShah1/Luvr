/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  flushFailedPurchasesCachedAsPendingAndroid,
  initConnection,
  requestPurchase,
} from 'react-native-iap';
import {useSelector} from 'react-redux';
import CommonIcons from '../../Common/CommonIcons';
import TextString from '../../Common/TextString';
import {ActiveOpacity, COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';
import Button from '../../Components/Button';
import {skus} from '../../Config/ApiConfig';
import UserService from '../../Services/AuthService';
import {MembershipProductsType} from '../../Types/Interface';
import {useCustomToast} from '../../Utils/toastUtils';

const BackgroundImageSize = 150;

const DonationScreen = () => {
  const navigation = useNavigation();
  const {showToast} = useCustomToast();
  const membershipStore = useSelector((state: any) => state.membership);

  const [PaymentSuccess, setPaymentSuccess] = useState(false);
  const [PaymentLoader, setPaymentLoader] = useState(false);
  const [membershipProductsList, setMembershipProductsList] = useState<
    MembershipProductsType[]
  >(membershipStore?.membershipProducts);
  const [DonationAmount, setDonationAmount] = useState<string | number>(
    membershipProductsList[0]?.price,
  );

  useEffect(() => {
    initializedConnection();
  }, []);

  const initializedConnection = async () => {
    setPaymentLoader(true);

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

  const requestDonationPurchase = async ({id}: {id: string[]}) => {
    const skuID = id || skus;
    if (skuID) {
      setPaymentLoader(true);
      console.log('⏳ Payment Loading .......');
      try {
        const request = await requestPurchase({skus: skuID});
        console.log('📋 RequestIOSPayment:', request);
        donationAPICall();
        console.log('✅ All Set');
      } catch (error: any) {
        showToast('Error', String(error?.message || error), 'error');
        setPaymentLoader(false);
      }
    } else {
      setPaymentLoader(false);
    }
  };

  const donationAPICall = async () => {
    try {
      const userDataForApi = {
        eventName: 'donation',
        donation_amount: DonationAmount,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        setPaymentSuccess(!PaymentSuccess);
        showToast(
          'Success',
          APIResponse?.message || 'Thanks for your donation',
          'success',
        );
      }
    } catch (error) {
      console.log('Something Went Wrong With Feting API Data', error);
    } finally {
      setPaymentLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.Secondary} />
      <TouchableOpacity
        style={{
          zIndex: 9999,
          left: 20,
          position: 'absolute',
          top: Platform.OS === 'ios' ? 60 : 20,
        }}
        activeOpacity={ActiveOpacity}
        onPress={() => navigation.goBack()}>
        <Image
          source={CommonIcons.Back}
          resizeMode="contain"
          style={{width: 28, height: 28}}
        />
      </TouchableOpacity>
      <View style={styles.ItemContainerView}>
        <View style={styles.TitleAndImageView}>
          <View style={styles.DonateIconView}>
            <Image
              source={
                PaymentSuccess
                  ? CommonIcons.thanks_for_your_support
                  : CommonIcons.ic_donate
              }
              style={styles.DonateIcon}
            />
          </View>

          <View style={styles.DonationTextView}>
            <Text style={styles.DonateTitle}>
              {PaymentSuccess ? 'Thanks for yo support' : 'Help us'}
            </Text>

            <Text style={styles.DonateDescription}>
              {PaymentSuccess
                ? `Your donation of ${DonationAmount} will help us a lot, It will make a big difference.`
                : 'Donate us something to make this app more better!'}
            </Text>
          </View>
        </View>

        {membershipProductsList
          ?.filter(item => item.productId !== skus[0])
          ?.map((res, i) => {
            console.log('res:', res);
            return (
              <TouchableOpacity
                key={i}
                onPress={() => requestDonationPurchase({id: [res.productId]})}
                style={{width: '100%', paddingHorizontal: 20}}>
                <Text style={{color: COLORS.Black}}>{res.name}</Text>
                <Text style={{color: COLORS.Black}}>{res.price}</Text>
                <Text style={{color: COLORS.Black}}>{res.productId}</Text>
                <Text style={{color: COLORS.Black}}>
                  {'-------------------------------------------'}
                </Text>
              </TouchableOpacity>
            );
          })}

        <View style={styles.DonateButtonContainer}>
          <Button
            isLoading={PaymentLoader}
            onPress={() => {}}
            ButtonTitle={
              PaymentSuccess
                ? 'Make another donation'
                : `Donate now ${DonationAmount}`
            }
          />
          {!PaymentSuccess && (
            <Text
              onPress={() => navigation.goBack()}
              style={styles.MayBeLaterButton}>
              Maybe later
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default DonationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: COLORS.Secondary,
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
    backgroundColor: COLORS.White,
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
    color: COLORS.Primary,
  },
  DonateDescription: {
    width: '75%',
    marginTop: 8,
    ...GROUP_FONT.body3,
    textAlign: 'center',
    color: COLORS.Black,
  },
  DonateButtonContainer: {
    flex: 0.4,
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  MayBeLaterButton: {
    marginVertical: 5,
    fontSize: 15.5,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
    color: COLORS.Primary,
  },
});
