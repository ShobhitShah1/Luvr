import {StyleSheet} from 'react-native';
import {COLORS, GROUP_FONT} from '../../Common/Theme';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  FlatListStyle: {
    width: '90%',
    alignSelf: 'center',
  },

  container: {
    width: '47%',
    height: hp('23%'),
    overflow: 'hidden',
    marginVertical: '1%',
    borderRadius: hp('3%'),
  },
  imageView: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flex: 0.5,
    justifyContent: 'flex-end',
    // borderRadius: hp('5%'),
  },
  TitleText: {
    width: '100%',
    ...GROUP_FONT.h2,
    color: COLORS.White,
    marginHorizontal: hp('2%'),
    bottom: hp('2%'),
  },
});

export default styles;
