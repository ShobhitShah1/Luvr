/* eslint-disable react/no-unstable-nested-components */
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import CommonIcons from '../../../Common/CommonIcons';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonImages from '../../../Common/CommonImages';

interface LikesProps {
  LikesData: [];
}

let NOIMAGE_CONTAINER = 150;

const LikesContent: FC<LikesProps> = ({LikesData}) => {
  const RenderLikeView = () => {
    let title = 'Match';
    return (
      <View style={styles.Container}>
        {title === 'Like' ? (
          <View style={styles.DetailBoxContainerView}>
            <View style={styles.LikeImageView}>
              <Image
                style={styles.LikeImageProfile}
                source={CommonImages.WelcomeBackground}
              />
            </View>
            <View style={styles.LikeTextView}>
              <Text style={styles.TitleMatchText}>Liked you!</Text>
              <Text style={styles.DescriptionText}>
                You and Nikita Sharma liked each other.
              </Text>
            </View>
            <View style={styles.LikeButtonView}>
              <Image
                style={styles.LikeButtonIcon}
                source={CommonIcons.like_button}
              />
            </View>
          </View>
        ) : (
          <View style={styles.DetailBoxContainerView}>
            <View style={styles.MatchImageView}>
              <Image
                style={styles.MatchCardMyProfilePic}
                source={CommonImages.WelcomeBackground}
              />
              <Image
                style={styles.LikeButtonInMiddleIcon}
                source={CommonIcons.like_button}
              />
              <Image
                style={styles.MatchCardOpponentProfilePic}
                source={CommonImages.WelcomeBackground}
              />
            </View>
            <View style={styles.MatchTextView}>
              <Text style={styles.TitleMatchText}>Liked you!</Text>
              <Text style={styles.DescriptionText}>
                You and Nikita Sharma liked each other.
              </Text>
            </View>
            <View style={styles.LikeButtonView}>
              <Image
                style={styles.LikeButtonIcon}
                source={CommonIcons.like_button}
              />
            </View>
          </View>
        )}
      </View>
    );
  };
  const ListEmptyView = () => {
    return (
      <View style={styles.ListEmptyComponentView}>
        <View style={styles.NoLikeImageView}>
          <Image source={CommonIcons.NoLikes} style={styles.NoLikeImage} />
        </View>
        <View style={styles.EmptyTextView}>
          <Text style={styles.NoLikeTitle}>No likes</Text>
          <Text style={styles.NoLikeDescription}>
            You have no likes right now, when someone likes you they will appear
            here.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={[1, 2, 3, 4]} //LikesData
      renderItem={RenderLikeView}
      ListEmptyComponent={<ListEmptyView />}
    />
  );
};

export default LikesContent;

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
    color: COLORS.Black,
  },

  // Like Box
  LikeImageView: {
    width: '20%',
    justifyContent: 'center',
  },
  LikeImageProfile: {
    width: 60,
    height: 60,
    borderRadius: 500,
  },
  LikeTextView: {
    width: '68%',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  LikeButtonView: {
    width: '12%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  LikeButtonIcon: {
    width: 45,
    height: 45,
  },

  // Match Box
  MatchImageView: {
    width: '35%',
    flexDirection: 'row',
    overflow: 'hidden',
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
    width: '50%',
    justifyContent: 'center',
  },
});
