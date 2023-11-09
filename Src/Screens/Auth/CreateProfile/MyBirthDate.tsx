import React, {FC, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import CreateProfileHeader from './CreateProfileHeader';
import CreateProfileStyles from './styles';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import CustomTextInput from '../../../Components/CustomTextInput';

const MyBirthDate: FC = () => {
  let ProgressCount: number = 0.2;
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const [birthdate, setBirthdate] = useState<string>('');

  const handleBirthdateChange = (text: string) => {
    text = text.replace(/[^0-9]/g, '');
    const formattedText = formatBirthdate(text);

    if (formattedText.length <= 10) {
      setBirthdate(formattedText);
    }
  };

  const formatBirthdate = (text: string): string => {
    const cleanedText = text.replace(/\D/g, '');
    const match = cleanedText.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);

    if (!match) return '';

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
          Disabled={false}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'SexualOrientationScreen',
            });
          }}
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
