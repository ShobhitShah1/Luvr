import React, { memo, useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';

import CommonIcons from '../../../Common/CommonIcons';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import { useSubscriptionModal } from '../../../Contexts/SubscriptionModalContext';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useUserData } from '../../../Contexts/UserDataContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import type { ListDetailProps } from '../../../Types/Interface';
import { useCustomToast } from '../../../Utils/toastUtils';

const NO_IMAGE_CONTAINER = 150;

function MatchesContent({ MatchData }: { MatchData: ListDetailProps }) {
  const { colors, isDark } = useTheme();
  const navigation = useCustomNavigation();
  const { subscription } = useUserData();
  const userData = useSelector((state: any) => state?.user?.userData || {});
  const { showSubscriptionModal } = useSubscriptionModal();

  const matchData = MatchData?.user_details?.[0];

  if (MatchData?.status !== 'match' || !matchData || userData._id === matchData._id) {
    return null;
  }

  const handleChatClick = () => {
    if (!subscription.isActive) {
      showSubscriptionModal();

      return;
    }

    navigation.navigate('Chat', { id: matchData?._id?.toString() || '' });
  };

  const detailBoxStyle = [
    styles.DetailBoxContainerView,
    {
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : colors.White,
    },
  ];

  const userImageSource = {
    uri: ApiConfig.IMAGE_BASE_URL + userData.recent_pik[0] || userData?.userData?.recent_pik[0],
  };

  const matchImageSource = matchData?.recent_pik?.[0]
    ? { uri: ApiConfig.IMAGE_BASE_URL + matchData.recent_pik[0] }
    : { uri: ApiConfig.PLACEHOLDER_IMAGE };

  return (
    <View style={styles.Container} key={matchData._id}>
      <View style={detailBoxStyle}>
        <View style={styles.MatchImageView}>
          <Image style={styles.MatchCardMyProfilePic} source={userImageSource} />
          <Image style={styles.LikeButtonInMiddleIcon} source={CommonIcons.ic_red_like_button} />
          <Image style={styles.MatchCardOpponentProfilePic} source={matchImageSource} />
        </View>
        <View style={styles.MatchTextView}>
          <Text numberOfLines={1} style={[styles.TitleMatchText, { color: colors.TitleText }]}>
            It's a match!
          </Text>
          <Text numberOfLines={2} style={[styles.DescriptionText, { color: colors.TextColor }]}>
            You and {matchData.full_name || 'User'} liked each other.
          </Text>
        </View>
        <Pressable onPress={handleChatClick} style={styles.LikeButtonView}>
          <Image style={styles.LikeButtonIcon} source={CommonIcons.message_button} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  Container: {
    alignSelf: 'center',
    width: '90%',
  },
  DetailBoxContainerView: {
    borderRadius: hp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('1%'),
    paddingHorizontal: hp('1.5%'),
    paddingVertical: hp('1.8%'),
    width: '100%',
  },
  TitleMatchText: {
    ...GROUP_FONT.h2,
    color: COLORS.Primary,
  },
  DescriptionText: {
    ...GROUP_FONT.body4,
    color: COLORS.Black,
    fontFamily: FONTS.SemiBold,
  },
  LikeButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
  },
  LikeButtonIcon: {
    height: hp(6.5),
    width: hp(6.5),
  },
  // Match Box
  MatchImageView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '32%',
  },
  MatchCardMyProfilePic: {
    borderRadius: 500,
    height: 60,
    right: -20,
    width: 60,
  },
  LikeButtonInMiddleIcon: {
    alignSelf: 'center',
    borderRadius: 500,
    height: 30,
    justifyContent: 'center',
    width: 30,
    zIndex: 9999,
  },
  MatchCardOpponentProfilePic: {
    borderRadius: 500,
    height: 60,
    left: -20,
    width: 60,
  },
  MatchTextView: {
    justifyContent: 'center',
    width: '48%',
  },
});

export default memo(MatchesContent);
