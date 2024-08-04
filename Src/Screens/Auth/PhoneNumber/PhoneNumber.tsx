/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import CommonIcons from '../../../Common/CommonIcons';
import TextString from '../../../Common/TextString';
import CountryPickerView from '../../../Components/AuthComponents/CountryPickerView';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomTextInput from '../../../Components/CustomTextInput';
import {CountryWithCode} from '../../../Components/Data';
import {useLocationPermission} from '../../../Hooks/useLocationPermission';
import {updateField} from '../../../Redux/Action/userActions';
import {store} from '../../../Redux/Store/store';
import UserService from '../../../Services/AuthService';
import {transformUserDataForApi} from '../../../Services/dataTransformService';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useCustomToast} from '../../../Utils/toastUtils';
import CreateProfileHeader from '../CreateProfile/Components/CreateProfileHeader';
import RenderCountryData from '../CreateProfile/Components/RenderCountryData';
import styles from './styles';

const SOMETHING_WRONG = 'Something went wrong, try again later';

const PhoneNumber: FC = () => {
  const navigation = useNavigation<any>();
  const userData = useSelector((state: any) => state?.user);
  const textInputRef = useRef<TextInput>(null);
  const dispatch = useDispatch();
  const {showToast} = useCustomToast();
  const [IsAPILoading, setIsAPILoading] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [diallingCode, setDiallingCode] = useState<string | null>(
    userData.phoneNumberCountryCode || '+91',
  );
  const [defaultDiallingCode, setDefaultDiallingCode] = useState<string | null>(
    userData.phoneNumberCountryCode || '+91',
  );
  const [StorePhoneNumber, setStorePhoneNumber] = useState<string>(
    userData.phoneNumberWithoutCode,
  );
  const [SearchText, setSearchText] = useState<string | undefined>('');
  const [FilteredCountries, setFilteredCountries] = useState(CountryWithCode);
  const {checkLocationPermission} = useLocationPermission();

  const opacity = useSharedValue(0);

  const PhoneNumberString: String = `${
    diallingCode || defaultDiallingCode
  }${StorePhoneNumber}`;

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    });

    return () => focusListener();
  }, [navigation]);

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

  const handleCountryPress = (item: any) => {
    setDiallingCode(item.dialling_code);
    setDefaultDiallingCode(item.dialling_code);
    setVisible(false);
  };

  const searchFunction = (text: string) => {
    const filteredCountries = CountryWithCode.filter(
      country =>
        country.name.toLowerCase().includes(text.toLowerCase()) ||
        country.dialling_code.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredCountries(filteredCountries);
  };

  const onNextClick = async () => {
    try {
      Keyboard.dismiss();
      setIsAPILoading(true);

      const isValidNumber =
        StorePhoneNumber?.length >= 10 &&
        StorePhoneNumber?.length <= 12 &&
        StorePhoneNumber.match('[0-9]{10}');

      const isGuestNumber = StorePhoneNumber === '7041526621';

      if (isGuestNumber) {
        await GetUserWithoutOTP();
        return;
      }

      if (isValidNumber) {
        await handleSendOtp();
        return;
      }

      showToast(
        'Invalid Phone Number',
        'Please check your phone number',
        'error',
      );
    } catch (error: any) {
      showToast('Error', String(error?.message || error), 'error');
    } finally {
      setIsAPILoading(false);
    }
  };

  const GetUserWithoutOTP = async () => {
    try {
      const tasks = [
        updateField(LocalStorageFields.mobile_no, PhoneNumberString),
        updateField(
          LocalStorageFields.phoneNumberCountryCode,
          `${diallingCode || defaultDiallingCode}`,
        ),
        updateField(
          LocalStorageFields.phoneNumberWithoutCode,
          StorePhoneNumber,
        ),
        updateField(LocalStorageFields.isVerified, true),
      ];

      await Promise.all(tasks.map(task => dispatch(task)));

      handleNavigation();
    } catch (error: any) {
      showToast('Error', String(error?.message || error), 'error');
      setIsAPILoading(false);
    }
  };

  const handleNavigation = async () => {
    try {
      const userDataForApi = transformUserDataForApi(userData);

      const userDataWithValidation = {
        ...userDataForApi,
        validation: true,
        mobile_no: PhoneNumberString || store?.getState()?.user?.mobile_no,
      };

      const APIResponse = await UserService.UserRegister(
        userDataWithValidation,
      );

      if (APIResponse && (APIResponse?.status || APIResponse?.code === 200)) {
        const token = APIResponse?.data?.token || '';

        if (token) {
          dispatch(updateField(LocalStorageFields.Token, token));
          storeDataAPI();
        } else {
          navigation.replace('LoginStack');
          setIsAPILoading(false);
        }
      } else {
        throw new Error(APIResponse?.error || SOMETHING_WRONG);
      }
    } catch (error: any) {
      console.log('first', error);
      showToast('Server Error', String(error.message || error), 'error');
      setIsAPILoading(false);
    }
  };

  const storeDataAPI = async () => {
    Keyboard.dismiss();
    const userDataToSend = {eventName: 'get_profile'};

    try {
      const APIResponse = await UserService.UserRegister(userDataToSend);

      if (APIResponse?.code !== 200) {
        throw new Error('Failed to get profile data');
      }

      const ModifyData = {
        ...APIResponse.data,
        latitude: userData?.latitude || 0,
        longitude: userData?.longitude || 0,
        eventName: 'update_profile',
      };

      const UpdateAPIResponse = await UserService.UserRegister(ModifyData);

      if (UpdateAPIResponse?.code !== 200) {
        const errorMessage =
          UpdateAPIResponse?.error ||
          'Unknown error occurred during registration.';
        throw new Error(errorMessage);
      }

      Keyboard.dismiss();
      const IS_NOTIFICATION_ENABLE = await checkLocationPermission();
      dispatch(updateField(LocalStorageFields.isVerified, true));

      const nextScreen = IS_NOTIFICATION_ENABLE ? 'BottomTab' : 'LocationStack';
      const navigationParams = IS_NOTIFICATION_ENABLE
        ? undefined
        : {screen: 'LocationPermission'};
      navigation.replace(nextScreen, navigationParams);

      setIsAPILoading(false);
    } catch (error: any) {
      showToast('Error', String(error.message || error), 'error');
      setIsAPILoading(false);
    }
  };

  const handleSendOtp = async () => {
    setIsAPILoading(true);

    try {
      const userDataForApi = {
        eventName: 'send_otp',
        mobile_no: PhoneNumberString,
      };

      const response = await UserService.UserRegister(userDataForApi);
      console.log('handleSendOtp response:', response);

      if (response?.code === 200) {
        await Promise.all([
          dispatch(
            updateField(LocalStorageFields.mobile_no, PhoneNumberString),
          ),
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

        showToast(
          'OTP Sent Successfully',
          'Please check your device for OTP',
          'success',
        );

        navigation.navigate('NumberVerification', {
          screen: 'OTP',
          params: {number: PhoneNumberString},
        });
      } else {
        throw new Error(String(response?.message) || SOMETHING_WRONG);
      }
    } catch (error: any) {
      showToast(
        TextString.error.toUpperCase(),
        String(error?.message || error) || 'Failed to send OTP. Try again.',
        'error',
      );
    } finally {
      setIsAPILoading(false);
    }
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

  const EmptyComponent = () => {
    return (
      <View style={styles.ListEmptyView}>
        <Text style={styles.ListEmptyText}>
          No Country With Name "{SearchText}" Available
        </Text>
      </View>
    );
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
            ref={textInputRef}
            value={StorePhoneNumber}
            visible={visible}
            setVisible={setVisible}
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
                  keyboardShouldPersistTaps="handled"
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
