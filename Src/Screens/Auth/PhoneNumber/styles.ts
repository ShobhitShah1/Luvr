import {StyleSheet} from 'react-native';
import {CommonSize} from '../../../Common/CommonSize';
import {COLORS, FONTS} from '../../../Common/Theme';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  SubContainerView: {
    margin: CommonSize(20),
  },
  NumberContainer: {
    justifyContent: 'center',

    marginHorizontal: CommonSize(10),
    marginVertical: CommonSize(20),
  },
  MyNumberTextView: {
    justifyContent: 'center',
  },
  MyNumberText: {
    color: COLORS.Black,
    fontSize: CommonSize(30),
    fontFamily: FONTS.Bold,
  },
  PhoneNumberView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: CommonSize(10),
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
    fontSize: CommonSize(15),
  },
});

export default styles;
