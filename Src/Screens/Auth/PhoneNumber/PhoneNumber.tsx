import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useEffect, useState} from 'react';
import {Image, PermissionsAndroid, Text, View} from 'react-native';
import {requestHint} from 'react-native-otp-verify';
import {CommonSize} from '../../../Common/CommonSize';
import AuthHeader from '../../../Components/AuthComponents/AuthHeader';
import CountryPickerView from '../../../Components/AuthComponents/CountryPickerView';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import styles from './styles';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {COLORS, SIZES} from '../../../Common/Theme';
import CommonIcons from '../../../Common/CommonIcons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const PhoneNumber: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const [visible, setVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [diallingCode, setDiallingCode] = useState<string | null>(null);
  const [defaultDiallingCode, setDefaultDiallingCode] = useState<string | null>(
    null,
  );
  const [StorePhoneNumber, setStorePhoneNumber] = useState<string | null>('');
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    GetPermission();
    requestHint()
      .then(res => console.log('requestHint:', res))
      .catch(console.log);
  }, []);

  const GetPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === 'granted') {
      requestHint()
        .then(res => {
          console.log(res);
        })
        .catch(Error => {
          console.log(Error);
        });
    }
  };

  return (
    <View style={styles.Container}>
      <View style={styles.SubContainerView}>
        <AuthHeader Logo={false} onPress={() => {}} />

        <View style={styles.NumberContainer}>
          <View style={styles.MyNumberTextView}>
            <Text style={styles.MyNumberText}>What’s your {'\n'}number?</Text>
            <Text style={styles.MyNumberSubText}>
              Please enter your valid phone number. We will send you 4-digit
              code to verify your account.
            </Text>
          </View>
        </View>

        <View>
          <View style={styles.PhoneNumberView}>
            <CountryPickerView
              visible={visible}
              setVisible={setVisible}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              diallingCode={diallingCode}
              defaultDiallingCode={defaultDiallingCode}
              setDiallingCode={setDiallingCode}
              setDefaultDiallingCode={setDefaultDiallingCode}
            />
          </View>

          {visible && (
            <Animated.View style={[styles.CountryCodeModalView, animatedStyle]}>
              <Image
                resizeMethod="auto"
                resizeMode="contain"
                source={CommonIcons.UP}
                style={styles.UpIcon}
              />
              <View>
                <Text>Hello</Text>
              </View>
            </Animated.View>
          )}
        </View>

        <View style={{marginVertical: CommonSize(15)}}>
          <GradientButton
            Title={'CONTINUE'}
            Disabled={StorePhoneNumber?.length === 0 ? true : false}
            Navigation={() => {
              navigation.navigate('LoginStack', {
                screen: 'OTP',
                params: {
                  number: StorePhoneNumber,
                },
              });
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default PhoneNumber;
