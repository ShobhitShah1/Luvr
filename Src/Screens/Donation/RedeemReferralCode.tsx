import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, NativeSyntheticEvent, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeIn,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import GradientView from '../../Common/GradientView';
import { FONTS, SIZES } from '../../Common/Theme';
import CustomTextInput from '../../Components/CustomTextInput';
import { GradientBorderView } from '../../Components/GradientBorder';
import { useTheme } from '../../Contexts/ThemeContext';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import { TextInputKeyPressEventData } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useUserData } from '../../Contexts/UserDataContext';
import { useCustomToast } from '../../Utils/toastUtils';
import TextString from '../../Common/TextString';
import UserService from '../../Services/AuthService';
import ApiConfig from '../../Config/ApiConfig';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';

const AnimatedTextInput = Animated.createAnimatedComponent(CustomTextInput);

const RedeemReferralCode = () => {
  const { colors, isDark } = useTheme();
  const { userData } = useUserData();
  const { showToast } = useCustomToast();

  const code = (userData?._id && userData?._id?.toString()?.slice(-8)) || '';

  const { hasPermission, requestPermission } = useCameraPermission();
  const [referralCode, setReferralCode] = useState<string[]>(Array(8).fill(''));

  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      for (const code of codes) {
        if (code?.value && code.value?.length === 8) {
          setReferralCode(code.value.split(''));
        }
        break;
      }
    },
  });

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<Array<TextInput | null>>(Array(8).fill(null));

  const inputAnimValues = Array(8)
    .fill(0)
    .map(() => useSharedValue(0));

  useEffect(() => {
    if (focusedIndex >= 0) {
      inputAnimValues.forEach((value, idx) => {
        value.value = withTiming(idx === focusedIndex ? 1 : 0, { duration: 200 });
      });
    }
  }, [focusedIndex]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...referralCode];

    if (text === '' && referralCode[index] !== '') {
      newCode[index] = '';
      setReferralCode(newCode);
      return;
    }

    if (text === '' && referralCode[index] === '') {
      if (index > 0) {
        newCode[index - 1] = '';
        setReferralCode(newCode);

        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
          setFocusedIndex(index - 1);
        }, 10);
      }
      return;
    }

    if (text && /^[a-zA-Z0-9]$/.test(text)) {
      inputAnimValues[index].value = withSequence(withTiming(1.2, { duration: 100 }), withTiming(1, { duration: 100 }));

      newCode[index] = text.toLowerCase();
      setReferralCode(newCode);

      if (index < 7) {
        inputRefs.current[index + 1]?.focus();
        setFocusedIndex(index + 1);
      } else {
        Keyboard.dismiss();
      }
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newCode = [...referralCode];

      if (!referralCode[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);

        newCode[index - 1] = '';
        setReferralCode(newCode);
      } else if (index > 0 && !referralCode[index]) {
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
          setFocusedIndex(index - 1);
        }, 10);
      }
    }
  };

  const handleInputFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const setInputRef = (ref: TextInput | null, index: number) => {
    if (inputRefs.current) {
      inputRefs.current[index] = ref;
    }
  };

  const toggleCamera = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      setIsCameraActive((prev) => !prev);
    }, 100);
  };

  const submitReferralCode = async () => {
    try {
      if (referralCode?.join('')?.length !== 8) {
        throw new Error('Enter valid code');
      }

      const code = referralCode.join('');

      const dataToSend = {
        eventName: ApiConfig.HaveReferralCode,
        user_id: userData?._id,
        referral_code: code,
        subscription_count: 1,
        subscription_month: 3,
      };
      const APIResponse = await UserService.UserRegister(dataToSend);

      if (APIResponse?.code === 200) {
        showToast(TextString.success?.toUpperCase(), APIResponse?.message, TextString.success);
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), error?.message?.toString(), 'error');
    }
  };

  const getInputAnimStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const borderColor = interpolateColor(inputAnimValues[index].value, [0, 1], [colors.Secondary, colors.Primary]);

      return {
        borderBottomColor: borderColor,
        transform: [{ scale: withTiming(focusedIndex === index ? 1.05 : 1, { duration: 150 }) }],
      };
    });
  };

  return (
    <GradientView>
      <View style={styles.container}>
        <ProfileAndSettingHeader Title="Have referral code?" showRightIcon={false} />

        <View style={styles.content}>
          <Text style={[styles.label, { color: colors.TextColor }]}>Enter referral code:</Text>

          <Animated.View
            style={[styles.codeInputContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : colors.White }]}
          >
            {referralCode.map((char, index) => (
              <AnimatedTextInput
                key={index}
                value={char}
                maxLength={1}
                caretHidden={false}
                autoCapitalize="none"
                selectTextOnFocus={true}
                onFocus={() => handleInputFocus(index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                ref={(ref) => setInputRef(ref as any, index)}
                onChangeText={(text) => handleCodeChange(text, index)}
                style={[styles.codeInput, { color: colors.TextColor }, getInputAnimStyle(index)]}
              />
            ))}
          </Animated.View>

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.LightGray }]} />
            <Text style={[styles.dividerText, { color: colors.TitleText }]}>OR</Text>
            <View style={[styles.divider, { backgroundColor: colors.LightGray }]} />
          </View>

          <GradientBorderView
            gradientProps={{ colors: colors.ButtonGradient }}
            style={[
              styles.qrContainer,
              { shadowColor: colors.Primary, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : colors.White },
            ]}
          >
            {device && isCameraActive && hasPermission ? (
              <Animated.View entering={FadeIn} style={styles.cameraContainer}>
                <Pressable style={[styles.closeCamera, { backgroundColor: colors.Primary }]} onPress={toggleCamera}>
                  <Text style={{ color: colors.White }}>✕</Text>
                </Pressable>

                <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} codeScanner={codeScanner} />
              </Animated.View>
            ) : (
              <Pressable
                style={styles.qrCodeWrapper}
                onPress={() => requestPermission().then((res) => setIsCameraActive(res))}
              >
                <Text style={[styles.scanText, { color: colors.TextColor }]}>Tap to scan referral code</Text>
                <View style={styles.scanFrame}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
                    <QRCode value={code} size={95} color={colors.TextColor} backgroundColor="transparent" />
                  </View>
                  <View style={[styles.cornerTL, { borderColor: colors.Primary }]} />
                  <View style={[styles.cornerTR, { borderColor: colors.Primary }]} />
                  <View style={[styles.cornerBL, { borderColor: colors.Primary }]} />
                  <View style={[styles.cornerBR, { borderColor: colors.Primary }]} />
                </View>
              </Pressable>
            )}
          </GradientBorderView>

          <Pressable onPress={submitReferralCode}>
            <LinearGradient
              colors={colors.ButtonGradient}
              style={styles.submitButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.submitButtonText, { color: colors.White }]}>Submit</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </GradientView>
  );
};

