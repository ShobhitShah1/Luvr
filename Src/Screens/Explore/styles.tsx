import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    zIndex: 9999,
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.Primary,
  },
  ImageStyle: {
    width: '100%',
    height: '100%',
  },
  CardBottomDetailView: {
    bottom: 0,
    zIndex: 9999,
    width: '90%',
    alignSelf: 'center',
    marginVertical: 15,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TitleView: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
  },
  TitleText: {
    ...GROUP_FONT.h2,
    color: COLORS.White,
  },
  VerifyIconImage: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  LocationView: {
    width: '85%',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  LocationIcon: {
    width: hp('2%'),
    height: hp('2%'),
  },
  LocationText: {
    width: '80%',
    marginLeft: hp('0.5%'),
    fontFamily: FONTS.Bold,
    fontSize: hp('1.5%'),
    color: 'rgba(198, 198, 198, 1)',
  },
  MultipleBoxFlexView: {
    flexDirection: 'row',
    width: '85%',
    flexWrap: 'wrap',
  },
  MultipleBoxView: {
    marginTop: hp('1%'),
    borderRadius: hp('2%'),
    borderWidth: hp('0.2%'),
    marginRight: hp('0.5%'),
    paddingHorizontal: hp('0.9%'),
    borderColor: 'rgba(198, 198, 198, 1)',
  },
  MultipleDetailText: {
    fontSize: hp('1.5%'),
    alignSelf: 'flex-end',
    fontFamily: FONTS.Bold,
    justifyContent: 'center',
    paddingVertical: hp('0.8%'),
    color: 'rgba(255, 255, 255, 1)',
  },
  LoadingImageView: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  ViewProfileBTN: {
    justifyContent: 'flex-end',
  },
  ViewProfileIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default styles;
