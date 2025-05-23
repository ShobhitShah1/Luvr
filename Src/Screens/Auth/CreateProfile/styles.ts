import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { COLORS, FONTS } from '../../../Common/Theme';

const CreateProfileStyles = StyleSheet.create({
  BirthdayInputView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  BottomButton: {
    alignSelf: 'center',
    bottom: hp('4.5%'),
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    width: '90%',
  },
  Container: {
    flex: 1,
  },
  ContentView: {
    paddingHorizontal: hp('2.8%'),
  },
  NameText: {
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: hp('1.6%'),
  },
  TitleText: {
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: hp('3%'),
  },
  nameView: {
    top: hp('1.7%'),
  },
  subTitleText: {
    color: COLORS.Black,
    fontFamily: FONTS.SemiBold,
    fontSize: hp('1.6%'),
    marginTop: hp(1),
  },
});

export default CreateProfileStyles;
