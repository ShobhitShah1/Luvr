/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useRef, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {ActiveOpacity, COLORS, FONTS, SIZES} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomTextInput from '../../../Components/CustomTextInput';
import {MainGenders} from '../../../Components/Data';
import useKeyboardVisibility from '../../../Hooks/useKeyboardVisibility';
import {updateField} from '../../../Redux/Action/userActions';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useCustomToast} from '../../../Utils/toastUtils';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';
import {store} from '../../../Redux/Store/store';

const IdentifyYourSelf: FC = () => {
  //* Get Key Name. From Where You Want To Store Data
  const KeyboardVisible = useKeyboardVisibility();
  const userData = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const {showToast} = useCustomToast();
  //* Ref's
  const ScrollViewRef = useRef<ScrollView>(null);
  const dayInputRef = useRef(null);
  const monthInputRef = useRef(null);
  const yearInputRef = useRef(null);

  //* All States
  const [FirstName, setFirstName] = useState<string>(userData.full_name);
  const [BirthDateDD, setBirthDateDD] = useState<string>(
    userData.birthdate ? String(userData.birthdate).split('/')[0] : '',
  );
  const [BirthDateMM, setBirthDateMM] = useState<string>(
    userData.birthdate ? String(userData.birthdate).split('/')[1] : '',
  );
  const [BirthDateYYYY, setBirthDateYYYY] = useState<string>(
    userData.birthdate ? String(userData.birthdate).split('/')[2] : '',
  );
  const [CityName, setCityName] = useState<string>(userData.city);
  const [selectedGender, setSelectedGender] = useState<string>(userData.gender);

  //* Navigation
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  const handleGenderSelection = (gender: string) => {
    setSelectedGender(gender);
  };

  const calculateAge = inputDate => {
    const [day, month, year] = inputDate
      .split(',')
      .map(item => parseInt(item.trim(), 10));

    if (month < 1 || month > 12) {
      throw new Error('Invalid month. Month must be between 1 and 12.');
    }

    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const isEligible = age => {
    return age >= 18 && age < 100;
  };

  //* Modal Button Navigate To Screen
  const OnLetsGoButtonPress = useCallback(() => {
    try {
      Keyboard.dismiss();

      //* Check if required fields are filled
      if (
        !FirstName ||
        !BirthDateDD ||
        !BirthDateMM ||
        !BirthDateYYYY ||
        !selectedGender ||
        !CityName
      ) {
        //* Show an alert with a proper message
        showToast(
          'Incomplete Information',
          'Please fill in all required fields.',
          'error',
        );
        return;
      }

      const age = calculateAge(
        `${BirthDateDD},${BirthDateMM},${BirthDateYYYY}`,
      );

      if (!isEligible(age)) {
        showToast('Error', 'Please enter a valid age.', 'Error');
        console.log('User is not eligible.');
        return;
      }

      //* If all required fields are filled, update the context and navigate
      setTimeout(() => {
        dispatch(updateField(LocalStorageFields.full_name, FirstName));
        dispatch(
          updateField(
            LocalStorageFields.birthdate,
            `${BirthDateDD}/${BirthDateMM}/${BirthDateYYYY}`,
          ),
        );
        dispatch(updateField(LocalStorageFields.gender, selectedGender));
        dispatch(updateField(LocalStorageFields.city, CityName));
      }, 0);

      //* Use navigation.navigate callback to update context after navigation
      navigation.navigate('LoginStack', {
        screen: 'SexualOrientationScreen',
      });
    } catch (error) {
      showToast('Error', String(error), 'error');
    }
  }, [
    navigation,
    FirstName,
    BirthDateDD,
    BirthDateMM,
    BirthDateYYYY,
    selectedGender,
    CityName,
  ]);

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={1} Skip={false} />

      <ScrollView
        ref={ScrollViewRef}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        style={[styles.ContentView]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.TitleText}>Identify your{'\n'}real self</Text>
        <Text style={styles.subTitleText}>
          Introduce yourself fill out the details{'\n'}so people know about you.
        </Text>

        <View style={styles.AllInputContainerView}>
          {/* Name */}
          <View style={styles.TextViewForSpace}>
            <Text style={styles.NameText}>My name is</Text>
            <CustomTextInput
              value={FirstName}
              editable={store.getState().user?.full_name?.length === 0}
              onChangeText={value => {
                setFirstName(value);
              }}
              textContentType="givenName"
              placeholder="Enter your name"
              style={styles.TextInputStyle}
              placeholderTextColor={COLORS.Gray}
            />
          </View>

          {/* Birthday */}
          <View style={styles.TextViewForSpace}>
            <Text style={styles.NameText}>My birthday is</Text>
            <View style={styles.BirthdayInputView}>
              <CustomTextInput
                ref={dayInputRef}
                editable={true}
                keyboardType={'number-pad'}
                value={BirthDateDD}
                onChangeText={value => {
                  if (
                    value === '' ||
                    (/^\d{1,2}$/.test(value) && parseInt(value, 10) <= 31)
                  ) {
                    setBirthDateDD(value);
                    if (value.length === 2) {
                      monthInputRef?.current?.focus();
                    }
                  }
                }}
                maxLength={2}
                placeholder="DD"
                style={[styles.TextInputStyle, {width: hp('12%')}]}
                placeholderTextColor={COLORS.Gray}
              />
              <CustomTextInput
                ref={monthInputRef}
                value={BirthDateMM}
                keyboardType={'number-pad'}
                onChangeText={value => {
                  if (
                    value === '' ||
                    (/^\d{1,2}$/.test(value) && parseInt(value, 10) <= 12)
                  ) {
                    setBirthDateMM(value);
                    if (value.length === 2) {
                      yearInputRef?.current?.focus();
                    }
                  }
                }}
                maxLength={2}
                placeholder="MM"
                style={[styles.TextInputStyle, {width: hp('12%')}]}
                placeholderTextColor={COLORS.Gray}
              />
              <CustomTextInput
                ref={yearInputRef}
                value={BirthDateYYYY}
                keyboardType={'number-pad'}
                onChangeText={value => {
                  setBirthDateYYYY(value);
                }}
                maxLength={4}
                placeholder="YYYY"
                style={[styles.TextInputStyle, {width: hp('12%')}]}
                placeholderTextColor={COLORS.Gray}
              />
            </View>
          </View>

          {/* Im */}
          <View style={styles.TextViewForSpace}>
            <Text style={styles.NameText}>I am a</Text>
            <View style={styles.BirthdayInputView}>
              {MainGenders.map((gender, index) => (
                <TouchableOpacity
                  activeOpacity={ActiveOpacity}
                  key={index}
                  onPress={() => handleGenderSelection(gender)}
                  style={[
                    styles.GenderView,
                    {
                      width: hp('12%'),
                      backgroundColor:
                        selectedGender === gender
                          ? COLORS.Primary
                          : COLORS.White,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.GenderText,
                      {
                        color:
                          selectedGender === gender
                            ? COLORS.White
                            : COLORS.Gray,
                      },
                    ]}>
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* From */}
          <View style={styles.TextViewForSpace}>
            <Text style={styles.NameText}>I am from</Text>
            <CustomTextInput
              value={CityName}
              onChangeText={value => {
                setCityName(value);
              }}
              onPressIn={() => {
                ScrollViewRef.current?.scrollToEnd({animated: true});
              }}
              textContentType="givenName"
              placeholder="Enter your city name"
              style={styles.TextInputStyle}
              placeholderTextColor={COLORS.Gray}
            />
          </View>
        </View>
      </ScrollView>

      {!KeyboardVisible && (
        <View style={styles.BottomButton}>
          <GradientButton
            isLoading={false}
            Title={'Continue'}
            Disabled={
              !FirstName ||
              !BirthDateDD ||
              !BirthDateMM ||
              !BirthDateYYYY ||
              !selectedGender ||
              !CityName
                ? true
                : false
            }
            Navigation={() => OnLetsGoButtonPress()}
          />
        </View>
      )}
    </View>
  );
};

export default IdentifyYourSelf;

const styles = StyleSheet.create({
  ContentView: {
    width: '100%',
    paddingTop: hp('0.5%'),
    paddingBottom: hp('13%'),
    paddingHorizontal: hp('4.2%'),
  },
  TitleText: {
    color: COLORS.Primary,
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
  TextInputStyle: {
    padding: 0,
    color: COLORS.Black,
    fontSize: hp('1.7%'),
    borderColor: COLORS.Black,
    backgroundColor: COLORS.White,
    height: hp('6.8%'),
    fontFamily: FONTS.SemiBold,
    borderRadius: SIZES.radius,
    textAlign: 'center',
  },
  GenderView: {
    padding: 0,
    backgroundColor: COLORS.White,
    height: hp('6.8%'),
    width: wp('85%'),
    borderRadius: SIZES.radius,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  GenderText: {
    fontFamily: FONTS.Medium,
    color: COLORS.Gray,
    fontSize: hp('1.7%'),
  },
  BottomButton: {
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp('2%'),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  TextViewForSpace: {
    alignContent: 'center',
    marginBottom: hp('1.5%'),
  },
  NameText: {
    marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
    fontSize: hp('1.8%'),
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
  },
  BirthdayInputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  subTitleText: {
    fontSize: hp('1.6%'),
    fontFamily: FONTS.SemiBold,
    color: COLORS.Black,
    marginTop: hp(1),
  },
  AllInputContainerView: {
    width: '100%',
    marginTop: hp('2%'),
  },
});
