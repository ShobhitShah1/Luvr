import React, { memo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';

import GradientView from '../../../Common/GradientView';
import TextString from '../../../Common/TextString';
import { COLORS, FONTS, GROUP_FONT, SIZES } from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomTextInput from '../../../Components/CustomTextInput';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import useKeyboardVisibility from '../../../Hooks/useKeyboardVisibility';
import { updateField } from '../../../Redux/Action/actions';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import { useCustomToast } from '../../../Utils/toastUtils';

import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

function YourEducation() {
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const { showToast } = useCustomToast();

  const KeyboardVisible = useKeyboardVisibility();
  const navigation = useCustomNavigation();
  const userData = useSelector((state: any) => state?.user);

  const [EducationDegree, setEducationDegree] = useState<string>(userData.digree);
  const [CollegeName, setCollegeName] = useState<string>(userData.college_name);
  const [isLoading, setIsLoading] = useState(false);

  const onNextPress = async () => {
    setIsLoading(true);

    try {
      if (EducationDegree && CollegeName) {
        await Promise.all([
          dispatch(updateField(LocalStorageFields.digree, EducationDegree)),
          dispatch(updateField(LocalStorageFields.college_name, CollegeName)),
        ]);
      }

      setTimeout(() => {
        navigation.navigate('LoginStack', {
          screen: 'AddDailyHabits',
        });
      }, 200);
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), TextString.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientView>
      <View style={CreateProfileStyles.Container}>
        <CreateProfileHeader
          Skip={true}
          ProgressCount={5}
          handleSkipPress={() => {
            navigation.navigate('LoginStack', {
              screen: 'AddDailyHabits',
            });
          }}
        />

        <View style={styles.DataViewContainer}>
          <View style={CreateProfileStyles.ContentView}>
            <Text style={[styles.TitleText, { color: colors.TitleText }]}>
              What is your {'\n'}education?
            </Text>
            <Text style={[styles.CompatibilityText, { color: colors.TextColor }]}>
              Add your education details so people know more about you.
            </Text>
          </View>
          <View style={styles.TextInputContainerView}>
            <View style={styles.TextViewForSpace}>
              <Text style={[styles.NameText, { color: colors.TextColor }]}>
                My education degree is
              </Text>

              <GradientBorderView
                gradientProps={{
                  colors: isDark ? colors.ButtonGradient : ['transparent', 'transparent'],
                }}
                style={[
                  styles.TextInputViewStyle,
                  { backgroundColor: isDark ? 'transparent' : colors.White },
                ]}
              >
                <CustomTextInput
                  value={EducationDegree}
                  textContentType="givenName"
                  placeholderTextColor={COLORS.Gray}
                  placeholder="Enter your education degree"
                  style={[styles.TextInputStyle, { color: colors.TextColor }]}
                  onChangeText={value => setEducationDegree(value.trimStart())}
                />
              </GradientBorderView>
            </View>

            <View style={styles.TextViewForSpace}>
              <Text style={[styles.NameText, { color: colors.TextColor }]}>My college name is</Text>

              <GradientBorderView
                gradientProps={{
                  colors: isDark ? colors.ButtonGradient : ['transparent', 'transparent'],
                }}
                style={[
                  styles.TextInputViewStyle,
                  { backgroundColor: isDark ? 'transparent' : colors.White },
                ]}
              >
                <CustomTextInput
                  value={CollegeName}
                  textContentType="givenName"
                  placeholderTextColor={COLORS.Gray}
                  placeholder="Enter your college name"
                  style={[styles.TextInputStyle, { color: colors.TextColor }]}
                  onChangeText={value => setCollegeName(value.trimStart())}
                />
              </GradientBorderView>
            </View>
          </View>
        </View>

        {!KeyboardVisible && (
          <View style={CreateProfileStyles.BottomButton}>
            <GradientButton
              Title="Continue"
              Disabled={false}
              isLoading={isLoading}
              Navigation={() => {
                setIsLoading(true);
                setTimeout(() => onNextPress(), 0);
              }}
            />
          </View>
        )}
      </View>
    </GradientView>
  );
}

export default memo(YourEducation);

const styles = StyleSheet.create({
  AppearInProfileText: {
    ...GROUP_FONT.body4,
  },
  CloseButtonView: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: hp('0.5%'),
    width: '10%',
  },
  CompatibilityText: {
    ...GROUP_FONT.h3,
    fontFamily: FONTS.Medium,
    marginVertical: hp('1%'),
  },
  DataViewContainer: {
    marginHorizontal: hp('1.2%'),
    marginTop: hp('1%'),
  },
  IconView: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  NameText: {
    fontFamily: FONTS.Bold,
    fontSize: hp('1.8%'),
    marginBottom: hp('1.5%'),
    marginTop: hp('2%'),
  },
  SchoolInputStyle: {
    marginVertical: hp('0.5%'),
    width: '90%',
  },
  SchoolInputText: {
    color: COLORS.Black,
    fontFamily: FONTS.Regular,
    fontSize: SIZES.body4,
  },
  TextInputContainerView: {
    justifyContent: 'center',
    marginHorizontal: hp('2.5%'),
    marginVertical: hp('2%'),
  },
  TextInputStyle: {
    fontFamily: FONTS.SemiBold,
    fontSize: hp('1.7%'),
    textAlign: 'center',
  },
  TextInputTextView: {
    alignItems: 'center',
    borderBottomColor: COLORS.Black,
    borderBottomWidth: hp('0.15%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TextInputViewStyle: {
    borderColor: COLORS.Black,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    height: hp('6.8%'),
    justifyContent: 'center',
    padding: 0,
  },
  TextViewForSpace: {
    alignContent: 'center',
    marginVertical: hp('1%'),
  },
  TitleText: {
    fontFamily: FONTS.Bold,
    fontSize: hp('3.3%'),
  },
});
