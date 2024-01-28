/* eslint-disable react/no-unstable-nested-components */
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import CommonIcons from '../../../Common/CommonIcons';
import {COLORS, FONTS} from '../../../Common/Theme';
import { heightPercentageToDP } from 'react-native-responsive-screen';

interface LikesProps {
  LikesData: [];
}

let NOIMAGE_CONTAINER = 150;

const LikesContent: FC<LikesProps> = ({LikesData}) => {
  const RenderLikeView = () => {
    return (
      <View>
        <Text>Hello</Text>
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
      data={LikesData}
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
    paddingVertical: heightPercentageToDP(18),
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
});
