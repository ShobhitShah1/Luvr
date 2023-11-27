import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';

const CreateProfileStyles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  BottomButton: {
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp('4.5%'),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  ContentView: {
    // marginVertical: hp('1.5%'),
    marginHorizontal: hp('2.8%'),
  },
  TitleText: {
    color: COLORS.Primary,
    fontSize: hp('3%'),
    fontFamily: FONTS.Bold,
  },
  subTitleText: {
    fontSize: hp('1.6%'),
    fontFamily: FONTS.SemiBold,
    color: COLORS.Black,
    marginTop: hp(1),
  },
  nameView: {
    top: hp('1.7%'),
  },
  NameText: {
    fontSize: hp('1.6%'),
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
  },
  BirthdayInputView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CreateProfileStyles;
