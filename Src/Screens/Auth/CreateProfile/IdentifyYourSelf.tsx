/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, memo, useCallback, useRef, useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import GradientView from '../../../Common/GradientView';
import TextString from '../../../Common/TextString';
import { COLORS, FONTS, SIZES } from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomTextInput from '../../../Components/CustomTextInput';
import { MainGenders } from '../../../Components/Data';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';
import { updateField } from '../../../Redux/Action/actions';
import { store } from '../../../Redux/Store/store';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import { useCustomToast } from '../../../Utils/toastUtils';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';
import useKeyboardVisibility from '../../../Hooks/useKeyboardVisibility';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const IdentifyYourSelf: FC = () => {
  const { colors, isDark } = useTheme();
  const userData = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { showToast } = useCustomToast();
  const isKeyboardVisible = useKeyboardVisibility();

  const ScrollViewRef = useRef<ScrollView>(null);
  const dayInputRef = useRef<TextInput>(null);
  const monthInputRef = useRef<TextInput>(null);
  const yearInputRef = useRef<TextInput>(null);

  const [FirstName, setFirstName] = useState<string>(userData.full_name);
  const [BirthDateDD, setBirthDateDD] = useState<string>(
    userData.birthdate ? String(userData.birthdate).split('/')[0] : ''
  );
  const [BirthDateMM, setBirthDateMM] = useState<string>(
    userData.birthdate ? String(userData.birthdate).split('/')[1] : ''
  );
  const [BirthDateYYYY, setBirthDateYYYY] = useState<string>(
    userData.birthdate ? String(userData.birthdate).split('/')[2] : ''
  );
  const [CityName, setCityName] = useState<string>(userData.city);
  const [selectedGender, setSelectedGender] = useState<string>(userData.gender);

  // Track focused input field
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<{ LoginStack: {} }>>();

  const handleGenderSelection = (gender: string) => {
    setSelectedGender(gender);
  };

  const calculateAge = (inputDate: any) => {
    const [day, month, year] = inputDate.split(',').map((item: any) => parseInt(item.trim(), 10));

    if (month < 1 || month > 12) {
      throw new Error('Invalid month. Month must be between 1 and 12.');
    }

    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const isEligible = (age: number) => {
    return age >= 18 && age < 100;
  };

  const OnLetsGoButtonPress = useCallback(async () => {
    try {
      Keyboard.dismiss();

      if (!FirstName || !BirthDateDD || !BirthDateMM || !BirthDateYYYY || !selectedGender || !CityName) {
        showToast('Incomplete Information', 'Please fill in all required fields.', 'error');
        return;
      }

      const age = calculateAge(`${BirthDateDD},${BirthDateMM},${BirthDateYYYY}`);

      if (!isEligible(age)) {
        showToast(TextString.error.toUpperCase(), 'Please enter a valid age.', 'Error');
        return;
      }

      await Promise.all([
        dispatch(updateField(LocalStorageFields.full_name, FirstName)),
        dispatch(updateField(LocalStorageFields.birthdate, `${BirthDateDD}/${BirthDateMM}/${BirthDateYYYY}`)),
        dispatch(updateField(LocalStorageFields.gender, selectedGender)),
        dispatch(updateField(LocalStorageFields.city, CityName)),
      ]);

      navigation.navigate('LoginStack', {
        screen: 'SexualOrientationScreen',
      });
    } catch (error) {
      showToast(TextString.error.toUpperCase(), String(error), 'error');
    }
  }, [navigation, FirstName, BirthDateDD, BirthDateMM, BirthDateYYYY, selectedGender, CityName]);

  const renderInputField = (fieldName: string, props: any) => {
    return (
      <GradientBorderView
        style={[
          styles.TextInputViewStyle,
          { backgroundColor: isDark ? 'transparent' : colors.White, overflow: 'hidden' },
          props.containerStyle,
        ]}
        gradientProps={{ colors: isDark ? colors.ButtonGradient : ['transparent', 'transparent'] }}
      >
        <CustomTextInput
          {...props}
          onFocus={() => setFocusedInput(fieldName)}
          onBlur={() => setFocusedInput(null)}
          style={[styles.textInputStyle, { color: colors.TextColor }]}
          placeholderTextColor={COLORS.Gray}
        />
      </GradientBorderView>
    );
  };

  return (
    <GradientView>
      <View style={CreateProfileStyles.Container}>
        <CreateProfileHeader ProgressCount={1} Skip={false} hideBack={true} />

        <ScrollView
          ref={ScrollViewRef}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
          style={[styles.ContentView]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.TitleText, { color: colors.TitleText }]}>Identify your{'\n'}real self</Text>
          <Text style={[styles.subTitleText, { color: colors.TextColor }]}>
            Introduce yourself fill out the details{'\n'}so people know about you.
          </Text>

          <View style={styles.AllInputContainerView}>
            <View style={styles.TextViewForSpace}>
              <Text style={[styles.NameText, { color: colors.TitleText }]}>My name is</Text>
              {renderInputField('name', {
                value: FirstName,
                editable: store.getState().user?.full_name?.length === 0,
                onChangeText: (value: string) => {
                  setFirstName(value);
                },
                textContentType: 'givenName',
                placeholder: 'Enter your name',
              })}
            </View>

            <View style={styles.TextViewForSpace}>
              <Text style={[styles.NameText, { color: colors.TitleText }]}>My birthday is</Text>
              <View style={styles.BirthdayInputView}>
                {renderInputField('day', {
                  ref: dayInputRef,
                  containerStyle: { width: hp('11%') },
                  editable: true,
                  keyboardType: 'number-pad',
                  value: BirthDateDD,
                  onChangeText: (value: string) => {
                    if (value === '' || (/^\d{1,2}$/.test(value) && parseInt(value, 10) <= 31)) {
                      setBirthDateDD(value);
                      if (value.length === 2) {
                        monthInputRef?.current?.focus();
                      }
                    }
                  },
                  maxLength: 2,
                  placeholder: 'DD',
                })}

                {renderInputField('month', {
                  ref: monthInputRef,
                  containerStyle: { width: hp('11%') },
                  keyboardType: 'number-pad',
                  value: BirthDateMM,
                  onChangeText: (value: string) => {
                    if (value === '' || (/^\d{1,2}$/.test(value) && parseInt(value, 10) <= 12)) {
                      setBirthDateMM(value);
                      if (value.length === 2) {
                        yearInputRef?.current?.focus();
                      }
                    }
                  },
                  maxLength: 2,
                  placeholder: 'MM',
                })}

                {renderInputField('year', {
                  ref: yearInputRef,
                  containerStyle: { width: hp('11%') },
                  keyboardType: 'number-pad',
                  value: BirthDateYYYY,
                  onChangeText: (value: string) => {
                    setBirthDateYYYY(value);
                  },
                  maxLength: 4,
                  placeholder: 'YYYY',
                })}
              </View>
            </View>

            <View style={styles.TextViewForSpace}>
              <Text style={[styles.NameText, { color: colors.TitleText }]}>I am a</Text>
              <View style={styles.BirthdayInputView}>
                {MainGenders.map((gender, index) => (
                  <View key={index}>
                    {selectedGender === gender ? (
                      <GradientBorderView
                        gradientProps={{ colors: isDark ? colors.Gradient : ['transparent', 'transparent'] }}
                        style={[
                          styles.GenderView,
                          {
                            width: hp('11%'),
                            backgroundColor: !isDark && selectedGender === gender ? COLORS.Background : 'transparent',
                          },
                        ]}
                      >
                        <Pressable
                          onPress={() => handleGenderSelection(gender)}
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          <Text
                            style={[
                              styles.GenderText,
                              { color: selectedGender === gender ? COLORS.White : COLORS.Gray },
                            ]}
                          >
                            {gender}
                          </Text>
                        </Pressable>
                      </GradientBorderView>
                    ) : (
                      <View
                        style={[
                          styles.GenderView,
                          styles.regularBorder,
                          {
                            width: hp('11%'),
                            borderColor: isDark ? colors.InputBackground : 'transparent',
                            backgroundColor: isDark ? 'transparent' : colors.White,
                          },
                        ]}
                      >
                        <Pressable
                          onPress={() => handleGenderSelection(gender)}
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          <Text style={[styles.GenderText, { color: COLORS.Gray }]}>{gender}</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.TextViewForSpace}>
              <Text style={[styles.NameText, { color: colors.TitleText }]}>I am from</Text>
              {renderInputField('city', {
                value: CityName,
                onChangeText: (value: string) => {
                  setCityName(value);
                },
                onPressIn: () => {
                  ScrollViewRef.current?.scrollToEnd({ animated: true });
                },
                textContentType: 'givenName',
                placeholder: 'Enter your city name',
              })}
            </View>
          </View>
        </ScrollView>

        {!isKeyboardVisible && (
          <View style={styles.BottomButton}>
            <GradientButton
              isLoading={false}
              Title={'Continue'}
              Disabled={
                !FirstName || !BirthDateDD || !BirthDateMM || !BirthDateYYYY || !selectedGender || !CityName
                  ? true
                  : false
              }
              Navigation={() => OnLetsGoButtonPress()}
            />
          </View>
        )}
      </View>
    </GradientView>
  );
};

export default memo(IdentifyYourSelf);

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
  TextInputViewStyle: {
    padding: 0,
    borderWidth: 1,
    justifyContent: 'center',
    height: hp('6.8%'),
    borderRadius: SIZES.radius,
  },
  regularBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textInputStyle: {
    color: COLORS.Black,
    fontSize: hp('1.7%'),
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },
  GenderView: {
    padding: 0,
    borderWidth: 2.5,
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
