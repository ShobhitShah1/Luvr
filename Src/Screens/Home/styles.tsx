import { Dimensions, StyleSheet } from 'react-native';
import { BOTTOM_TAB_HEIGHT, COLORS, FONTS, GROUP_FONT } from '../../Common/Theme';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('screen');

const smallWidth = width / 2.7;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
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
  },
  TitleText: {
    width: '100%',
    bottom: hp('2%'),
    ...GROUP_FONT.h2,
    color: COLORS.White,
    marginHorizontal: hp('2%'),
  },
  item1Inner: {
    flex: 1,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  LeftMargin: {
    marginLeft: '3%',
  },
  item2: {
    width: '98%',
    height: smallWidth,
    marginVertical: 5,
    overflow: 'hidden',
    borderRadius: hp('3%'),
  },
  fill: {
    height: '100%',
    width: '100%',
  },
  VerticalImageViewText: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    ...GROUP_FONT.h2,
    color: COLORS.White,
  },
  columWrapper: {
    justifyContent: 'space-between',
  },
  noDataFoundView: {
    width: Dimensions.get('screen').width - 40,
    height: 135,
    justifyContent: 'center',
    alignItems: 'center',
    top: 10,
  },
  noDataFoundText: {
    color: COLORS.Primary,
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
    fontSize: 18,
  },
});

export default styles;
