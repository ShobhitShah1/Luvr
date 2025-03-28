import { useNavigation } from '@react-navigation/native';
import React, { FC, memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import CommonIcons from '../../../Common/CommonIcons';
import CommonImages from '../../../Common/CommonImages';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import { LikeInterface } from '../../../Types/Interface';
import { useTheme } from '../../../Contexts/ThemeContext';

interface LikesProps {
  LikesData: LikeInterface;
}

let NO_IMAGE_CONTAINER = 150;

const MatchesContent: FC<LikesProps> = ({ LikesData }) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();

  const userData = useSelector((state: any) => state?.user?.userData || {});
  const matchData = LikesData?.user_details?.[0];

  const handleChatClick = () => {
    if (userData._id !== matchData?._id) {
      navigation.navigate('Chat', { id: matchData?._id });
    }
  };

  if (LikesData?.status === 'match' && matchData && userData._id !== matchData._id) {
    return (
      <View style={styles.Container} key={matchData._id}>
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
          <View style={styles.MatchImageView}>
            <Image
              style={styles.MatchCardMyProfilePic}
              source={{
                uri: ApiConfig.IMAGE_BASE_URL + userData.recent_pik[0] || userData?.userData?.recent_pik[0],
              }}
            />
            <Image style={styles.LikeButtonInMiddleIcon} source={CommonIcons.ic_red_like_button} />
            <Image
              style={styles.MatchCardOpponentProfilePic}
              source={
                matchData?.recent_pik?.[0]
                  ? { uri: ApiConfig.IMAGE_BASE_URL + matchData?.recent_pik[0] }
                  : { uri: ApiConfig.PLACEHOLDER_IMAGE }
              }
            />
          </View>
          <View style={styles.MatchTextView}>
            <Text numberOfLines={1} style={[styles.TitleMatchText, { color: colors.TitleText }]}>
              It's a match!
            </Text>
            <Text numberOfLines={2} style={[styles.DescriptionText, { color: colors.TextColor }]}>
              You and {matchData.full_name || 'User'} liked each other.
            </Text>
          </View>
          <TouchableOpacity onPress={handleChatClick} style={styles.LikeButtonView}>
            <Image style={styles.LikeButtonIcon} source={CommonIcons.message_button} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
};

export default memo(MatchesContent);

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

  Container: {
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
  LikeButtonView: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  LikeButtonIcon: {
    width: hp(6.5),
    height: hp(6.5),
  },

  // Match Box
  MatchImageView: {
    width: '32%',
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
