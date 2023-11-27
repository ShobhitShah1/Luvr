import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import {getHash, startOtpListener, useOtpVerify} from 'react-native-otp-verify';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS} from '../../Common/Theme';
interface OtpInputProps {
  onTextChange: (text: string) => void;
  clearText: () => void;
}

const OtpInput: React.FC<OtpInputProps> = ({onTextChange, clearText}) => {
  let otpInputREF = useRef(null);

  const {otp} = useOtpVerify();
  const [hashFromMethod, setHashFromMethod] = React.useState<string[]>();
  const [otpFromMethod, setOtpFromMethod] = React.useState<string>();

  useEffect(() => {
    startOtpListener(res => {
      // const OTP = res ? /(\d{4})/g.exec(res)[1] : '';
      // console.log('OTP:>>>', OTP);
      // onTextChange(OTP);
    });
  }, []);

  return (
    <OTPTextInput
      ref={otpInputREF}
      inputCount={6}
      autoFocus={true}
      textInputStyle={styles.TextInputStyle}
      handleTextChange={text => {
        onTextChange(text);
      }}
      tintColor={COLORS.Primary}
      offTintColor={COLORS.White}
      containerStyle={styles.ContainContainer}
    />
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  ContainContainer: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: hp(4),
  },
  TextInputStyle: {
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: COLORS.White,
    color: COLORS.Gray,
  },
});
