import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { CommonSize } from '../../../Common/CommonSize';
import { FONTS, SIZES, GROUP_FONT } from '../../../Common/Theme';
import createThemedStyles from '../../../Hooks/createThemedStyles';

const styles = createThemedStyles((colors, isDark) => ({
  Container: {
    flex: 1,
    backgroundColor: colors.Secondary,
  },
  SubContainerView: {
    paddingBottom: hp('1%'),
    marginHorizontal: hp('2.7%'),
  },
  NumberContainer: {
    justifyContent: 'center',
    marginHorizontal: hp('1.5%'),
    marginVertical: hp('1%'),
  },
  MyNumberTextView: {
    justifyContent: 'center',
  },
  MyNumberText: {
    color: colors.TitleText,
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
  MyNumberSubText: {
    width: '95%',
    marginTop: hp('1%'),
    color: colors.TextColor,
    fontSize: hp('1.7%'),
    fontFamily: FONTS.Medium,
  },
  CountryCodeModalView: {
    width: '93%',
    height: hp('35%'),
    alignSelf: 'center',
    marginVertical: hp('4.5%'),
    borderRadius: SIZES.radius,
    zIndex: 9999,
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 1)',
  },
  numberBorderView: {
    width: '93%',
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: hp('1.9%'),
    borderWidth: 1,
    backgroundColor: colors.Background,
  },
  numberView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: hp('1.5%'),
    justifyContent: 'space-between',
  },
  UpIcon: {
    padding: 0,
    width: hp('6%'),
    top: hp('-4.15=%'),
    left: hp('3.4%'),
    height: hp('6%'),
    position: 'absolute',
  },
  CountyListView: {
    height: '75%',
    alignItems: 'center',
    paddingHorizontal: hp('2%'),
  },
  SelectCountryView: {
    height: '25%',
    padding: hp('2%'),
  },
  SearchCountryView: {
    width: '95%',
    height: hp('5%'),
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    borderRadius: SIZES.radius,
    paddingHorizontal: hp('2%'),
    backgroundColor: isDark ? 'rgba(234, 234, 234, 0.1)' : 'rgba(240, 236, 255, 1)',
  },
  SearchCountryText: {
    padding: 0,
    width: '90%',
    ...GROUP_FONT.h4,
    color: colors.Black,
  },
  SearchIcon: {
    justifyContent: 'center',
    width: '10%',
  },
  ListEmptyView: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  ListEmptyText: {
    ...GROUP_FONT.h3,
    color: colors.Black,
    textAlign: 'center',
  },
  SearchIconStyle: {
    width: 18,
    height: 18,
    marginRight: 8,
    justifyContent: 'center',
    alignSelf: 'center',
  },
}));

export default styles;
