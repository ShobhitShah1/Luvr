import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {Text, View} from 'react-native';
import AuthHeader from '../../../Components/AuthComponents/AuthHeader';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import OtpInput from '../../../Components/AuthComponents/OtpInput';
import styles from './styles';
import CreateProfileHeader from '../CreateProfile/Components/CreateProfileHeader';

interface RouteParams {
  number: string;
}

const OTPScreen: FC = () => {
  const route = useRoute();
  const {number} = route.params as RouteParams;
  const [OTPCode, setOTPCode] = useState<String | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const [DisableButton, setDisableButton] = useState<boolean>(true);

  const OnOTPInput = (text: String) => {
    setOTPCode(text);
    if (text.length > 5) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
    console.log(OTPCode);
  };

  return (
    <View style={styles.Container}>
      <CreateProfileHeader ProgressCount={0} Skip={true} />

      {/* <View style={styles.SubContainerView}>
        <AuthHeader Logo={false} onPress={() => {}} />
      </View> */}

      <View style={styles.CodeAndNumberView}>
        <Text style={styles.MyCodeText}>Enter your{'\n'}code</Text>
        <Text style={styles.DescText}>
          Enter 4-digit code. We have sent to{'\n'}you at{' '}
          <Text style={styles.NumberText}>{number}</Text>
        </Text>
      </View>

      <OtpInput onTextChange={text => OnOTPInput(text)} clearText={() => {}} />

      <View style={styles.ResendView}>
        <Text style={styles.NoCodeText}>Didn't you received any code?</Text>
        <Text style={styles.ResendText}>Resend a new code</Text>
      </View>

      <View style={[styles.VerifyOTPButtonView,{}]}>
        <GradientButton
          Disabled={DisableButton}
          Title={'Continue'}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'MyFirstName',
            });
          }}
        />
      </View>
    </View>
  );
};

export default OTPScreen;
