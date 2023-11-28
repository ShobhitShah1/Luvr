import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import OtpInput from '../../../Components/AuthComponents/OtpInput';
import CreateProfileHeader from '../CreateProfile/Components/CreateProfileHeader';
import styles from './styles';

interface RouteParams {
  number: string;
}

const OTPScreen: FC = () => {
  const route = useRoute();
  const OTPInputs: number = 4;
  const {number} = route.params as RouteParams;
  const [otp, setOtp] = useState<string[]>(Array(OTPInputs).fill(''));

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

  // Function to auto-fill OTP based on received SMS
  // const autoFillFromSMS = (sms: string) => {
  //   // Extract OTP from the SMS using a regular expression or any other method
  //   const extractedOtp = sms.match(/\d{4}/)?.[0] || ''; // Assumes a 6-digit OTP, adjust as needed

  //   // Update the OTP state
  //   setOtp(extractedOtp.split(''));
  // };

  // Example usage of auto-fill function (you should replace this with your actual SMS retrieval logic)
  // useEffect(() => {
  //   const receivedSMS = 'Your OTP is 8965'; // Replace with the actual received SMS
  //   autoFillFromSMS(receivedSMS);
  // }, []);

  return (
    <View style={styles.Container}>
      <CreateProfileHeader ProgressCount={0} Skip={true} />

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
            console.log(`Code Fill ${otp}`);
          }}
        />

        <View style={styles.ResendView}>
          <Text style={styles.NoCodeText}>Didn't you received any code?</Text>
          <Text style={styles.ResendText}>Resend a new code</Text>
        </View>
      </View>

      <View style={[styles.VerifyOTPButtonView, {}]}>
        <GradientButton
          Disabled={DisableButton}
          Title={'Continue'}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'IdentifyYourSelf',
            });
          }}
        />
      </View>
    </View>
  );
};

export default OTPScreen;
