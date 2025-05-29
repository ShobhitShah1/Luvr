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
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    top: 10,
  },
  noDataFoundText: {
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
    fontSize: 18,
  },

  cardContainer: {
    width: '100%',
    height: '100%',
    // overflow: 'hidden',
    // position: 'relative',
    backgroundColor: 'rgba(157, 133, 240, 0.2)',
    borderRadius: 8,
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  shimmer: {
    width: '50%',
    height: '100%',
    opacity: 0.7,
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    padding: 10,
    zIndex: 2,
  },
  nameText: {
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
    width: '80%',
    alignSelf: 'center',
  },
  jobText: {
    height: 16,
    borderRadius: 4,
    width: '60%',
    alignSelf: 'center',
  },
});

export default styles;
