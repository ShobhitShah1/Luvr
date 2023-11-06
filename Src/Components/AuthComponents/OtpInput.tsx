import React, {useRef, useEffect} from 'react';
import OTPTextInput from 'react-native-otp-textinput';
import OTPTextView, {
  getHash,
  startOtpListener,
  removeListener,
  useOtpVerify,
} from 'react-native-otp-verify';
import {COLORS} from '../../Common/Theme';

interface OtpInputProps {
  onTextChange: (text: string) => void;
  clearText: () => void;
}

const OtpInput: React.FC<OtpInputProps> = ({onTextChange, clearText}) => {
  let otpInputREF = useRef(null);

  const {message} = useOtpVerify({numberOfDigits: 6});

  useEffect(() => {
    getHash()
      .then(hash => {
        console.log('hash', hash);
        // Use this hash in the message.
      })
      .catch(console.log);

    startOtpListener(message => {
      console.log('message', message);
      // Extract the OTP using regex, e.g., the below regex extracts a 4-digit OTP from the message.
      // const otp = /(\d{4})/g.exec(message)[1];
      // console.log('otp:', otp);

      // otpInput.current.setValue(otp);
    });

    return () => removeListener();
  }, []);

  return (
    <OTPTextInput
      ref={otpInputREF}
      inputCount={6}
      autoFocus={true}
      textInputStyle={{
        width: ,
        borderBottomWidth: 1,
        borderBottomColor: 'yellow',
      }}
      handleTextChange={text => {
        onTextChange(text);
      }}
      tintColor={COLORS.Primary}
      offTintColor={COLORS.Black}
      containerStyle={{
        width: '100%',
        backgroundColor: 'red',
        justifyContent: 'center',
        alignSelf: 'center',
      }}
    />
  );
};

export default OtpInput;
