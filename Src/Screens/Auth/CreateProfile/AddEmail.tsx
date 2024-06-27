import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CreateProfileHeader from '../CreateProfile/Components/CreateProfileHeader';
import {COLORS, FONTS, GROUP_FONT, SIZES} from '../../../Common/Theme';
import {CommonSize} from '../../../Common/CommonSize';
import CustomTextInput from '../../../Components/CustomTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {useCustomToast} from '../../../Utils/toastUtils';
import {updateField} from '../../../Redux/Action/userActions';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useNavigation} from '@react-navigation/native';

const AddEmail = () => {
  const dispatch = useDispatch();
  const {showToast} = useCustomToast();
  const userData = useSelector((state: any) => state?.user);

  const [Email, setEmail] = useState<string>(
    userData?.identity ? userData?.identity : '',
  );

  const {navigate} = useNavigation<any>();

  const onNextClick = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(Email)) {
      let LocalEmail = Email;
      await dispatch(updateField(LocalStorageFields.identity, LocalEmail));
      setEmail(Email);

      setTimeout(() => {
        navigate('LoginStack', {
          screen: 'IdentifyYourSelf',
        });
      }, 0);
    } else {
      showToast('Error', 'Please enter valid email', 'error');
    }
  };

  return (
    <View style={styles.Container}>
      <CreateProfileHeader ProgressCount={0} Skip={false} hideBack={true} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
        style={styles.SubContainerView}>
        <View style={styles.NumberContainer}>
          <View style={styles.MyNumberTextView}>
            <Text style={styles.MyNumberText}>What’s your {'\n'}email?</Text>
            <Text style={styles.MyNumberSubText}>
              Please enter your valid email to verify your account.
            </Text>
          </View>
        </View>

        <View style={styles.PhoneNumberView}>
          <View style={styles.TextViewForSpace}>
            <Text style={styles.NameText}>My email is</Text>
            <CustomTextInput
              value={Email}
              onChangeText={value => {
                setEmail(value?.trimStart());
              }}
              textContentType="emailAddress"
              placeholder="Enter your email"
              style={styles.TextInputStyle}
              placeholderTextColor={COLORS.Gray}
            />
          </View>
        </View>

        <View style={{marginVertical: hp('4%')}}>
          <GradientButton
            Title={'CONTINUE'}
            isLoading={false}
            Navigation={onNextClick}
            Disabled={false}
            // Disabled={StorePhoneNumber?.length === 0 ? true : false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddEmail;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
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
    color: COLORS.Primary,
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
  MyNumberSubText: {
    width: '95%',
    marginTop: hp('1%'),
    color: COLORS.Black,
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
    borderBottomColor: COLORS.Black,
  },
  UserNumberTextStyle: {
    padding: 0,
    top: hp(0.8),
    fontSize: hp('2%'),
    color: COLORS.Black,
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
    backgroundColor: COLORS.White,
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
    color: COLORS.Black,
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
    color: COLORS.Black,
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
    color: COLORS.Primary,
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
});
