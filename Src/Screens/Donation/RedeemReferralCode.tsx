import { useRoute } from '@react-navigation/native';
import React, { memo, useEffect, useRef, useState } from 'react';
import type { NativeSyntheticEvent, TextInput, TextInputKeyPressEventData } from 'react-native';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import Animated, {
  FadeIn,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { FONTS, SIZES } from '../../Common/Theme';
import CustomTextInput from '../../Components/CustomTextInput';
import { GradientBorderView } from '../../Components/GradientBorder';
import ApiConfig from '../../Config/ApiConfig';
import { useTheme } from '../../Contexts/ThemeContext';
import { useUserData } from '../../Contexts/UserDataContext';
import { useCustomNavigation } from '../../Hooks/useCustomNavigation';
import UserService from '../../Services/AuthService';
import { useCustomToast } from '../../Utils/toastUtils';
import ProfileAndSettingHeader from '../Profile/Components/profile-and-setting-header';

const AnimatedTextInput = Animated.createAnimatedComponent(CustomTextInput);

interface RouteParams {
  fromRegistration: string;
}

function RedeemReferralCode() {
  const { colors, isDark } = useTheme();
  const { params } = useRoute();
  const navigation = useCustomNavigation();

  const fromRegistration = (params as RouteParams)?.fromRegistration || false;

  const { userData } = useUserData();
  const { showToast } = useCustomToast();

  const code = (userData?._id && userData?._id?.toString()?.slice(-8)) || '';

  const { hasPermission, requestPermission } = useCameraPermission();
  const [referralCode, setReferralCode] = useState<string[]>(Array(8).fill(''));

  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
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
      inputAnimValues[index].value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withTiming(1, { duration: 100 }),
      );

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
      setIsCameraActive(prev => !prev);
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
      const borderColor = interpolateColor(
        inputAnimValues[index].value,
        [0, 1],
        [colors.Secondary, colors.Primary],
      );

      return {
        borderBottomColor: borderColor,
        transform: [{ scale: withTiming(focusedIndex === index ? 1.05 : 1, { duration: 150 }) }],
      };
    });
  };

  return (
    <GradientView>
      <View style={styles.container}>
        <ProfileAndSettingHeader
          Title="Have referral code?"
          showRightIcon={false}
          showBackIcon={!fromRegistration}
        />

        <View style={styles.content}>
          <Text style={[styles.label, { color: colors.TextColor }]}>Enter referral code:</Text>

          <Animated.View
            style={[
              styles.codeInputContainer,
              { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : colors.White },
            ]}
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
                onKeyPress={e => handleKeyPress(e, index)}
                ref={ref => setInputRef(ref as any, index)}
                onChangeText={text => handleCodeChange(text, index)}
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
              {
                shadowColor: colors.Primary,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : colors.White,
              },
            ]}
          >
            {device && isCameraActive && hasPermission ? (
              <Animated.View entering={FadeIn} style={styles.cameraContainer}>
                <Pressable
                  style={[styles.closeCamera, { backgroundColor: colors.Primary }]}
                  onPress={toggleCamera}
                >
                  <Text style={{ color: colors.White }}>✕</Text>
                </Pressable>

                <Camera
                  style={StyleSheet.absoluteFill}
                  device={device}
                  isActive={true}
                  codeScanner={codeScanner}
                />
              </Animated.View>
            ) : (
              <Pressable
                style={styles.qrCodeWrapper}
                onPress={() => requestPermission().then(res => setIsCameraActive(res))}
              >
                <Text style={[styles.scanText, { color: colors.TextColor }]}>
                  Tap to scan referral code
                </Text>
                <View style={styles.scanFrame}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: 0.5,
                    }}
                  >
                    <QRCode
                      value={code || '12'}
                      size={95}
                      color={colors.TextColor}
                      backgroundColor="transparent"
                    />
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

          {fromRegistration && (
            <Pressable
              onPress={() =>
                navigation.replace('BottomTab', {
                  screen: 'Home',
                })
              }
              style={styles.skipButton}
            >
              <Text style={[styles.skipButtonText, { color: colors.TextColor }]}>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>
    </GradientView>
  );
}

export default memo(RedeemReferralCode);

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  cameraContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: SIZES.radius,
    height: hp('27%'),
    overflow: 'hidden',
  },
  closeCamera: {
    alignItems: 'center',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    width: 30,
    zIndex: 99999,
  },
  codeInput: {
    borderBottomWidth: 2,
    fontFamily: FONTS.SemiBold,
    fontSize: SIZES.h3,
    height: hp('5%'),
    textAlign: 'center',
    width: hp('3%'),
  },
  codeInputContainer: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.base * 1.5,
    paddingHorizontal: SIZES.base * 2,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: hp('4%'),
  },
  cornerBL: {
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    bottom: 0,
    height: 20,
    left: 0,
    position: 'absolute',
    width: 20,
  },
  cornerBR: {
    borderBottomWidth: 2,
    borderRightWidth: 2,
    bottom: 0,
    height: 20,
    position: 'absolute',
    right: 0,
    width: 20,
  },
  cornerTL: {
    borderLeftWidth: 2,
    borderTopWidth: 2,
    height: 20,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 20,
  },
  cornerTR: {
    borderRightWidth: 2,
    borderTopWidth: 2,
    height: 20,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: hp('3%'),
  },
  dividerText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 13,
    marginHorizontal: SIZES.base * 2,
  },
  label: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    marginBottom: hp('1.5%'),
  },
  qrCodeWrapper: {
    alignItems: 'center',
    borderRadius: SIZES.radius,
    height: hp('27%'),
    justifyContent: 'center',
  },
  qrContainer: {
    alignSelf: 'center',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: hp('4%'),
    width: '83%',
    zIndex: 9999,
  },
  scanFrame: {
    height: hp('15%'),
    position: 'relative',
    top: 18,
    width: hp('15%'),
  },
  scanText: {
    flex: 1,
    fontFamily: FONTS.SemiBold,
    fontSize: 16.5,
    left: 0,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
    top: 15,
    width: '100%',
  },
  skipButton: {
    alignItems: 'center',
    height: hp('5%'),
    justifyContent: 'center',
  },
  skipButtonText: {
    fontFamily: FONTS.Regular,
    fontSize: SIZES.body4,
  },
  submitButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: SIZES.radius,
    height: 55,
    justifyContent: 'center',
    marginBottom: hp('1.5%'),
    width: 180,
  },
  submitButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
  },
});
