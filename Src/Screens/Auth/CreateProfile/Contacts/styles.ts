import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, GROUP_FONT} from '../../../../Common/Theme';

const styles = StyleSheet.create({
  Container: {
    flexGrow: 1,
  },
  ContactView: {
    top: hp('2%'),
    width: '100%',
    borderRadius: 20,
    marginVertical: 5,
    paddingHorizontal: hp('1.9%'),
    paddingVertical: hp('1.6%'),
    backgroundColor: COLORS.White,
    flexDirection: 'row',
  },
  NumberAndNameContainerView: {
    width: '80%',
  },
  CheckBoxView: {
    width: '20%',
    justifyContent: 'center',
  },
  CheckBox: {
    width: 25,
    height: 25,
    // borderWidth: 3,
    borderRadius: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.Primary,
    borderColor: 'rgba(130, 130, 130, 1)',
  },
  CheckImage: {
    width: 13,
    height: 13,
    alignSelf: 'center',
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
  },
  SectionHeaderText: {
    ...GROUP_FONT.h3,
    color: 'rgba(130, 130, 130, 1)',
    fontSize: hp('2.1%'),
  },
  ListEmptyView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ListEmptyText: {
    ...GROUP_FONT.h2,
    color: COLORS.Black,
    fontSize: 14,
  },
});

export default styles;
