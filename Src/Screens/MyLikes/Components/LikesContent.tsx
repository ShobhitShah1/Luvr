import React, { memo, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CommonIcons from '../../../Common/CommonIcons';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import { useTheme } from '../../../Contexts/ThemeContext';
import type { ListDetailProps } from '../../../Types/Interface';
import type { ProfileType } from '../../../Types/ProfileType';

const NO_IMAGE_CONTAINER = 150;

function LikesContent({ LikesData }: { LikesData: ListDetailProps }) {
  const { colors, isDark } = useTheme();

  const [isImageLoading, setIsImageLoading] = useState(false);
  const { status, user_details } = LikesData;

  const data: ProfileType = user_details?.[0] ?? null;

  const imageSource = useMemo(() => {
    return data?.recent_pik && data?.recent_pik?.[0]
      ? {
          uri: ApiConfig.IMAGE_BASE_URL + data?.recent_pik?.[0],
        }
      : null;
  }, [data]);

  if (status !== 'like') {
    return null;
  }

  return (
    <View style={styles.container} key={user_details?.[0]?._id || LikesData?._id}>
      <View
        style={[
          styles.DetailBoxContainerView,
          {
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : colors.White,
          },
        ]}
      >
        <View style={styles.LikeImageView}>
          {imageSource && (
            <Image
              source={imageSource}
              style={styles.LikeImageProfile}
              onLoad={() => setIsImageLoading(false)}
              onLoadStart={() => setIsImageLoading(true)}
            />
          )}
          {isImageLoading && (
            <View style={styles.ImageLoadingView}>
              <ActivityIndicator size={30} color={colors.Primary} />
            </View>
          )}
        </View>
        <View style={styles.LikeTextView}>
          <Text numberOfLines={1} style={[styles.TitleMatchText, { color: colors.TitleText }]}>
            You Made a Move!
          </Text>
          <Text numberOfLines={2} style={[styles.DescriptionText, { color: colors.TextColor }]}>
            You've taken the first step! You liked{' '}
            <Text style={{ fontFamily: FONTS.Bold, color: colors.Primary }}>
              {`${user_details?.[0]?.full_name}'s ` || 'User'}
            </Text>
            profile.
          </Text>
        </View>
        <View style={styles.LikeButtonView}>
          <Image style={styles.LikeButtonIcon} source={CommonIcons.ic_red_like_button} />
        </View>
      </View>
    </View>
  );
}

export default memo(LikesContent);

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

  container: {
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

  // Like Box
  LikeImageView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
  },
  ImageLoadingView: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  LikeImageProfile: {
    borderRadius: 500,
    height: 60,
    width: 60,
  },
  LikeTextView: {
    justifyContent: 'center',
    paddingHorizontal: 5,
    width: '65%',
  },
  LikeButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
  },
  LikeButtonIcon: {
    height: 40,
    width: 40,
  },

  // Match Box
  MatchImageView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '33%',
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
