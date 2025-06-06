import React, { memo, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import { useTheme } from '../../../Contexts/ThemeContext';
import { ListDetailProps } from '../../../Types/Interface';
import { ProfileType } from '../../../Types/ProfileType';

let NO_IMAGE_CONTAINER = 150;

const LikesContent = ({ LikesData }: { LikesData: ListDetailProps }) => {
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
    <View style={[styles.container]} key={user_details?.[0]?._id || LikesData?._id}>
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
};

export default memo(LikesContent);

const styles = StyleSheet.create({
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

  container: {
    width: '90%',
    alignSelf: 'center',
  },
  DetailBoxContainerView: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: hp('4%'),
    marginVertical: hp('1%'),
    paddingVertical: hp('1.8%'),
    paddingHorizontal: hp('1.5%'),
    justifyContent: 'space-between',
  },
  TitleMatchText: {
    ...GROUP_FONT.h2,
    color: COLORS.Primary,
  },
  DescriptionText: {
    ...GROUP_FONT.body4,
    fontFamily: FONTS.SemiBold,
    color: COLORS.Black,
  },

  // Like Box
  LikeImageView: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ImageLoadingView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  LikeImageProfile: {
    width: 60,
    height: 60,
    borderRadius: 500,
  },
  LikeTextView: {
    width: '65%',
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  LikeButtonView: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  LikeButtonIcon: {
    width: 40,
    height: 40,
  },

  // Match Box
  MatchImageView: {
    width: '33%',
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  MatchCardMyProfilePic: {
    width: 60,
    height: 60,
    right: -20,
    borderRadius: 500,
  },
  LikeButtonInMiddleIcon: {
    width: 30,
    height: 30,
    zIndex: 9999,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 500,
  },
  MatchCardOpponentProfilePic: {
    width: 60,
    height: 60,
    left: -20,
    borderRadius: 500,
  },
  MatchTextView: {
    width: '48%',
    justifyContent: 'center',
  },
});
