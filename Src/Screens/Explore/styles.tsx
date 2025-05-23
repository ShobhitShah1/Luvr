import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { COLORS, FONTS, GROUP_FONT } from '../../Common/Theme';

const styles = StyleSheet.create({
  CardBottomDetailView: {
    alignSelf: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    position: 'absolute',
    width: '90%',
    zIndex: 9999,
  },
  ImageStyle: {
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  LoadingImageView: {
    alignSelf: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  LocationIcon: {
    height: hp('2%'),
    width: hp('2%'),
  },
  LocationText: {
    color: 'rgba(198, 198, 198, 1)',
    fontFamily: FONTS.Bold,
    fontSize: hp('1.5%'),
    marginLeft: hp('0.5%'),
    width: '80%',
  },
  LocationView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 4,
    overflow: 'hidden',
    width: '85%',
  },
  MultipleBoxFlexView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '85%',
  },
  MultipleBoxView: {
    borderRadius: hp('2%'),
    marginRight: hp('0.5%'),
    marginTop: hp('1%'),
    overflow: 'hidden',
    paddingHorizontal: hp('0.9%'),
  },
  MultipleDetailText: {
    alignSelf: 'flex-end',
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: FONTS.Bold,
    fontSize: hp('1.5%'),
    justifyContent: 'center',
    paddingVertical: hp('0.8%'),
  },
  TitleText: {
    ...GROUP_FONT.h2,
    color: COLORS.White,
  },
  TitleView: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 3,
    width: '90%',
  },
  VerifyIconImage: {
    alignSelf: 'center',
    height: 20,
    justifyContent: 'center',
    marginHorizontal: 5,
    width: 20,
  },
  ViewProfileBTN: {
    justifyContent: 'flex-end',
  },
  ViewProfileIcon: {
    alignSelf: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  card: {
    flex: 1,
    zIndex: 9999,
    // borderWidth: 1,
    // padding: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
});

export default styles;
