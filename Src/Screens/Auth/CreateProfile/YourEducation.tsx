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

const YourEducation = () => {
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
            <Text style={[styles.TitleText, { color: colors.TitleText }]}>What is your {'\n'}education?</Text>
            <Text style={[styles.CompatibilityText, { color: colors.TextColor }]}>
              Add your education details so people know more about you.
            </Text>
          </View>
          <View style={styles.TextInputContainerView}>
            <View style={styles.TextViewForSpace}>
              <Text style={[styles.NameText, { color: colors.TextColor }]}>My education degree is</Text>

              <GradientBorderView
                gradientProps={{ colors: isDark ? colors.ButtonGradient : ['transparent', 'transparent'] }}
                style={[styles.TextInputViewStyle, { backgroundColor: isDark ? 'transparent' : colors.White }]}
              >
                <CustomTextInput
                  value={EducationDegree}
                  textContentType="givenName"
                  placeholderTextColor={COLORS.Gray}
                  placeholder="Enter your education degree"
                  style={[styles.TextInputStyle, { color: colors.TextColor }]}
                  onChangeText={(value) => setEducationDegree(value.trimStart())}
                />
              </GradientBorderView>
            </View>

            <View style={styles.TextViewForSpace}>
              <Text style={[styles.NameText, { color: colors.TextColor }]}>My college name is</Text>

              <GradientBorderView
                gradientProps={{ colors: isDark ? colors.ButtonGradient : ['transparent', 'transparent'] }}
                style={[styles.TextInputViewStyle, { backgroundColor: isDark ? 'transparent' : colors.White }]}
              >
                <CustomTextInput
                  value={CollegeName}
                  textContentType="givenName"
                  placeholderTextColor={COLORS.Gray}
                  placeholder="Enter your college name"
                  style={[styles.TextInputStyle, { color: colors.TextColor }]}
                  onChangeText={(value) => setCollegeName(value.trimStart())}
                />
              </GradientBorderView>
            </View>
          </View>
        </View>

        {!KeyboardVisible && (
          <View style={CreateProfileStyles.BottomButton}>
            <GradientButton
              Title={'Continue'}
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
};

export default memo(YourEducation);

const styles = StyleSheet.create({
  DataViewContainer: {
    marginHorizontal: hp('1.2%'),
    marginTop: hp('1%'),
  },
  TextInputContainerView: {
    justifyContent: 'center',
    marginVertical: hp('2%'),
    marginHorizontal: hp('2.5%'),
  },
  SchoolInputStyle: {
    width: '90%',
    marginVertical: hp('0.5%'),
  },
  SchoolInputText: {
    color: COLORS.Black,
    fontSize: SIZES.body4,
    fontFamily: FONTS.Regular,
  },
  CloseButtonView: {
    width: '10%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: hp('0.5%'),
  },
  IconView: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  AppearInProfileText: {
    ...GROUP_FONT.body4,
  },
  TextInputTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: hp('0.15%'),
    borderBottomColor: COLORS.Black,
  },
  CompatibilityText: {
    ...GROUP_FONT.h3,
    marginVertical: hp('1%'),
    fontFamily: FONTS.Medium,
  },
  TitleText: {
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
  TextInputViewStyle: {
    padding: 0,
    borderColor: COLORS.Black,
    height: hp('6.8%'),
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: SIZES.radius,
  },
  TextInputStyle: {
    fontSize: hp('1.7%'),
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },
  TextViewForSpace: {
    alignContent: 'center',
    marginVertical: hp('1%'),
  },
  NameText: {
    marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
    fontSize: hp('1.8%'),
    fontFamily: FONTS.Bold,
  },
});
