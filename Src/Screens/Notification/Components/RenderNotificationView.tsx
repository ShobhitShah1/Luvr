import type { FC } from 'react';
import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import { GradientBorderView } from '../../../Components/GradientBorder';
import ApiConfig from '../../../Config/ApiConfig';
import { useTheme } from '../../../Contexts/ThemeContext';
import { formatDate } from '../../../Utils/formatDate';

interface NotificationData {
  title: string;
  description: string;
  date: string;
}

const RenderNotificationView: FC<NotificationData> = ({ title, description, date }) => {
  const { colors, isDark } = useTheme();
  const formattedDate = formatDate(date);

  return (
    <View style={styles.container}>
      <GradientBorderView
        gradientProps={{
          colors: isDark
            ? ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.2)']
            : ['transparent', 'transparent'],
        }}
        style={[
          styles.detailBoxContainerView,
          { backgroundColor: isDark ? 'transparent' : colors.White },
        ]}
      >
        <View style={styles.likeImageView}>
          <Image style={styles.likeImageProfile} source={{ uri: ApiConfig.PLACEHOLDER_IMAGE }} />
        </View>
        <View style={styles.likeTextView}>
          <Text numberOfLines={3} style={[styles.titleMatchText, { color: colors.TitleText }]}>
            {title}
          </Text>
          <Text numberOfLines={5} style={[styles.descriptionText, { color: colors.TextColor }]}>
            {description}
          </Text>
        </View>
        <View style={styles.LikeButtonView}>
          <Text style={[styles.timeText, { color: colors.TextColor }]}>
            {String(formattedDate)}
          </Text>
        </View>
      </GradientBorderView>
    </View>
  );
};

export default memo(RenderNotificationView);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    borderRadius: hp('4%'),
    overflow: 'hidden',
    width: '100%',
  },
  descriptionText: {
    ...GROUP_FONT.body4,
    color: COLORS.Black,
    fontFamily: FONTS.Medium,
  },
  detailBoxContainerView: {
    borderRadius: hp('10%'),
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('1%'),
    overflow: 'hidden',
    padding: 10,
    paddingHorizontal: hp('1.2%'),
    paddingVertical: hp('1.8%'),
    width: '100%',
  },
  titleMatchText: {
    ...GROUP_FONT.h2,
    color: COLORS.Primary,
    fontFamily: FONTS.SemiBold,
    fontSize: 18,
    lineHeight: 21,
  },

  // Like Box
  likeImageView: {
    width: '15%',
    // justifyContent: 'center',
  },
  likeImageProfile: {
    borderRadius: 500,
    height: 55,
    width: 55,
  },
  likeTextView: {
    justifyContent: 'center',
    paddingLeft: 2,
    width: '55%',
  },
  LikeButtonView: {
    justifyContent: 'center',
    width: '25%',
  },
  timeText: {
    ...GROUP_FONT.body4,
    color: COLORS.Black,
    fontSize: 12,
    padding: 0,
    textAlign: 'center',
  },
});
