import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, GROUP_FONT} from '../../../../Common/Theme';

const styles = StyleSheet.create({
  // Contact Screen
  Container: {
    backgroundColor: COLORS.White
  },
  ContactView: {
    top: hp('2%'),
    borderColor: COLORS.Gray,
    borderTopWidth: 0.3,
    marginHorizontal: hp('1.9%'),
    paddingVertical: hp('1.9%'),
    borderBottomWidth: 0.3,
  },
  ContactDisplayName: {
    ...GROUP_FONT.h4,
    fontSize: hp('1.5%'),
  },
  ContactDisplayNumber: {
    ...GROUP_FONT.h4,
    fontSize: hp('1.2%'),
    color: COLORS.Gray,
  },
  SectionHeaderView: {
    marginHorizontal: hp('1.9%'),
    paddingTop: hp('4%'),
    //   backgroundColor:'red'
  },
  SectionHeaderText: {
    ...GROUP_FONT.h3,
    fontSize: hp('2.1%'),
  },
});

export default styles;
