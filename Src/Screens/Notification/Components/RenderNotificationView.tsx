import {Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import CommonIcons from '../../../Common/CommonIcons';
import CommonImages from '../../../Common/CommonImages';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

interface NotificationData {
  id: number;
  image: string;
  title: string;
  description: string;
  time: string | object;
}

const RenderNotificationView: FC<NotificationData> = ({
  id,
  image,
  title,
  description,
  time,
}) => {
  console.log('time', time);
  return (
    <View style={styles.Container}>
      <View style={styles.DetailBoxContainerView}>
        <View style={styles.LikeImageView}>
          <Image
            style={styles.LikeImageProfile}
            source={CommonImages.WelcomeBackground}
          />
        </View>
        <View style={styles.LikeTextView}>
          <Text numberOfLines={3} style={styles.TitleMatchText}>
            {title}
          </Text>
          <Text style={styles.DescriptionText}>{description}</Text>
        </View>
        <View style={styles.LikeButtonView}>
          <Text style={styles.TimeText}>{'10:50 AM'}</Text>
        </View>
      </View>
    </View>
  );
};

export default RenderNotificationView;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
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
    fontSize: 18,
    lineHeight: 21,
    fontFamily: FONTS.SemiBold,
    color: COLORS.Primary,
  },
  DescriptionText: {
    ...GROUP_FONT.body4,
    fontFamily: FONTS.Medium,
    color: COLORS.Black,
  },

  // Like Box
  LikeImageView: {
    width: '15%',
    // justifyContent: 'center',
  },
  LikeImageProfile: {
    width: 60,
    height: 60,
    borderRadius: 500,
  },
  LikeTextView: {
    width: '63%',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  LikeButtonView: {
    width: '18%',

    // alignItems: 'center',
    // justifyContent: 'center',
  },
  TimeText: {
    ...GROUP_FONT.body4,
    color: COLORS.Black,
    // width: 60,
    // height: 60,
  },
});
