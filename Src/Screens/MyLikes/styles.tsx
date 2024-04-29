import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../Common/Theme';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

let NO_IMAGE_CONTAINER = 150;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  LoadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ContentView: {
    flex: 1,
    height: '100%',
  },
  TabBarButtonView: {
    width: '46%',
    height: 52,
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 25,
  },
  TabBarButtonText: {
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
  },

  //* Tab
  TopTabContainerView: {
    marginTop: 14,
    marginBottom: 5,
    width: '90%',
    alignSelf: 'center',
  },
  FlatListContentContainerStyle: {
    // alignSelf: 'center',
    justifyContent: 'center',
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
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: hp(18),
  },
  NoLikeImageView: {
    borderRadius: 500,
    alignSelf: 'center',
    justifyContent: 'center',
    width: NO_IMAGE_CONTAINER,
    height: NO_IMAGE_CONTAINER,
    backgroundColor: COLORS.White,
  },
  NoLikeImage: {
    width: NO_IMAGE_CONTAINER - 70,
    height: NO_IMAGE_CONTAINER - 70,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  EmptyTextView: {
    marginVertical: 20,
  },
  NoLikeTitle: {
    fontSize: 25,
    marginVertical: 10,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    color: COLORS.Primary,
  },
  NoLikeDescription: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
    color: COLORS.Black,
  },
  RefreshButtonContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  RefreshButtonIcon: {
    width: 18,
    height: 18,
    justifyContent: 'center',
  },
  RefreshButtonText: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontFamily: FONTS.SemiBold,
    color: COLORS.Primary,
  },
});

export default styles;
