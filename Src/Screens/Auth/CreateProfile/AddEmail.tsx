import { useNavigation } from '@react-navigation/native';
import React, { memo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { CommonSize } from '../../../Common/CommonSize';
import GradientView from '../../../Common/GradientView';
import TextString from '../../../Common/TextString';
import { FONTS, GROUP_FONT, SIZES } from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomTextInput from '../../../Components/CustomTextInput';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';
import createThemedStyles from '../../../Hooks/createThemedStyles';
import { useThemedStyles } from '../../../Hooks/useThemedStyles';
import { updateField } from '../../../Redux/Action/actions';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import { useCustomToast } from '../../../Utils/toastUtils';
import CreateProfileHeader from '../CreateProfile/Components/CreateProfileHeader';

const AddEmail = () => {
  const dispatch = useDispatch();

  const { colors, isDark } = useTheme();
  const style = useThemedStyles(styles);

  const { showToast } = useCustomToast();
  const userData = useSelector((state: any) => state?.user);

  const [Email, setEmail] = useState<string>(userData?.identity ? userData?.identity : '');

  const { navigate } = useNavigation<any>();

  const onNextClick = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailRegex.test(Email)) {
        let LocalEmail = Email;
        dispatch(updateField(LocalStorageFields.identity, LocalEmail));
        setEmail(Email);

        navigate('LoginStack', {
          screen: 'IdentifyYourSelf',
        });
      } else {
        throw new Error('Please enter valid email');
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
    }
  };

  return (
    <GradientView>
      <View style={style.Container}>
        <CreateProfileHeader ProgressCount={0} Skip={false} hideBack={true} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
          style={style.SubContainerView}
        >
          <View style={style.NumberContainer}>
            <View style={style.MyNumberTextView}>
              <Text style={style.MyNumberText}>What’s your {'\n'}email?</Text>
              <Text style={style.MyNumberSubText}>Please enter your valid email to verify your account.</Text>
            </View>
          </View>

          <View style={style.PhoneNumberView}>
            <View style={style.TextViewForSpace}>
              <Text style={style.NameText}>My email is</Text>
              <GradientBorderView
                style={[style.TextInputViewStyle, { backgroundColor: isDark ? 'transparent' : colors.White }]}
                gradientProps={{ colors: isDark ? colors.Gradient : ['transparent', 'transparent'] }}
              >
                <CustomTextInput
                  value={Email}
                  onChangeText={(value) => {
                    setEmail(value?.trimStart());
                  }}
                  textContentType="emailAddress"
                  placeholder="Enter your email"
                  style={style.textInputStyle}
                  placeholderTextColor={colors.Gray}
                />
              </GradientBorderView>
            </View>
          </View>

          <View style={{ marginVertical: hp('4%') }}>
            <GradientButton Title={'CONTINUE'} isLoading={false} Disabled={false} Navigation={onNextClick} />
          </View>
        </ScrollView>
      </View>
    </GradientView>
  );
};

export default memo(AddEmail);

const styles = createThemedStyles((colors) => ({
  Container: {
    flex: 1,
  },
  SubContainerView: {
    paddingBottom: hp('1%'),
    marginHorizontal: hp('2.7%'),
  },
  NumberContainer: {
    justifyContent: 'center',
    marginHorizontal: hp('1.5%'),
    marginVertical: hp('1%'),
  },
  MyNumberTextView: {
    justifyContent: 'center',
  },
  MyNumberText: {
    color: colors.TitleText,
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
  MyNumberSubText: {
    width: '95%',
    marginTop: hp('1%'),
    color: colors.TextColor,
    fontSize: hp('1.7%'),
    fontFamily: FONTS.Medium,
  },
  PhoneNumberView: {
    paddingHorizontal: hp('1.5%'),
  },
  UserCountyAndCodeView: {
    width: '30%',
    justifyContent: 'center',
    alignSelf: 'center',
    height: CommonSize(35),
  },
  UserNumberTextView: {
    width: '65%',
    alignSelf: 'center',
    top: CommonSize(-3.5),
    height: CommonSize(45),
    justifyContent: 'center',
    borderBottomWidth: CommonSize(2),
    borderBottomColor: colors.Black,
  },
  UserNumberTextStyle: {
    padding: 0,
    top: hp(0.8),
    fontSize: hp('2%'),
    color: colors.Black,
    alignContent: 'center',
    fontFamily: FONTS.SemiBold,
  },
  NumberChangesAlertText: {
    color: 'rgba(68, 65, 66, 1)',
    fontFamily: FONTS.Regular,
  },
  CountryCodeModalView: {
    width: '93%',
    height: hp('35%'),
    alignSelf: 'center',
    marginVertical: hp('4%'),
    borderRadius: SIZES.radius,
    backgroundColor: colors.White,
  },
  UpIcon: {
    padding: 0,
    width: hp('6%'),
    top: hp('-3.7%'),
    left: hp('3.4%'),
    height: hp('6%'),
    position: 'absolute',
  },
  CountyListView: {
    height: '75%',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: hp('2%'),
  },
  SelectCountryView: {
    height: '25%',
    padding: hp('2%'),
  },
  SearchCountryView: {
    width: '95%',
    height: hp('5%'),
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    borderRadius: SIZES.radius,
    paddingHorizontal: hp('2%'),
    backgroundColor: 'rgba(234, 234, 234, 1)',
  },
  SearchCountryText: {
    padding: 0,
    width: '90%',
    ...GROUP_FONT.h4,
    color: colors.Black,
  },
  SearchIcon: {
    justifyContent: 'center',
    width: '10%',
  },
  ListEmptyView: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  ListEmptyText: {
    ...GROUP_FONT.h3,
    color: colors.Black,
    textAlign: 'center',
  },
  SearchIconStyle: {
    width: 18,
    height: 18,
    marginRight: 8,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  TextViewForSpace: {
    alignContent: 'center',
    marginBottom: hp('1.5%'),
  },
  NameText: {
    marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
    fontSize: hp('1.8%'),
    color: colors.TextColor,
    fontFamily: FONTS.Bold,
  },
  TextInputViewStyle: {
    padding: 0,
    borderWidth: 1,
    height: hp('6.8%'),
    justifyContent: 'center',
    borderRadius: SIZES.radius,
  },
  textInputStyle: {
    fontFamily: FONTS.SemiBold,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: colors.Black,
    fontSize: hp('1.7%'),
  },
}));
