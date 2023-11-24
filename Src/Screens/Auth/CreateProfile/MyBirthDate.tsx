import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomTextInput from '../../../Components/CustomTextInput';
import {useUserData} from '../../../Contexts/UserDataContext';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useFieldConfig} from '../../../Utils/StorageUtils';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const MyBirthDate: FC = () => {
  let ProgressCount: number = 0.2;
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  //* Get Local Storage State
  const {userData, dispatch} = useUserData();
  const StoreStringName = useFieldConfig(LocalStorageFields.dob);

  //* All State
  const [birthdate, setBirthdate] = useState<string>(userData.dob);

  //* On Submit Change Format And Store Data
  const handleBirthdateChange = (text: string) => {
    text = text.replace(/[^0-9]/g, '');
    const formattedText = formatBirthdate(text);

    if (formattedText.length <= 10) {
      setBirthdate(formattedText);
    }
  };

  //* Format Date Data Change In DD/MM/YYYY
  const formatBirthdate = (text: string): string => {
    const cleanedText = text.replace(/\D/g, '');
    const match = cleanedText.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);

    if (!match) {
      return '';
    }

    let formattedText = '';

    if (match[1]) {
      formattedText += match[1];
      if (match[2]) {
        formattedText += '/' + match[2];
        if (match[3]) {
          formattedText += '/' + match[3];
        }
      }
    }

    return formattedText;
  };

  //* Store Data In Local Storage
  const handleInputChange = (field: string, value: string) => {
    dispatch({type: 'UPDATE_FIELD', field, value});
  };

  //* Store Data And Navigate To Screen
  const OnSubmitBirthDatePress = () => {
    handleInputChange(StoreStringName, birthdate);
    navigation.navigate('LoginStack', {
      screen: 'MyGender',
    });
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={ProgressCount} Skip={false} />

      <View style={CreateProfileStyles.ContentView}>
        <Text style={CreateProfileStyles.TitleText}>Your b-day?</Text>
        <CustomTextInput
          placeholder="DD/MM/YYYY"
          value={birthdate}
          keyboardType="number-pad"
          placeholderTextColor={'black'}
          style={styles.TextInputStyle}
          onChangeText={text => handleBirthdateChange(text)}
          maxLength={10}
        />
        <Text style={styles.InfoText}>
          your profile shows your age, not your date of birth
        </Text>
      </View>

      <View style={CreateProfileStyles.BottomButton}>
        <GradientButton
          Title={'Next'}
          Disabled={birthdate.length < 10 ? true : false}
          Navigation={OnSubmitBirthDatePress}
        />
      </View>
    </View>
  );
};

export default MyBirthDate;

const styles = StyleSheet.create({
  InfoText: {
    fontFamily: FONTS.Medium,
    color: COLORS.Black,
    fontSize: hp('1.6%'),
  },
  TextInputStyle: {
    padding: 0,
    ...GROUP_FONT.h2,
    fontFamily: FONTS.Regular,
    marginVertical: hp('2.4%'),
    left: hp('-1%'),
    letterSpacing: hp('1.8%'),
  },
});
