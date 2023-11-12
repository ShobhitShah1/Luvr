import {StyleSheet} from 'react-native';
import {CommonSize} from '../../../Common/CommonSize';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CreateProfileStyles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.White
  },
  BottomButton: {
    backgroundColor: COLORS.White,
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp('1.5%'),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  ContentView: {
    marginVertical: hp('1.5%'),
    marginHorizontal: hp('1.9%'),
  },
  TitleText: {
    ...GROUP_FONT.h1,
  },
});

export default CreateProfileStyles;
