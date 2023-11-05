import {StyleSheet} from 'react-native';
import {CommonSize} from '../../../Common/CommonSize';
import {COLORS, FONTS} from '../../../Common/Theme';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  SubContainerView: {
    marginHorizontal: CommonSize(20),
    marginVertical: CommonSize(10),
  },
  NumberContainer: {
    justifyContent: 'center',

    marginHorizontal: CommonSize(10),
    marginVertical: CommonSize(10),
  },
  MyNumberTextView: {
    justifyContent: 'center',
  },
  MyNumberText: {
    color: COLORS.Black,
    fontSize: CommonSize(20),
    fontFamily: FONTS.Bold,
  },
  PhoneNumberView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: CommonSize(10),
    marginTop: CommonSize(15),
  },
  UserCountyAndCodeView: {
    width: '30%',
    justifyContent: 'center',
    alignSelf: 'center',
    height: CommonSize(35),
    borderBottomWidth: CommonSize(2),
    borderBottomColor: COLORS.Black,
  },
  UserNumberTextView: {
    width: '65%',
    justifyContent: 'center',
    alignSelf: 'center',
    top: CommonSize(-3.5),
    height: CommonSize(45),
    borderBottomWidth: CommonSize(2),
    borderBottomColor: COLORS.Black,
  },
  UserNumberTextStyle: {
    top: 5,
    alignContent: 'center',
    color: COLORS.Black,
    fontFamily: FONTS.SemiBold,
    fontSize: CommonSize(16),
  },
  NumberHelpText: {
    color: COLORS.Gray,
    textAlign: 'left',
    fontFamily: FONTS.Medium,
    lineHeight: CommonSize(16),
  },
  LearnWhatText: {
    color: COLORS.Blue,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: COLORS.Black,
    fontFamily: FONTS.Bold,
  },
  NumberChangesAlertText: {
    color: 'rgba(68, 65, 66, 1)',
    fontFamily: FONTS.Regular,
  },
});

export default styles;
