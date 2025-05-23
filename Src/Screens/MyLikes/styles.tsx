import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { COLORS, FONTS } from '../../Common/Theme';

const NO_IMAGE_CONTAINER = 150;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  LoadingView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  ContentView: {
    flex: 1,
    height: '100%',
  },
  TabBarButtonView: {
    borderRadius: 25,
    borderWidth: 2,
    height: 52,
    justifyContent: 'center',
    overflow: 'visible',
    zIndex: 99999999,
  },
  TabBarButtonText: {
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },

  //* Tab
  TopTabContainerView: {
    alignSelf: 'center',
    marginBottom: 5,
    marginTop: 14,
    width: '90%',
  },
  FlatListContentContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'visible',
    zIndex: 9999,
  },
  FlatListColumnWrapperStyle: {
    justifyContent: 'space-between',
  },
  ContentContainer: {
    flex: 1,
    paddingTop: 5,
  },

  //* No Like View
  ListEmptyComponentView: {
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: hp(18),
    width: '80%',
  },
  NoLikeImageView: {
    alignSelf: 'center',
    backgroundColor: COLORS.White,
    borderRadius: 500,
    height: NO_IMAGE_CONTAINER,
    justifyContent: 'center',
    width: NO_IMAGE_CONTAINER,
  },
  NoLikeImage: {
    alignSelf: 'center',
    height: NO_IMAGE_CONTAINER - 70,
    justifyContent: 'center',
    width: NO_IMAGE_CONTAINER - 70,
  },
  EmptyTextView: {
    marginVertical: 20,
  },
  NoLikeTitle: {
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: 25,
    marginVertical: 10,
    textAlign: 'center',
  },
  NoLikeDescription: {
    color: COLORS.Black,
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    textAlign: 'center',
  },
  RefreshButtonContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  RefreshButtonIcon: {
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  RefreshButtonText: {
    alignSelf: 'center',
    color: COLORS.Primary,
    fontFamily: FONTS.SemiBold,
    justifyContent: 'center',
  },
  bottomShadow: {
    bottom: 0,
    height: 140,
    pointerEvents: 'none',
    position: 'absolute',
    width: '100%',
  },
});

export default styles;
