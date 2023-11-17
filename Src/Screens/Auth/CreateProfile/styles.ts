import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, GROUP_FONT} from '../../../Common/Theme';

const CreateProfileStyles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.White,
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
