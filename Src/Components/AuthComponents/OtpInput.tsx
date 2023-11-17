import React, {useEffect, useRef} from 'react';
import OTPTextInput from 'react-native-otp-textinput';
import {
  getHash,
  removeListener,
  requestHint,
  startOtpListener,
  useOtpVerify,
} from 'react-native-otp-verify';
import {COLORS} from '../../Common/Theme';
import {StyleSheet} from 'react-native';

interface OtpInputProps {
  onTextChange: (text: string) => void;
  clearText: () => void;
}

const OtpInput: React.FC<OtpInputProps> = ({onTextChange, clearText}) => {
  let otpInputREF = useRef(null);

  const [hashFromMethod, setHashFromMethod] = React.useState<string[]>();
  const [otpFromMethod, setOtpFromMethod] = React.useState<string>();
  const [hint, setHint] = React.useState<string>();

  useEffect(() => {
    console.log('hint', hint);
    console.log('hashFromMethod', hashFromMethod);
    console.log('otpFromMethod', otpFromMethod);
  }, [hashFromMethod, otpFromMethod, hint]);

  // using hook - you can use the startListener and stopListener to manually trigger listeners again.
  const {hash, otp, timeoutError, stopListener, startListener} = useOtpVerify();

  // using methods
  React.useEffect(() => {
    getHash().then(setHashFromMethod).catch(console.log);
    requestHint().then(setHint).catch(console.log);
    startOtpListener(setOtpFromMethod);
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
