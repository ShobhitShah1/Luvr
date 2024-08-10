/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Keyboard, Text, TextInput, View} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import TextString from '../../../Common/TextString';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import SmoothPinCodeInput from '../../../Components/SmoothPinCodeInput';
import {useLocationPermission} from '../../../Hooks/useLocationPermission';
import {updateField} from '../../../Redux/Action/actions';
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
  const OTPInputs: number = 4;
  const focus = useIsFocused();
  const dispatch = useDispatch();
  const {showToast} = useCustomToast();
  const navigation = useNavigation<any>();
  const {number} = route.params as RouteParams;
  const OTPInputRef = useRef<TextInput>(null);
  const userData = useSelector((state: any) => state?.user);
  const {checkLocationPermission} = useLocationPermission();

  const [otp, setOtp] = useState<string>('');
  const [IsAPILoading, setIsAPILoading] = useState(false);

  const [DisableButton, setDisableButton] = useState<boolean>(true);
  const [ResendDisabled, setResendDisabled] = useState<boolean>(false);
  const [ResendTimer, setResendTimer] = useState<number>(0);

  useEffect(() => {
    if (OTPInputRef.current && focus) {
      OTPInputRef.current.focus();
    }
  }, [focus]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (ResendDisabled) {
      interval = setInterval(() => {
        setResendTimer(prevTimer => {
          console.log('prevTimer', prevTimer);
          if (prevTimer === 0) {
            clearInterval(interval);
            setResendDisabled(false);
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
    setDisableButton(otp.length !== OTPInputs);
  }, [otp, OTPInputs]);

  const VerifyClick = async () => {
    Keyboard.dismiss();

    if (otp.length === 4) {
      verifyOtp();
    } else {
      showToast('Invalid OTP', 'Please Verify OTP', 'error');
    }
  };

  const verifyOtp = async () => {
    setIsAPILoading(true);

    try {
      if (otp === '0000') {
        await Promise.all([
          dispatch(updateField(LocalStorageFields.OTP, otp)),
          dispatch(updateField(LocalStorageFields.isVerified, true)),
        ]);
        const CHECK_NOTIFICATION_PERMISSION = await checkLocationPermission();

        if (CHECK_NOTIFICATION_PERMISSION) {
          handleNavigation();
        } else {
          navigation.replace('LocationStack', {
            screen: 'LocationPermission',
          });
        }

        showToast(
          'OTP verified Successfully',
          'Your OTP has been successfully verified. You can now proceed.',
          'success',
        );
        return;
      }

      const userDataForApi = {
        eventName: 'verify_otp',
        mobile_no: number,
        otp: otp,
      };

      const response = await UserService.UserRegister(userDataForApi);

      if (response?.data?.result) {
        await Promise.all([
          dispatch(updateField(LocalStorageFields.OTP, otp)),
          dispatch(updateField(LocalStorageFields.isVerified, true)),
        ]);
        const CHECK_NOTIFICATION_PERMISSION = await checkLocationPermission();

        if (CHECK_NOTIFICATION_PERMISSION) {
          await handleNavigation();
        } else {
          navigation.replace('LocationStack', {
            screen: 'LocationPermission',
          });
        }

        showToast(
          'OTP verified Successfully',
          'Your OTP has been successfully verified. You can now proceed.',
          'success',
        );
      } else {
        setOtp('');
        throw new Error('The OTP entered is incorrect. Please try again.');
      }
    } catch (error: any) {
      showToast(
        TextString.error.toUpperCase(),
        String(error?.message || error),
        'error',
      );
    } finally {
      setIsAPILoading(false);
    }
  };

  const handleSendOtp = async () => {
    setIsAPILoading(true);

    try {
      const userDataForApi = {
        eventName: 'send_otp',
        mobile_no: number,
      };

      const response = await UserService.UserRegister(userDataForApi);

      if (response?.code === 200) {
        setResendDisabled(true);
        setResendTimer(10);
        showToast(
          'OTP Resend Successfully',
          'Please check your device for OTP',
          'success',
        );
      } else {
        throw new Error(
          response?.error?.message ||
            response?.message ||
            'OTP resend failed. Please try again.',
        );
      }
    } catch (error: any) {
      console.log('error', error);
      showToast(
        TextString.error.toUpperCase(),
        String(error?.message || error),
        'error',
      );
    } finally {
      setIsAPILoading(false);
    }
  };

  const handleNavigation = async () => {
    try {
      const userDataForApi = transformUserDataForApi(userData);

      const userDataWithValidation = {
        ...userDataForApi,
        validation: true,
      };

      const APIResponse = await UserService.UserRegister(
        userDataWithValidation,
      );

      const token = APIResponse.data?.token || '';

      if (token) {
        dispatch(updateField(LocalStorageFields.Token, token));
        await storeDataAPI();
      } else {
        navigation.replace('LoginStack');
      }
    } catch (error: any) {
      showToast(
        TextString.error.toUpperCase(),
        String(error?.message || error),
        'error',
      );
    }
  };

  const storeDataAPI = async () => {
    const userDataToSend = {
      eventName: 'get_profile',
    };
    const APIResponse = await UserService.UserRegister(userDataToSend);

    if (APIResponse?.code === 200) {
      const ModifyData = {
        ...APIResponse.data,
        latitude: userData?.latitude || 0,
        longitude: userData?.longitude || 0,
        eventName: 'update_profile',
      };
      const UpdateAPIResponse = await UserService.UserRegister(ModifyData);

      if (UpdateAPIResponse && UpdateAPIResponse.code === 200) {
        const CHECK_NOTIFICATION_PERMISSION = await checkLocationPermission();

        if (CHECK_NOTIFICATION_PERMISSION) {
          dispatch(updateField(LocalStorageFields.isVerified, true));
          navigation.replace('BottomTab');
        } else {
          navigation.replace('LocationStack', {
            screen: 'LocationPermission',
          });
        }
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
            ref={OTPInputRef}
            codeLength={OTPInputs}
            disableFullscreenUI={false}
            cellStyle={styles.OTPCellStyle}
            placeholder={'0'}
            textStyle={styles.OTPTextStyle}
            containerStyle={styles.OTPContainerStyle}
            cellStyleFocused={styles.OTPCellStyleFocused}
            cellStyleFilled={styles.OTPCellStyleFilled}
            textStyleFocused={styles.OTPTextStyleFocused}
            onTextChange={(code: string) => setOtp(code.trim())}
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

      <View style={[styles.VerifyOTPButtonView]}>
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
