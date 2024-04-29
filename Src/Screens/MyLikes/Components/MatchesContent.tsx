import React, {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import CommonIcons from '../../../Common/CommonIcons';
import CommonImages from '../../../Common/CommonImages';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import {ProfileType} from '../../../Types/ProfileType';
import {LikeAndMatchTypes} from '../../../Types/SwiperCard';
import {useNavigation} from '@react-navigation/native';

interface LikesProps {
  LikesData: LikeAndMatchTypes;
}

let NOIMAGE_CONTAINER = 150;

const MatchesContent: FC<LikesProps> = ({LikesData}) => {
  const navigation = useNavigation();
  const userData = useSelector((state: any) => state?.user);
  let title = LikesData?.status;
  let Data: ProfileType | [] = [];
  console.log('LikesData', LikesData);

  if (
    LikesData &&
    LikesData.user_details &&
    LikesData.user_details.length > 0
  ) {
    Data = LikesData.user_details[0];
  } else {
    Data = [];
  }
  if (title === 'match') {
    return (
      <View style={styles.Container}>
        <View style={styles.DetailBoxContainerView}>
          <View style={styles.MatchImageView}>
            <Image
              style={styles.MatchCardMyProfilePic}
              source={{
                uri:
                  ApiConfig.IMAGE_BASE_URL + userData?.userData?.recent_pik[0],
              }}
            />
            <Image
              style={styles.LikeButtonInMiddleIcon}
              source={CommonIcons.like_button}
            />
            <Image
              style={styles.MatchCardOpponentProfilePic}
              source={
                Data?.recent_pik &&
                Data?.recent_pik?.length !== 0 &&
                Data?.recent_pik[0]
                  ? {uri: ApiConfig.IMAGE_BASE_URL + Data?.recent_pik[0]}
                  : CommonImages.WelcomeBackground
              }
            />
          </View>
          <View style={styles.MatchTextView}>
            <Text numberOfLines={1} style={styles.TitleMatchText}>
              It's a match!
            </Text>
            <Text numberOfLines={2} style={styles.DescriptionText}>
              You and {Data?.full_name || 'User'} liked each other.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Chat', {
                id: Data?._id,
              });
            }}
            style={styles.LikeButtonView}>
            <Image
              style={styles.LikeButtonIcon}
              source={CommonIcons.message_button}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default MatchesContent;

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
    width: NOIMAGE_CONTAINER,
    height: NOIMAGE_CONTAINER,
    backgroundColor: COLORS.White,
  },
  NoLikeImage: {
    width: NOIMAGE_CONTAINER - 70,
    height: NOIMAGE_CONTAINER - 70,
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
    backgroundColor: COLORS.White,
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
