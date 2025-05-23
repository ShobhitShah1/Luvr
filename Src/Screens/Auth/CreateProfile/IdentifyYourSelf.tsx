/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useRef, useState } from 'react';
import type { FC } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { TextInput } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';

import GradientView from '../../../Common/GradientView';
import TextString from '../../../Common/TextString';
import { COLORS, FONTS, SIZES } from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomTextInput from '../../../Components/CustomTextInput';
import { MainGenders } from '../../../Components/Data';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import useKeyboardVisibility from '../../../Hooks/useKeyboardVisibility';
import { updateField } from '../../../Redux/Action/actions';
import { store } from '../../../Redux/Store/store';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import { useCustomToast } from '../../../Utils/toastUtils';

import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const IdentifyYourSelf: FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useCustomNavigation();
  const dispatch = useDispatch();
  const isKeyboardVisible = useKeyboardVisibility();
  const { showToast } = useCustomToast();

  const userData = useSelector((state: any) => state.user);

  const ScrollViewRef = useRef<ScrollView>(null);
  const dayInputRef = useRef<TextInput>(null);
  const monthInputRef = useRef<TextInput>(null);
  const yearInputRef = useRef<TextInput>(null);

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

  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmitPress = useCallback(async () => {
    try {
      setIsLoading(true);
      Keyboard.dismiss();

      if (
        !FirstName ||
        !BirthDateDD ||
        !BirthDateMM ||
        !BirthDateYYYY ||
        !selectedGender ||
        !CityName
      ) {
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
        dispatch(
          updateField(
            LocalStorageFields.birthdate,
            `${BirthDateDD}/${BirthDateMM}/${BirthDateYYYY}`,
          ),
        ),
        dispatch(updateField(LocalStorageFields.gender, selectedGender)),
        dispatch(updateField(LocalStorageFields.city, CityName)),
      ]);

      navigation.navigate('LoginStack', {
        screen: 'SexualOrientationScreen',
      });
    } catch (error) {
      showToast(TextString.error.toUpperCase(), String(error), 'error');
    } finally {
      setIsLoading(false);
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
          style={styles.ContentView}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.TitleText, { color: colors.TitleText }]}>
            Identify your{'\n'}real self
          </Text>
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
                        gradientProps={{
                          colors: isDark ? colors.ButtonGradient : ['transparent', 'transparent'],
                        }}
                        style={[
                          styles.GenderView,
                          {
                            width: hp('11%'),
                            backgroundColor:
                              !isDark && selectedGender === gender
                                ? COLORS.Background
                                : 'transparent',
                          },
                        ]}
                      >
                        <Pressable
                          onPress={() => handleGenderSelection(gender)}
                          style={{
                            flex: 1,
                            width: '100%',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
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
                          style={{
                            flex: 1,
                            width: '100%',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
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
              isLoading={isLoading}
              Title="Continue"
              Disabled={
                !FirstName ||
                !BirthDateDD ||
                !BirthDateMM ||
                !BirthDateYYYY ||
                !selectedGender ||
                !CityName ||
                isLoading
              }
              Navigation={() => onSubmitPress()}
            />
          </View>
        )}
      </View>
    </GradientView>
  );
};

export default memo(IdentifyYourSelf);

const styles = StyleSheet.create({
  AllInputContainerView: {
    marginTop: hp('2%'),
    width: '100%',
  },
  BirthdayInputView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  BottomButton: {
    alignSelf: 'center',
    bottom: hp('2%'),
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    width: '90%',
  },
  ContentView: {
    paddingBottom: hp('13%'),
    paddingHorizontal: hp('4.2%'),
    paddingTop: hp('0.5%'),
    width: '100%',
  },
  GenderText: {
    color: COLORS.Gray,
    fontFamily: FONTS.Medium,
    fontSize: hp('1.7%'),
  },
  GenderView: {
    alignItems: 'center',
    borderRadius: SIZES.radius,
    borderWidth: 2.5,
    height: hp('6.8%'),
    justifyContent: 'center',
    padding: 0,
    textAlign: 'center',
    width: wp('85%'),
  },
  NameText: {
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: hp('1.8%'),
    marginBottom: hp('1.5%'),
    marginTop: hp('2%'),
  },
  TextInputViewStyle: {
    borderRadius: SIZES.radius,
    borderWidth: 1,
    height: hp('6.8%'),
    justifyContent: 'center',
    padding: 0,
  },
  TextViewForSpace: {
    alignContent: 'center',
    marginBottom: hp('1.5%'),
  },
  TitleText: {
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: hp('3.3%'),
  },
  regularBorder: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
  },
  subTitleText: {
    color: COLORS.Black,
    fontFamily: FONTS.SemiBold,
    fontSize: hp('1.6%'),
    marginTop: hp(1),
  },
  textInputStyle: {
    color: COLORS.Black,
    fontFamily: FONTS.SemiBold,
    fontSize: hp('1.7%'),
    textAlign: 'center',
  },
});
