import { Dimensions, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { BOTTOM_TAB_HEIGHT, COLORS, FONTS, GROUP_FONT } from '../../Common/Theme';

const { width } = Dimensions.get('screen');

const smallWidth = width / 2.7;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  LeftMargin: {
    marginLeft: '3%',
  },
  TitleText: {
    bottom: hp('2%'),
    width: '100%',
    ...GROUP_FONT.h2,
    color: COLORS.White,
    marginHorizontal: hp('2%'),
  },
  VerticalImageViewText: {
    bottom: 15,
    left: 15,
    position: 'absolute',
    ...GROUP_FONT.h2,
    color: COLORS.White,
  },
  cardContainer: {
    width: '100%',
    height: '100%',
    // overflow: 'hidden',
    // position: 'relative',
    backgroundColor: 'rgba(157, 133, 240, 0.2)',
    borderRadius: 8,
  },
  columWrapper: {
    justifyContent: 'space-between',
  },
  container: {
    borderRadius: hp('3%'),
    height: hp('23%'),
    marginVertical: '1%',
    overflow: 'hidden',
    width: '47%',
  },
  fill: {
    height: '100%',
    width: '100%',
  },
  gradient: {
    flex: 0.5,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    alignSelf: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  imageView: {
    height: '100%',
    justifyContent: 'flex-end',
    width: '100%',
  },
  item1Inner: {
    flex: 1,
  },
  item2: {
    borderRadius: hp('3%'),
    height: smallWidth,
    marginVertical: 5,
    overflow: 'hidden',
    width: '98%',
  },
  jobText: {
    alignSelf: 'center',
    borderRadius: 4,
    height: 16,
    width: '60%',
  },
  nameText: {
    alignSelf: 'center',
    borderRadius: 4,
    height: 20,
    marginBottom: 8,
    width: '80%',
  },

  noDataFoundText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 18,
    textAlign: 'center',
  },
  noDataFoundView: {
    alignItems: 'center',
    height: 190,
    justifyContent: 'center',
    top: 10,
    width: Dimensions.get('screen').width - 40,
  },
  overlay: {
    bottom: 10,
    left: 0,
    padding: 10,
    position: 'absolute',
    right: 0,
    zIndex: 2,
  },
  row: {
    flexDirection: 'row',
    overflow: 'hidden',
    width: '100%',
  },
  shimmer: {
    height: '100%',
    opacity: 0.7,
    position: 'absolute',
    width: '50%',
  },
  shimmerContainer: {
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export default styles;
