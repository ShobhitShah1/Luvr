import {StyleSheet} from 'react-native';
 import { COLORS, FONTS } from '../../../Common/Theme';
import { CommonSize } from '../../../Common/CommonSize';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
  },
  ContantView: {
    width: '90%',
    top: CommonSize(20),
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  TinderLogoView: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: '30%',
  },
  TinderLogo: {
    height: CommonSize(40),
  },
  LogiBottomView:{
    justifyContent:'flex-end',
    top: CommonSize(55)
  },
  PolicyTextView:{
    alignSelf:'center',
    justifyContent:'center',
  },
  PolicyText:{
    textAlign:'center',
    color: COLORS.White,
    fontSize: CommonSize(13.3),
    fontFamily: FONTS.Regular,
  },
  PolicyLinkText:{
    textDecorationLine: 'underline'
  },
  TroubleView:{
    alignSelf:'center',
    justifyContent:'center',
    top: CommonSize(20)
  },
  TroubleText:{
    textAlign:'center',
    color: COLORS.White,
    fontSize: CommonSize(13.5),
    fontFamily: FONTS.SemiBold,
  }
});

export default styles;
