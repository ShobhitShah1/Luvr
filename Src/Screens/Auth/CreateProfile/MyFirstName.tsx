import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {CommonSize} from '../../../Common/CommonSize';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CreateProfileHeader from './CreateProfileHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const MyFirstName: FC = () => {
  let ProgressCount: number = 0.1;
  const [FirstName, setFirstName] = useState<string>('');
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  return (
    <View style={styles.Container}>
      <CreateProfileHeader ProgressCount={ProgressCount} />

      <View style={styles.ContentView}>
        <Text style={styles.TitleText}>What's your first name</Text>
        <TextInput
          autoFocus
          value={FirstName}
          onChangeText={value => {
            setFirstName(value);
          }}
          textContentType='givenName'
          placeholder="Enter first name"
          style={styles.TextInputStyle}
          placeholderTextColor={COLORS.Placeholder}
        />
        <Text style={styles.InfoText}>
          This is how it'll appear on your profile.
        </Text>
        <Text style={styles.CantChangeText}>Can't change it later.</Text>
      </View>

      <View style={styles.BottomButton}>
        <GradientButton
          Title={'Next'}
          Disabled={FirstName.length === 0 ? true : false}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'MyBirthDate',
            });
          }}
        />
      </View>
    </View>
  );
};

export default MyFirstName;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  BottomButton: {
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp('1.5%'),
    justifyContent: 'center',
  },
  ContentView: {
    marginVertical: hp('1.5%'),
    marginHorizontal: hp('1.9%'),
  },
  TitleText: {
    ...GROUP_FONT.h2,
  },
  TextInputStyle: {
    paddingVertical: hp('0.1%'),
    color: COLORS.Black,
    fontSize: hp('1.7%'),
    borderBottomWidth: 1,
    borderColor: COLORS.Black,
    marginVertical: hp('1.5%'),
  },
  InfoText: {
    fontFamily: FONTS.Medium,
    color: COLORS.Black,
    fontSize: hp('1.6%'),
  },
  CantChangeText: {
    ...GROUP_FONT.h4,
    fontSize: hp('1.6%'),
  },
});
