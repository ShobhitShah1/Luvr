import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';
import CommonIcons from '../../Common/CommonIcons';
import Button from '../../Components/Button';
import {useNavigation} from '@react-navigation/native';
import UserService from '../../Services/AuthService';
import {useCustomToast} from '../../Utils/toastUtils';

const BackgroundImageSize = 150;
const DonationScreen = () => {
  const navigation = useNavigation();
  const [PaymentSuccess, setPaymentSuccess] = useState(false);
  const {showToast} = useCustomToast();

  const DonationAPICall = async () => {
    try {
      const userDataForApi = {
        eventName: 'donation',
        donation_amount: 0,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      console.log('APIResponse', APIResponse);
      if (APIResponse?.code === 200) {
        console.log('Donation API Data:', APIResponse.data);
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
      //  setRefreshing(false);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.Secondary} />
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
                ? 'Your donation of $5 will help us a lot, It will make a big difference.'
                : 'Donate us something to make this app more better!'}
            </Text>
          </View>
        </View>

        <View style={styles.DonateButtonContainer}>
          <Button
            onPress={() => {
              DonationAPICall();
            }}
            ButtonTitle={
              PaymentSuccess ? 'Make another donation' : 'Donate now $5'
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
