import React, { FC, memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonImages from '../../../Common/CommonImages';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import { formatDate } from '../../../Utils/formatDate';
import { useTheme } from '../../../Contexts/ThemeContext';

interface NotificationData {
  title: string;
  description: string;
  date: string;
}

const RenderNotificationView: FC<NotificationData> = ({ title, description, date }) => {
  const { colors } = useTheme();
  const formattedDate = formatDate(date);

  return (
    <View style={styles.Container}>
      <View style={styles.DetailBoxContainerView}>
        <View style={styles.LikeImageView}>
          <Image style={styles.LikeImageProfile} source={CommonImages.WelcomeBackground} />
        </View>
        <View style={styles.LikeTextView}>
          <Text numberOfLines={3} style={[styles.TitleMatchText, { color: colors.TitleText }]}>
            {title}
          </Text>
          <Text numberOfLines={5} style={[styles.DescriptionText, { color: colors.TextColor }]}>
            {description}
          </Text>
        </View>
        <View style={styles.LikeButtonView}>
          <Text style={[styles.TimeText, { color: colors.TextColor }]}>{String(formattedDate)}</Text>
        </View>
      </View>
    </View>
  );
};

export default memo(RenderNotificationView);

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
    paddingHorizontal: hp('1.2%'),
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
    width: 55,
    height: 55,
    borderRadius: 500,
  },
  LikeTextView: {
    width: '55%',
    paddingLeft: 2,
    justifyContent: 'center',
  },
  LikeButtonView: {
    width: '25%',
    justifyContent: 'center',
  },
  TimeText: {
    ...GROUP_FONT.body4,
    color: COLORS.Black,
    textAlign: 'center',
    fontSize: 12,
    padding: 0,
  },
});
