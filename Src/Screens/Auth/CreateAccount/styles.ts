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
  OopsView: {
    alignSelf: 'center',
    margin: CommonSize(50),
    justifyContent: 'center',
  },
  OopsText: {
    textAlign: 'center',
    color: COLORS.Brown,
    fontSize: CommonSize(30),
    fontFamily: FONTS.Bold,
  },
  DontFoundTextView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  DontFoundText: {
    textAlign: 'center',
    color: COLORS.Silver,
    fontSize: CommonSize(18),
    fontFamily: FONTS.Medium,
  },
  CreateAccountButton: {
    width: '80%',
    height: CommonSize(45),
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: CommonSize(50),
    borderRadius: CommonSize(50),
  },
  NewAccountText: {
    textAlign: 'center',
    color: COLORS.White,
    fontSize: CommonSize(16),
    fontFamily: FONTS.Bold,
  },
});

export default styles;
