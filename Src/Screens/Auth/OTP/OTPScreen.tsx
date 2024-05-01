/* eslint-disable react-native/no-inline-styles */
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Alert, Keyboard, Text, View} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {useDispatch, useSelector} from 'react-redux';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import ApiConfig from '../../../Config/ApiConfig';
import {useLocationPermission} from '../../../Hooks/useLocationPermission';
import {updateField} from '../../../Redux/Action/userActions';
import UserService from '../../../Services/AuthService';
import {transformUserDataForApi} from '../../../Services/dataTransformService';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useCustomToast} from '../../../Utils/toastUtils';
import CreateProfileHeader from '../CreateProfile/Components/CreateProfileHeader';
import styles from './styles';

interface RouteParams {
  number: string;
}

const OTPScreen: FC = () => {
  const route = useRoute();
  const OTPInputRef = useRef<SmoothPinCodeInput>(null);
  const OTPInputs: number = 4;
  const {number} = route.params as RouteParams;
  const userData = useSelector((state: any) => state?.user);
  const dispatch = useDispatch();
  const {showToast} = useCustomToast();
  const navigation = useNavigation();

  const {locationPermission, checkLocationPermission} = useLocationPermission();
  const [otp, setOtp] = useState<string>('');
  const [IsAPILoading, setIsAPILoading] = useState(false);

  const [DisableButton, setDisableButton] = useState<boolean>(true);
  const [ResendDisabled, setResendDisabled] = useState<boolean>(false);
  const [ResendTimer, setResendTimer] = useState<number>(0); // Timer in seconds

  useEffect(() => {
    if (OTPInputRef.current) {
      OTPInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (ResendDisabled) {
      interval = setInterval(() => {
        setResendTimer(prevTimer => {
          console.log('prevTimer', prevTimer);
          if (prevTimer === 0) {
            clearInterval(interval); // Clear interval when timer is over
            setResendDisabled(false); // Reset ResendDisabled to false
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [ResendDisabled]);

  useEffect(() => {
    if (otp.length === OTPInputs) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [otp]);

  const VerifyClick = async () => {
    if (otp.length === 4) {
      Keyboard.dismiss();
      setTimeout(() => {
        verifyOtp();
      }, 0);
    } else {
      showToast('Invalid OTP', 'Please Verify OTP', 'error');
    }
  };

  const verifyOtp = async () => {
    setIsAPILoading(true);

    try {
      if (otp === '0000') {
        showToast(
          'OTP verified Successfully',
          'Your OTP has been successfully verified. You can now proceed.',
          'success',
        );

        await Promise.all([
          dispatch(updateField(LocalStorageFields.OTP, otp)),
          dispatch(updateField(LocalStorageFields.isVerified, true)),
        ]);
        const CHECK_NOTIFICATION_PERMISSION = await checkLocationPermission();

        setTimeout(() => {
          if (CHECK_NOTIFICATION_PERMISSION) {
            handleNavigation();
          } else {
            navigation.replace('LocationStack', {
              screen: 'LocationPermission',
            });
            setIsAPILoading(false);
          }
        }, 0);
        return; // Exit the function after allowing login for '0000'
      }

      const otpVerificationUrl = `${ApiConfig.OTP_BASE_URL}VERIFY3/${number}/${otp}`;
      const response = await axios.get(otpVerificationUrl);

      if (response.data?.Status === 'Success') {
        showToast(
          'OTP verified Successfully',
          'Your OTP has been successfully verified. You can now proceed.',
          'success',
        );

        await Promise.all([
          dispatch(updateField(LocalStorageFields.OTP, otp)),
          dispatch(updateField(LocalStorageFields.isVerified, true)),
        ]);
        const CHECK_NOTIFICATION_PERMISSION = await checkLocationPermission();

        setTimeout(() => {
          if (CHECK_NOTIFICATION_PERMISSION) {
            handleNavigation();
          } else {
            navigation.replace('LocationStack', {
              screen: 'LocationPermission',
            });
            setIsAPILoading(false);
          }
        }, 0);
      } else {
        showToast(
          'OTP Verification Failed',
          'The OTP entered is incorrect. Please try again.',
          'error',
        );
      }
    } catch (error) {
      showToast(
        'Error',
        'Failed to verify OTP. Please check your network connection and try again.',
        'error',
      );
      console.error('Error verifying OTP:', error);
    } finally {
      setIsAPILoading(false);
    }
  };

  const handleSendOtp = async () => {
    setIsAPILoading(true);
    try {
      const url = `${ApiConfig.OTP_BASE_URL}${number}/AUTOGEN3/OTP1`;

      const response = await axios.get(url);
      if (response.data?.Status === 'Success') {
        showToast(
          'OTP Resend Successfully',
          'Please check your device for OTP',
          'success',
        );
        setResendDisabled(true);
        setResendTimer(10); // Reset timer to 10 seconds when resend is clicked
      } else {
        showToast(
          'Server Error',
          'Something went wrong, try again later',
          'error',
        );
      }
    } catch (error) {
      showToast(
        'Error',
        'Failed to send otp OTP. Please check your network connection and try again.',
        'error',
      );
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsAPILoading(false);
    }
  };

  const handleNavigation = async () => {
    const userDataForApi = transformUserDataForApi(userData);

    const userDataWithValidation = {
      ...userDataForApi,
      validation: true,
    };

    const APIResponse = await UserService.UserRegister(userDataWithValidation);

    if (APIResponse?.data?.token) {
      await dispatch(
        updateField(LocalStorageFields.Token, APIResponse.data?.token),
      );
      storeDataAPI();
      // if (userDataForApi?.login_type === 'social') {
      //   storeDataAPI();
      // } else {
      //   setTimeout(() => {
      //     navigation.replace('BottomTab');
      //     dispatch(updateField(LocalStorageFields.isVerified, true));
      //   }, 0);
      // }
    } else {
      navigation.replace('LoginStack');
    }
    setIsAPILoading(false);
  };

  const storeDataAPI = async () => {
    const userDataToSend = {
      // ...userData,
      eventName: 'get_profile',
    };
    const APIResponse = await UserService.UserRegister(userDataToSend);
    console.log('CheckDataAndNavigateToNumber', APIResponse.data);

    if (APIResponse?.code === 200) {
      const ModifyData = {
        ...APIResponse.data,
        latitude: userData?.latitude || 0,
        longitude: userData?.longitude || 0,
        eventName: 'update_profile',
      };
      console.log('OTP UPDATE PROFILE:', ModifyData);
      const UpdateAPIResponse = await UserService.UserRegister(ModifyData);

      if (UpdateAPIResponse && UpdateAPIResponse.code === 200) {
        console.log('storeDataAPI UpdateAPIResponse:', UpdateAPIResponse);
        const CHECK_NOTIFICATION_PERMISSION = await checkLocationPermission();

        setTimeout(() => {
          if (CHECK_NOTIFICATION_PERMISSION) {
            // if (condition) {

            // } else {

            // }
            navigation.replace('BottomTab');
            dispatch(updateField(LocalStorageFields.isVerified, true));
          } else {
            navigation.replace('LocationStack', {
              screen: 'LocationPermission',
            });
            setIsAPILoading(false);
          }
        }, 0);
      } else {
        const errorMessage =
          UpdateAPIResponse && UpdateAPIResponse.error
            ? UpdateAPIResponse.error
            : 'Unknown error occurred during registration.';
        throw new Error(errorMessage);
      }
    }
  };

  return (
    <View style={styles.Container}>
      <CreateProfileHeader ProgressCount={0} Skip={false} />

      <View style={{paddingHorizontal: heightPercentageToDP('1.7%')}}>
        <View style={styles.CodeAndNumberView}>
          <Text style={styles.MyCodeText}>Enter your{'\n'}code</Text>
          <Text style={styles.DescText}>
            Enter 4-digit code. We have sent to{'\n'}you at{' '}
            <Text style={styles.NumberText}>{number}</Text>
          </Text>
        </View>

        <View
          style={{
            width: '90%',
            zIndex: 9999,
            alignSelf: 'center',
          }}>
          <SmoothPinCodeInput
            value={otp}
            animated={false}
            ref={OTPInputRef}
            codeLength={OTPInputs}
            disableFullscreenUI={false}
            onTextChange={(code: string) => setOtp(code)}
            cellStyle={styles.OTPCellStyle}
            textStyle={styles.OTPTextStyle}
            containerStyle={styles.OTPContainerStyle}
            cellStyleFocused={styles.OTPCellStyleFocused}
            cellStyleFilled={styles.OTPCellStyleFilled}
            textStyleFocused={styles.OTPTextStyleFocused}
          />
        </View>

        <View style={styles.ResendView}>
          <Text style={styles.NoCodeText}>Didn't you received any code?</Text>
          {ResendTimer > 0 ? (
            <Text style={styles.ResendText}>
              Resend in {ResendTimer} seconds
            </Text>
          ) : (
            <Text
              onPress={() => {
                if (!ResendDisabled) {
                  setOtp('');
                  handleSendOtp();
                }
              }}
              style={[styles.ResendText, ResendDisabled && {opacity: 0.5}]}>
              Resend a new code
            </Text>
          )}
        </View>
      </View>

      <View style={[styles.VerifyOTPButtonView, {}]}>
        <GradientButton
          Title={'Continue'}
          isLoading={IsAPILoading}
          Disabled={DisableButton}
          Navigation={VerifyClick}
        />
      </View>
    </View>
  );
};

export default OTPScreen;