export default RedeemReferralCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: hp('4%'),
    paddingHorizontal: SIZES.padding,
  },
  label: {
    fontSize: 16,
    marginBottom: hp('1.5%'),
    fontFamily: FONTS.SemiBold,
  },
  codeInputContainer: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.base * 1.5,
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.base * 2,
  },
  codeInput: {
    width: hp('3%'),
    height: hp('5%'),
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
    fontSize: SIZES.h3,
    borderBottomWidth: 2,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('3%'),
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontFamily: FONTS.SemiBold,
    marginHorizontal: SIZES.base * 2,
  },
  qrContainer: {
    width: '83%',
    zIndex: 9999,
    borderWidth: 1,
    alignSelf: 'center',
    marginBottom: hp('4%'),
    borderRadius: SIZES.radius,
  },
  qrCodeWrapper: {
    height: hp('27%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
  },
  scanFrame: {
    top: 18,
    width: hp('15%'),
    height: hp('15%'),
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderLeftWidth: 2,
    borderTopWidth: 2,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRightWidth: 2,
    borderTopWidth: 2,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  scanText: {
    top: 15,
    flex: 1,
    right: 0,
    left: 0,
    width: '100%',
    fontSize: 16.5,
    textAlign: 'center',
    position: 'absolute',
    fontFamily: FONTS.SemiBold,
  },
  submitButton: {
    height: 55,
    width: 180,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1.5%'),
    borderRadius: SIZES.radius,
  },
  submitButtonText: {
    fontSize: 15,
    fontFamily: FONTS.SemiBold,
  },
  skipButton: {
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    fontFamily: FONTS.Regular,
    fontSize: SIZES.body4,
  },
  cameraContainer: {
    height: hp('27%'),
    overflow: 'hidden',
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  camera: {
    flex: 1,
  },
  closeCamera: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
