import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../Common/Theme';
import {CommonSize} from '../../../Common/CommonSize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  SubContainer: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    // marginTop: CommonSize(33),
    marginTop: hp('4.5%'),
  },
  TinderLogoView: {
    height: '30%',
    alignSelf: 'center',
  },
  TinderLogo: {
    height: hp('4.9%'),
    // height: CommonSize(35),
  },
  LoginBottomView: {
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: CommonSize(35),
    justifyContent: 'flex-end',
  },
  PolicyTextView: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  PolicyText: {
    textAlign: 'center',
    color: COLORS.White,
    fontSize: hp('1.9%'),
    // fontSize: CommonSize(13.3),
    fontFamily: FONTS.Medium,
    lineHeight: hp('2.8%'),
    // lineHeight: CommonSize(16),
  },
  PolicyLinkText: {
    textDecorationLine: 'underline',
  },
  TroubleView: {
    alignSelf: 'center',
    top: CommonSize(20),
    marginBottom: CommonSize(13),
    justifyContent: 'center',
  },
  TroubleText: {
    textAlign: 'center',
    color: COLORS.White,
    fontSize: hp('2%'),
    // fontSize: CommonSize(15),
    fontFamily: FONTS.Bold,
  },
});

export default styles;
