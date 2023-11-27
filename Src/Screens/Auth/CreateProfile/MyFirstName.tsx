/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {CommonSize} from '../../../Common/CommonSize';
import {COLORS, FONTS, GROUP_FONT, SIZES} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomTextInput from '../../../Components/CustomTextInput';
import {useUserData} from '../../../Contexts/UserDataContext';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useFieldConfig} from '../../../Utils/StorageUtils';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const MyFirstName: FC = () => {
  let ProgressCount: number = 0.1;

  //* Get Key Name. From Where You Want To Store Data
  const StoreStringName = useFieldConfig(LocalStorageFields.firstName);
  const {userData, dispatch} = useUserData();

  //* All States
  const [FirstName, setFirstName] = useState<string>(userData.firstName);
  const [BirthDateDD, setBirthDateDD] = useState<string>('');
  const [BirthDateMM, setBirthDateMM] = useState<string>('');
  const [BirthDateYYYY, setBirthDateYYYY] = useState<string>('');
  const [CityName, setCityName] = useState<string>('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');

  const genders = ['Man', 'Woman', 'Other'];

  const handleGenderSelection = (gender: string) => {
    setSelectedGender(gender);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardOpen(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardOpen(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  //* Navigation
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  //* On Next Click This Will Call And Store Data
  const handleInputChange = useCallback(
    (field: string, value: string) => {
      dispatch({type: 'UPDATE_FIELD', field, value});
    },
    [dispatch],
  );

  //* Modal Button Navigate To Screen
  const OnLetsGoButtonPress = useCallback(() => {
    Keyboard.dismiss();
    handleInputChange(StoreStringName, FirstName);
    setTimeout(() => {
      navigation.navigate('LoginStack', {
        screen: 'SexualOrientationScreen',
      });
    }, 300);
  }, [navigation]);

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={1} Skip={false} />

      <ScrollView
        style={[CreateProfileStyles.ContentView, {paddingBottom: hp('12%')}]}
        showsVerticalScrollIndicator={false}>
        <Text
          style={{
            color: COLORS.Primary,
            fontSize: hp('3.3%'),
            fontFamily: FONTS.Bold,
          }}>
          Identify your{'\n'}real self
        </Text>
        <Text style={CreateProfileStyles.subTitleText}>
          Introduce yourself fill out the details{'\n'}so people know about you.
        </Text>
        <View style={CreateProfileStyles.nameView}>
          <Text style={CreateProfileStyles.NameText}>My name is</Text>
          <CustomTextInput
            value={FirstName}
            onChangeText={value => {
              setFirstName(value);
            }}
            textContentType="givenName"
            placeholder="Enter your name"
            style={styles.TextInputStyle}
            placeholderTextColor={COLORS.Gray}
          />
        </View>
        <View style={[{marginTop: hp('3.5%')}]}>
          <Text style={CreateProfileStyles.NameText}>My birthday is</Text>
          <View style={CreateProfileStyles.BirthdayInputView}>
            <CustomTextInput
              editable={true}
              keyboardType={'number-pad'}
              value={BirthDateDD}
              onChangeText={value => {
                setBirthDateDD(value);
              }}
              maxLength={2}
              textContentType="givenName"
              placeholder="DD"
              style={[styles.TextInputStyle, {width: hp('12%')}]}
              placeholderTextColor={COLORS.Gray}
            />
            <CustomTextInput
              value={BirthDateMM}
              onChangeText={value => {
                setBirthDateMM(value);
              }}
              maxLength={2}
              textContentType="givenName"
              placeholder="MM"
              style={[
                styles.TextInputStyle,
                {width: hp('12%'), marginLeft: hp('1.2%')},
              ]}
              placeholderTextColor={COLORS.Gray}
            />
            <CustomTextInput
              value={BirthDateYYYY}
              onChangeText={value => {
                setBirthDateYYYY(value);
              }}
              maxLength={4}
              textContentType="givenName"
              placeholder="YYYY"
              style={[
                styles.TextInputStyle,
                {width: hp('12%'), marginLeft: hp('1.2%')},
              ]}
              placeholderTextColor={COLORS.Gray}
            />
          </View>
        </View>
        <View style={{marginTop: hp('3.5%')}}>
          <Text style={CreateProfileStyles.NameText}>I am a</Text>
          <View style={CreateProfileStyles.BirthdayInputView}>
            {genders.map((gender, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleGenderSelection(gender)}
                style={[
                  styles.GenderView,
                  {
                    width: hp('12%'),
                    marginLeft: index > 0 ? hp('1.2%') : 0,
                    backgroundColor:
                      selectedGender === gender ? COLORS.Primary : COLORS.White,
                  },
                ]}>
                <Text
                  style={[
                    styles.GenderText,
                    {
                      color:
                        selectedGender === gender ? COLORS.White : COLORS.Black,
                    },
                  ]}>
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={[{marginTop: hp('2.5%'), marginBottom: hp('2.5%')}]}>
          <Text style={CreateProfileStyles.NameText}>I am from</Text>
          <CustomTextInput
            value={CityName}
            onChangeText={value => {
              setCityName(value);
            }}
            textContentType="givenName"
            placeholder="Enter your city name"
            style={styles.TextInputStyle}
            placeholderTextColor={COLORS.Gray}
          />
        </View>
      </ScrollView>

      {!isKeyboardOpen && (
        <View style={CreateProfileStyles.BottomButton}>
          <GradientButton
            Title={'Continue'}
            // Disabled={FirstName.length === 0 ? true : false}
            Disabled={false}
            Navigation={() => OnLetsGoButtonPress()}
          />
        </View>
      )}
    </View>
  );
};

export default MyFirstName;

const styles = StyleSheet.create({
  TextInputStyle: {
    padding: 0,
    paddingVertical: hp('0.1%'),
    marginTop: hp('1%'),
    color: COLORS.Black,
    fontSize: hp('1.7%'),
    borderColor: COLORS.Black,
    marginVertical: hp('1%'),
    backgroundColor: COLORS.White,
    height: hp('5.7%'),
    width: wp('85%'),
    borderRadius: 30,
    alignItems: 'center',
    textAlign: 'center',
  },
  GenderView: {
    marginVertical: hp('1%'),
    backgroundColor: COLORS.White,
    height: hp('5.2%'),
    width: wp('80%'),
    borderRadius: 30,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  GenderText: {
    fontFamily: FONTS.Medium,
    color: COLORS.Gray,
    fontSize: hp('1.7%'),
  },
  InfoText: {
    fontFamily: FONTS.Medium,
    color: COLORS.Black,
    fontSize: hp('1.6%'),
  },
  CantChangeText: {
    ...GROUP_FONT.h4,
    fontSize: hp('1.6%'),
  },

  // Modal
  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ModalSubView: {
    width: wp('80%'),
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: hp('4%'),
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.White,
  },
  EmojiView: {
    fontSize: hp('5%'),
  },
  WelcomeUserText: {
    ...GROUP_FONT.h2,
    marginBottom: hp('1%'),
    width: '75%',
    textAlign: 'center',
  },
  DescriptionText: {
    ...GROUP_FONT.h3,
    textAlign: 'center',
    fontFamily: FONTS.Regular,
    marginVertical: hp('0.5%'),
    paddingHorizontal: wp('10%'),
  },

  // Lets Go Button
  CreateAccountButton: {
    width: '65%',
    overflow: 'hidden',
    alignSelf: 'center',
    height: hp('5.5%'),
    marginVertical: hp('2%'),
    justifyContent: 'center',
    borderRadius: CommonSize(50),
  },
  GradientViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  NewAccountText: {
    textAlign: 'center',
    color: COLORS.White,
    fontSize: hp('1.8%'),
    fontFamily: FONTS.Bold,
  },
  EditNameText: {
    marginBottom: hp('1.5%'),
    fontFamily: FONTS.Bold,
    color: COLORS.Gray,
    fontSize: hp('2.2%'),
  },
});
