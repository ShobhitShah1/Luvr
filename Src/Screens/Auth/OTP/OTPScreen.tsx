import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import axios from 'axios';
import React, {FC, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import OtpInput from '../../../Components/AuthComponents/OtpInput';
import {useCustomToast} from '../../../Utils/toastUtils';
import CreateProfileHeader from '../CreateProfile/Components/CreateProfileHeader';
import styles from './styles';
import ApiConfig from '../../../Config/ApiConfig';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {store} from '../../../Redux/Store/store';
import {updateField} from '../../../Redux/Action/userActions';
import {useDispatch, useSelector} from 'react-redux';
import {useLocationPermission} from '../../../Hooks/useLocationPermission';
interface RouteParams {
  number: string;
}

const OTPScreen: FC = () => {
  const route = useRoute();
  const OTPInputs: number = 4;
  const {number} = route.params as RouteParams;
  const {showToast} = useCustomToast();
  const dispatch = useDispatch();
  const {locationPermission} = useLocationPermission();
  const [otp, setOtp] = useState<string[]>(Array(OTPInputs).fill(''));
  const [IsAPILoading, setIsAPILoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const [DisableButton, setDisableButton] = useState<boolean>(true);

  useEffect(() => {
    const filledOtp = otp.join('');
    if (filledOtp.length === OTPInputs) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [otp]);

  const VerifyClick = () => {
    if (otp.length === 4) {
      verifyOtp();
    } else {
      showToast('Invalid OTP', 'Please Verify OTP', 'error');
    }
  };

  const verifyOtp = async () => {
    setIsAPILoading(true);

    try {
      const OTP = otp.join('');
      const otpVerificationUrl = `${ApiConfig.OTP_BASE_URL}VERIFY3/${number}/${OTP}`;
      const response = await axios.get(otpVerificationUrl);

      console.log('OTP Verification Response:', JSON.stringify(response.data));

      if (response.data?.Status === 'Success') {
        showToast(
          'OTP verified Successfully',
          'Your OTP has been successfully verified. You can now proceed.',
          'success',
        );

        const screenToNavigate = locationPermission
          ? 'IdentifyYourSelf'
          : 'LocationPermission';
        navigation.replace('LoginStack', {screen: screenToNavigate});

        setTimeout(() => {
          dispatch(updateField(LocalStorageFields.OTP, otp.join('')));
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

        <OtpInput
          otp={otp}
          setOtp={setOtp}
          length={OTPInputs}
          onOtpFilled={() => {
            // console.log(`Code Fill ${otp}`);
          }}
        />

        <View style={styles.ResendView}>
          <Text style={styles.NoCodeText}>Didn't you received any code?</Text>
          <Text style={styles.ResendText}>Resend a new code</Text>
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
