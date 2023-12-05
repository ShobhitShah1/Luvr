import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, GROUP_FONT} from '../../Common/Theme';

interface OTPInputProps {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  length: number;
  inputContainerStyle?: object;
  inputStyle?: object;
  onOtpFilled?: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({
  otp,
  setOtp,
  length,
  inputContainerStyle,
  inputStyle,
  onOtpFilled,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<TextInput[]>(Array(length).fill(null));

  useEffect(() => {
    const filledOtp = otp.join('');
    if (filledOtp.length === length && onOtpFilled) {
      onOtpFilled(filledOtp);
    }
  }, [otp, onOtpFilled, length]);

  const handleInputChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value === '' && index > 0) {
      // Handle backspace
      inputRefs.current[index - 1]?.focus();
    } else if (value !== '' && index < length - 1) {
      // Move focus to the next box if not the last box
      inputRefs.current[index + 1]?.focus();
    } else if (value !== '' && index === length - 1) {
      // If updating the last box, trigger onOtpFilled
      if (onOtpFilled) {
        onOtpFilled(newOtp.join(''));
      }
    }
  };

  const handleFocusChange = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace') {
      setOtp(prevOtp => {
        const newOtp = [...prevOtp];

        if (index > 0) {
          newOtp[index] = '';

          // Using setTimeout to focus on the previous input after updating OTP
          setTimeout(() => {
            inputRefs.current[index - 1]?.focus();
          }, 0);
        }

        return newOtp;
      });

      return false;
    }
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // Focus on the first input when the keyboard hides
        inputRefs.current[0]?.focus();
      },
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={[styles.container, inputContainerStyle]}>
      {otp.map((digit, index) => (
        <TextInput
          autoFocus={index === 0}
          key={index.toString()}
          placeholder="0"
          autoComplete="one-time-code"
          placeholderTextColor={'rgba(130, 130, 130, 1)'}
          ref={ref => (inputRefs.current[index] = ref as TextInput)}
          style={[
            styles.input,
            inputStyle,
            {
              backgroundColor: digit !== '' ? COLORS.Primary : COLORS.White,
              borderColor:
                focusedIndex === index ? COLORS.Primary : 'transparent',
            },
          ]}
          value={digit}
          onChangeText={value => handleInputChange(index, value)}
          onFocus={() => {
            setFocusedIndex(index);
            handleFocusChange(index);
          }}
          onBlur={() => setFocusedIndex(null)}
          onKeyPress={({nativeEvent}) => handleKeyPress(index, nativeEvent.key)}
          maxLength={1}
          keyboardType="numeric"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp('4%'),
    marginHorizontal: hp('2.8%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: hp('7%'),
    height: hp('7%'),
    borderWidth: 1,
    borderRadius: hp('50%'),
    textAlign: 'center',
    ...GROUP_FONT.h4,
    fontSize: hp('1.7%'),
    color: COLORS.White,
  },
});

export default OTPInput;
