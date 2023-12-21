/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
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
import CommonIcons from '../../../Common/CommonIcons';
import CountryPickerView from '../../../Components/AuthComponents/CountryPickerView';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomTextInput from '../../../Components/CustomTextInput';
import CountryWithCode from '../../../Components/Data/CountryWithCode';
import CreateProfileHeader from '../CreateProfile/Components/CreateProfileHeader';
import RenderCountryData from '../CreateProfile/Components/RenderCountryData';
import styles from './styles';
import {post} from '../../../utils/apiUtils';
import ApiConfig from '../../../Config/ApiConfig';

const PhoneNumber: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const isFocused = useIsFocused();
  // const userData = useSelector(state => state.user);
  // console.log('userData', userData);
  const [visible, setVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [diallingCode, setDiallingCode] = useState<string | null>(null);
  const [defaultDiallingCode, setDefaultDiallingCode] = useState<string | null>(
    null,
  );
  const [StorePhoneNumber, setStorePhoneNumber] = useState<string | undefined>(
    '',
  );
  const [SearchText, setSearchText] = useState<string | undefined>('');
  const [FilteredCountries, setFilteredCountries] = useState(CountryWithCode);
  const opacity = useSharedValue(0);

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
    if (PhoneNumber.length > 10) {
      Alert.alert('Error', 'Please check your phone number');
    } else {
      handleSendOtp();
    }
  };

  //* API Calls
  const handleSendOtp = async () => {


    navigation.navigate('LoginStack', {
      screen: 'OTP',
      params: {
        number: StorePhoneNumber,
      },
    });


    // try {
    //   // Make a POST request to your OTP API using the base URL from ApiConfig
    //   const response = await post(ApiConfig.OTP_BASE_URL, {
    //     PhoneNumber,
    //   });

    //   // Handle the response from the OTP API (customize as needed)
    //   console.log('OTP API Response:', response);

      // navigation.navigate('LoginStack', {
      //   screen: 'OTP',
      //   params: {
      //     number: StorePhoneNumber,
      //   },
      // });

    //   // Alert.alert('OTP Sent', 'Please check your phone for the OTP.');
    // } catch (error) {
    //   console.error('Error sending OTP:', error);
    //   Alert.alert('Error', 'Failed to send OTP. Please try again.');
    // }
  };

  return (
    <View style={styles.Container}>
      <CreateProfileHeader ProgressCount={0} Skip={true} />
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
            setValue={setStorePhoneNumber}
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
            Disabled={StorePhoneNumber?.length === 0 ? true : false}
            Navigation={onNextClick}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default PhoneNumber;
