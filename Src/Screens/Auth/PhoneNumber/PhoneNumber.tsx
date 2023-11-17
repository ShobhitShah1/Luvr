import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {requestHint} from 'react-native-otp-verify';
import {CommonSize} from '../../../Common/CommonSize';
import {ActiveOpacity, COLORS} from '../../../Common/Theme';
import AuthHeader from '../../../Components/AuthComponents/AuthHeader';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import useCountryPicker from '../../../Hooks/useCountryPicker';
import styles from './styles';

const PhoneNumber: FC = () => {
  const {Visible, setVisible, CountryPickerComponent, setDefaultCountryCode} =
    useCountryPicker();

  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  const isFocused = useIsFocused();

  const [StorePhoneNumber, setStorePhoneNumber] = useState<string>('');

  const memoizedCountryPickerComponent = useMemo(
    () => <CountryPickerComponent />,
    [Visible],
  );

  useEffect(() => {
    // if (isFocused === true) {
    GetPermisstion();
    // }
  }, []);

  const GetPermisstion = async () => {
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
      Alert.alert('call', granted);
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
            <Text style={styles.MyNumberText}>My number is</Text>
          </View>
        </View>

        <View style={styles.PhoneNumberView}>
          <TouchableOpacity
            activeOpacity={ActiveOpacity}
            onPress={() => {
              setVisible(!Visible);
            }}
            style={styles.UserCountyAndCodeView}>
            {memoizedCountryPickerComponent}
            {/* <CountryPickerComponent /> */}
          </TouchableOpacity>
          <View style={styles.UserNumberTextView}>
            <TextInput
              value={StorePhoneNumber}
              autoFocus={true}
              textContentType="telephoneNumber"
              style={styles.UserNumberTextStyle}
              cursorColor={COLORS.Primary}
              placeholder="Phone Number"
              placeholderTextColor={COLORS.Placeholder}
              keyboardType="phone-pad"
              onChangeText={(value: string) => {
                setStorePhoneNumber(value);
              }}
            />
          </View>
        </View>

        <View
          style={{marginTop: CommonSize(20), marginHorizontal: CommonSize(10)}}>
          <Text style={styles.NumberHelpText}>
            When you tap "Continue", Tinder will send a test with verification
            code. Message and data rates may apply. The verified phone number
            can be used to log in.{' '}
            <Text style={styles.LearnWhatText}>
              Learn what happens when your number changes.
            </Text>
          </Text>
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
