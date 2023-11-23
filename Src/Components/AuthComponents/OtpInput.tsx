import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import {getHash, startOtpListener, useOtpVerify} from 'react-native-otp-verify';
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
    console.log('hashFromMethod', hashFromMethod);
    console.log('otpFromMethod', otpFromMethod);
    console.log('otp', otp);
  }, [otpFromMethod]);

  useEffect(() => {
    getHash().then(setHashFromMethod).catch(console.log);
    startOtpListener(res => {
      const OTP = res ? /(\d{4})/g.exec(res)[1] : '';
      console.log('OTP:>>>', OTP);
      onTextChange(OTP);
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
      offTintColor={COLORS.Black}
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
  },
  TextInputStyle: {
    borderBottomWidth: 1,
  },
});
