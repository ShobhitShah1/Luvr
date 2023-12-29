/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import axios from 'axios';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {requestHint} from 'react-native-otp-verify';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import CommonIcons from '../../../Common/CommonIcons';
import CountryPickerView from '../../../Components/AuthComponents/CountryPickerView';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomTextInput from '../../../Components/CustomTextInput';
import CountryWithCode from '../../../Components/Data/CountryWithCode';
import ApiConfig from '../../../Config/ApiConfig';
import {updateField} from '../../../Redux/Action/userActions';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useCustomToast} from '../../../Utils/toastUtils';
import CreateProfileHeader from '../CreateProfile/Components/CreateProfileHeader';
import RenderCountryData from '../CreateProfile/Components/RenderCountryData';
import styles from './styles';

const PhoneNumber: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{NumberVerification: {}}>>();
  const isFocused = useIsFocused();

  const userData = useSelector((state: any) => state?.user);
  const dispatch = useDispatch();
  const {showToast} = useCustomToast();
  const [IsAPILoading, setIsAPILoading] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [diallingCode, setDiallingCode] = useState<string | null>(
    userData.phoneNumberCountryCode,
  );
  const [defaultDiallingCode, setDefaultDiallingCode] = useState<string | null>(
    userData.phoneNumberCountryCode,
  );
  const [StorePhoneNumber, setStorePhoneNumber] = useState<string>(
    userData.phoneNumberWithoutCode,
  );
  const [SearchText, setSearchText] = useState<string | undefined>('');
  const [FilteredCountries, setFilteredCountries] = useState(CountryWithCode);

  const opacity = useSharedValue(0);
  const PhoneNumberString: String = `${
    diallingCode || defaultDiallingCode
  }${StorePhoneNumber}`;

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [visible, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    if (isFocused === true && PhoneNumber.length !== 0) {
      GetPermission();
    }
  }, [isFocused]);

  const GetPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.READ_PHONE_NUMBERS);

      if (result === RESULTS.GRANTED) {
        setStorePhoneNumber(await requestHint());
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  const handleCountryPress = (item: any, index: number) => {
    console.log('Country pressed:', item, index);
    setDiallingCode(item.dialling_code);
    setDefaultDiallingCode(item.dialling_code);
    setVisible(false);
  };

  const renderItem = useCallback(
    ({item, index}: any) => (
      <RenderCountryData
        data={item}
        index={index}
        onPress={handleCountryPress}
      />
    ),
    [],
  );

  const searchFunction = (text: string) => {
    const filteredCountries = CountryWithCode.filter(country =>
      country.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredCountries(filteredCountries);
  };

  const EmptyComponent = () => {
    return (
      <View style={styles.ListEmptyView}>
        <Text style={styles.ListEmptyText}>
          No Country With Name "{SearchText}" Available
        </Text>
      </View>
    );
  };

  const onNextClick = () => {
    if (
      StorePhoneNumber?.length >= 10 &&
      StorePhoneNumber?.length <= 12 &&
      StorePhoneNumber.match('[0-9]{10}')
    ) {
      handleSendOtp();
    } else {
      showToast(
        'Invalid Phone Number',
        'Please check your phone number',
        'error',
      );
    }
  };

  //* API Calls
  const handleSendOtp = async () => {
    setIsAPILoading(true);
    try {
      const url = `${ApiConfig.OTP_BASE_URL}${
        diallingCode || defaultDiallingCode
      }${StorePhoneNumber}/AUTOGEN3/OTP1`;

      const response = await axios.get(url);

      if (response.data?.Status === 'Success') {
        showToast(
          'OTP Sent Successfully',
          'Please check your device for OTP',
          'success',
        );
        await Promise.all([
          dispatch(updateField(LocalStorageFields.mobileNo, PhoneNumberString)),
          dispatch(
            updateField(
              LocalStorageFields.phoneNumberCountryCode,
              `${diallingCode || defaultDiallingCode}`,
            ),
          ),
          dispatch(
            updateField(
              LocalStorageFields.phoneNumberWithoutCode,
              StorePhoneNumber,
            ),
          ),
        ]);
        setTimeout(() => {
          navigation.navigate('NumberVerification', {
            screen: 'OTP',
            params: {
              number: PhoneNumberString,
            },
          });
        }, 0);
      } else {
        showToast(
          'Server Error',
          'Something went wrong, try again later',
          'error',
        );
      }
    } catch (error) {
      showToast(
        'Error',
        'Failed to send otp OTP. Please check your network connection and try again.',
        'error',
      );
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsAPILoading(false);
    }
  };

  return (
    <View style={styles.Container}>
      <CreateProfileHeader ProgressCount={0} Skip={false} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
        style={styles.SubContainerView}>
        <View style={styles.NumberContainer}>
          <View style={styles.MyNumberTextView}>
            <Text style={styles.MyNumberText}>What’s your {'\n'}number?</Text>
            <Text style={styles.MyNumberSubText}>
              Please enter your valid phone number. We will send you 4-digit
              code to verify your account.
            </Text>
          </View>
        </View>

        <View style={styles.PhoneNumberView}>
          <CountryPickerView
            value={StorePhoneNumber}
            visible={visible}
            setVisible={setVisible}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setValue={setStorePhoneNumber}
            diallingCode={diallingCode}
            defaultDiallingCode={defaultDiallingCode}
            setDiallingCode={setDiallingCode}
            setDefaultDiallingCode={setDefaultDiallingCode}
          />
        </View>

        {visible && (
          <KeyboardAvoidingView behavior="height">
            <Animated.View style={[styles.CountryCodeModalView, animatedStyle]}>
              <Image
                resizeMethod="auto"
                resizeMode="contain"
                source={CommonIcons.UP}
                style={styles.UpIcon}
              />
              <View style={styles.SelectCountryView}>
                <View style={styles.SearchCountryView}>
                  <Image
                    source={CommonIcons.Search}
                    style={styles.SearchIconStyle}
                  />
                  <CustomTextInput
                    value={SearchText}
                    onChangeText={text => {
                      setSearchText(text);
                      searchFunction(text);
                    }}
                    placeholder={'Search country'}
                    placeholderTextColor={'rgba(130, 130, 130, 1)'}
                    style={styles.SearchCountryText}
                  />
                </View>
              </View>

              <View style={styles.CountyListView}>
                <FlatList
                  nestedScrollEnabled={true}
                  data={FilteredCountries}
                  initialNumToRender={20}
                  maxToRenderPerBatch={20}
                  disableVirtualization={true}
                  removeClippedSubviews={true}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                  ListEmptyComponent={EmptyComponent}
                />
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        )}

        <View style={{marginVertical: visible ? 0 : hp('4%')}}>
          <GradientButton
            Title={'CONTINUE'}
            isLoading={IsAPILoading}
            Navigation={onNextClick}
            Disabled={StorePhoneNumber?.length === 0 ? true : false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default PhoneNumber;
