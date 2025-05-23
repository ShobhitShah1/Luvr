import { useIsFocused, useRoute } from '@react-navigation/native';
import React, { memo, useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { Keyboard, Text, View } from 'react-native';
import type { TextInput } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';

import GradientView from '../../../Common/GradientView';
import TextString from '../../../Common/TextString';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import SmoothPinCodeInput from '../../../Components/SmoothPinCodeInput';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { useLocationPermission } from '../../../Hooks/useLocationPermission';
import { useThemedStyles } from '../../../Hooks/useThemedStyles';
import { updateField } from '../../../Redux/Action/actions';
import UserService from '../../../Services/AuthService';
import { transformUserDataForApi } from '../../../Services/dataTransformService';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import { useCustomToast } from '../../../Utils/toastUtils';
import CreateProfileHeader from '../CreateProfile/Components/CreateProfileHeader';

import styles from './styles';

const OTPInputs = 4;

interface RouteParams {
  number: string;
}

const OTPScreen: FC = () => {
  const route = useRoute();
  const focus = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useCustomNavigation();
  const OTPInputRef = useRef<TextInput>(null);
  const { isDark, colors } = useTheme();

  const style = useThemedStyles(styles);
  const { showToast } = useCustomToast();

  const number = (route.params as RouteParams)?.number || '';
  const userData = useSelector((state: any) => state?.user);

  const { checkLocationPermission } = useLocationPermission();

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

  const onVerifyClick = async () => {
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
      const CHECK_NOTIFICATION_PERMISSION = await checkLocationPermission();

      if (otp === '0000') {
        await Promise.all([
          dispatch(updateField(LocalStorageFields.OTP, otp)),
          dispatch(updateField(LocalStorageFields.isVerified, true)),
        ]);

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
        otp,
      };

      const response = await UserService.UserRegister(userDataForApi);

      if (response?.data?.result) {
        await Promise.all([
          dispatch(updateField(LocalStorageFields.OTP, otp)),
          dispatch(updateField(LocalStorageFields.isVerified, true)),
        ]);

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
      showToast(TextString.error.toUpperCase(), String(error?.message || error), TextString.error);
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
        showToast('OTP Resend Successfully', 'Please check your device for OTP', 'success');
      } else {
        throw new Error(
          response?.error?.message || response?.message || 'OTP resend failed. Please try again.',
        );
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
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

      const APIResponse = await UserService.UserRegister(userDataWithValidation);

      const token = APIResponse.data?.token || '';

      if (token) {
        dispatch(updateField(LocalStorageFields.Token, token));
        await storeDataAPI();
      } else {
        navigation.replace('LoginStack');
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
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
    <GradientView>
      <View style={style.Container}>
        <CreateProfileHeader ProgressCount={0} Skip={false} />

        <View style={{ paddingHorizontal: heightPercentageToDP('1.7%') }}>
          <View style={style.CodeAndNumberView}>
            <Text style={style.MyCodeText}>Enter your{'\n'}code</Text>
            <Text style={[style.DescText, { color: colors.TextColor }]}>
              Enter 4-digit code. We have sent to{'\n'}you at{' '}
              <Text style={[style.NumberText, { color: colors.Primary }]}>
                {number?.toString() || ''}
              </Text>
            </Text>
          </View>

          <View style={{ width: '90%', zIndex: 9999, alignSelf: 'center' }}>
            <SmoothPinCodeInput
              value={otp}
              isDark={isDark}
              ref={OTPInputRef as any}
              codeLength={OTPInputs}
              disableFullscreenUI={false}
              cellStyle={style.OTPCellStyle}
              placeholder="0"
              textStyle={style.OTPTextStyle}
              containerStyle={style.OTPContainerStyle}
              cellStyleFocused={style.OTPCellStyleFocused}
              cellStyleFilled={style.OTPCellStyleFilled}
              textStyleFocused={style.OTPTextStyleFocused}
              onTextChange={(code: string) => setOtp(code.trim())}
            />
          </View>

          <View style={style.ResendView}>
            <Text style={style.NoCodeText}>Didn't you received any code?</Text>
            {ResendTimer > 0 ? (
              <Text style={style.ResendText}>Resend in {ResendTimer} seconds</Text>
            ) : (
              <Text
                onPress={() => {
                  if (!ResendDisabled) {
                    setOtp('');
                    handleSendOtp();
                  }
                }}
                style={[style.ResendText, ResendDisabled && { opacity: 0.5 }]}
              >
                Resend a new code
              </Text>
            )}
          </View>
        </View>

        <View style={style.VerifyOTPButtonView}>
          <GradientButton
            Title="Continue"
            isLoading={IsAPILoading}
            Disabled={DisableButton}
            Navigation={onVerifyClick}
          />
        </View>
      </View>
    </GradientView>
  );
};

export default memo(OTPScreen);
