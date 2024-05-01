import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS, GROUP_FONT, SIZES} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomTextInput from '../../../Components/CustomTextInput';
import useKeyboardVisibility from '../../../Hooks/useKeyboardVisibility';
import {updateField} from '../../../Redux/Action/userActions';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useCustomToast} from '../../../Utils/toastUtils';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const YourEducation: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const KeyboardVisible = useKeyboardVisibility();
  const userData = useSelector((state: any) => state?.user);
  const {showToast} = useCustomToast();
  const dispatch = useDispatch();
  const [EducationDegree, setEducationDegree] = useState<string>(
    userData.digree,
  );
  const [CollegeName, setCollegeName] = useState<string>(userData.college_name);

  const onNextPress = () => {
    if (EducationDegree && CollegeName) {
      Promise.all([
        dispatch(updateField(LocalStorageFields.digree, EducationDegree)),
        dispatch(updateField(LocalStorageFields.college_name, CollegeName)),
      ])
        .then(() => {
          navigation.navigate('LoginStack', {
            screen: 'AddDailyHabits',
          });
        })
        .catch(error => {
          console.error('Error updating fields:', error);
        });
    } else {
      navigation.navigate('LoginStack', {
        screen: 'AddDailyHabits',
      });
    }
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader
        ProgressCount={5}
        Skip={true}
        handleSkipPress={() => {
          navigation.navigate('LoginStack', {
            screen: 'AddDailyHabits',
          });
        }}
      />

      <View style={styles.DataViewContainer}>
        <View style={CreateProfileStyles.ContentView}>
          <Text style={styles.TitleText}>What is your {'\n'}education?</Text>
          <Text style={styles.CompatibilityText}>
            Add your education details so people know more about you.
          </Text>
        </View>
        <View style={styles.TextInputContainerView}>
          {/* Degree */}
          <View style={styles.TextViewForSpace}>
            <Text style={styles.NameText}>My education degree is</Text>
            <CustomTextInput
              value={EducationDegree}
              onChangeText={value => {
                setEducationDegree(value);
              }}
              textContentType="givenName"
              placeholder="Enter your education degree"
              style={styles.TextInputStyle}
              placeholderTextColor={COLORS.Gray}
            />
          </View>

          {/* Name */}
          <View style={styles.TextViewForSpace}>
            <Text style={styles.NameText}>My college name is</Text>
            <CustomTextInput
              value={CollegeName}
              onChangeText={value => {
                setCollegeName(value);
              }}
              textContentType="givenName"
              placeholder="Enter your college name"
              style={styles.TextInputStyle}
              placeholderTextColor={COLORS.Gray}
            />
          </View>
        </View>
      </View>

      {!KeyboardVisible && (
        <View style={CreateProfileStyles.BottomButton}>
          <GradientButton
            isLoading={false}
            Title={'Continue'}
            Disabled={false}
            Navigation={() => onNextPress()}
          />
        </View>
      )}
    </View>
  );
};

export default YourEducation;

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
    // paddingHorizontal: hp('1.5%')
  },
  TextViewForSpace: {
    alignContent: 'center',
    marginVertical: hp('1%'),
  },
  NameText: {
    marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
    fontSize: hp('1.8%'),
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
  },
});
