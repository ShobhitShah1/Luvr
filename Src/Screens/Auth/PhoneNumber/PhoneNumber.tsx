import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommonIcons from '../../../Common/CommonIcons';
import {CommonSize} from '../../../Common/CommonSize';
import {COLORS} from '../../../Common/Theme';
import AuthHeader from '../../../Components/AuthComponents/AuthHeader';
import CountryPickerView from '../../../Components/AuthComponents/CountryPickerView';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomTextInput from '../../../Components/CustomTextInput';
import CountryWithCode from '../../../Components/Data/CountryWithCode';
import RenderCountryData from '../CreateProfile/Components/RenderCountryData';
import styles from './styles';
import CreateProfileHeader from '../CreateProfile/Components/CreateProfileHeader';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const PhoneNumber: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  // const isFocused = useIsFocused();
  // const TextInputRef = useRef();
  const [visible, setVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [diallingCode, setDiallingCode] = useState<string | null>(null);
  const [defaultDiallingCode, setDefaultDiallingCode] = useState<string | null>(
    null,
  );
  const [StorePhoneNumber, setStorePhoneNumber] = useState<string | null>('');
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

  // useEffect(() => {
  //   if (isFocused === true) {
  //     GetPermission();
  //   }
  // }, [isFocused]);

  // const GetPermission = async () => {
  //   try {
  //     const result = await request(PERMISSIONS.ANDROID.READ_PHONE_NUMBERS);

  //     if (result === RESULTS.GRANTED) {
  //       setStorePhoneNumber(await requestHint());
  //     }
  //   } catch (error) {
  //     console.error('Permission request failed:', error);
  //   }
  // };

  const handleCountryPress = (item: any, index: number) => {
    // Handle the press action with the item's data and index
    console.log('Country pressed:', item, index);
    setDiallingCode(item.dialling_code);
    setDefaultDiallingCode(item.dialling_code);
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
                  <AntDesign
                    name="search1"
                    size={20}
                    color={'rgba(130, 130, 130, 1)'}
                    style={styles.SearchIcon}
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
      </ScrollView>
    </View>
  );
};

export default PhoneNumber;
