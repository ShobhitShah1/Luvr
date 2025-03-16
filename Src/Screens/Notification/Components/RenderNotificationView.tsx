import React, { FC, memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonImages from '../../../Common/CommonImages';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import { formatDate } from '../../../Utils/formatDate';
import { useTheme } from '../../../Contexts/ThemeContext';
import { GradientBorderView } from '../../../Components/GradientBorder';

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
          colors: isDark ? ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.2)'] : ['transparent', 'transparent'],
        }}
        style={[styles.detailBoxContainerView, { backgroundColor: isDark ? 'transparent' : colors.White }]}
      >
        <View style={styles.likeImageView}>
          <Image style={styles.likeImageProfile} source={CommonImages.WelcomeBackground} />
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
          <Text style={[styles.timeText, { color: colors.TextColor }]}>{String(formattedDate)}</Text>
        </View>
      </GradientBorderView>
    </View>
  );
};

export default memo(RenderNotificationView);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    alignSelf: 'center',
    borderRadius: hp('4%'),
  },
  detailBoxContainerView: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    borderRadius: hp('10%'),
    marginVertical: hp('1%'),
    paddingVertical: hp('1.8%'),
    paddingHorizontal: hp('1.2%'),
    justifyContent: 'space-between',
  },
  titleMatchText: {
    ...GROUP_FONT.h2,
    fontSize: 18,
    lineHeight: 21,
    fontFamily: FONTS.SemiBold,
    color: COLORS.Primary,
  },
  descriptionText: {
    ...GROUP_FONT.body4,
    fontFamily: FONTS.Medium,
    color: COLORS.Black,
  },

  // Like Box
  likeImageView: {
    width: '15%',
    // justifyContent: 'center',
  },
  likeImageProfile: {
    width: 55,
    height: 55,
    borderRadius: 500,
  },
  likeTextView: {
    width: '55%',
    paddingLeft: 2,
    justifyContent: 'center',
  },
  LikeButtonView: {
    width: '25%',
    justifyContent: 'center',
  },
  timeText: {
    ...GROUP_FONT.body4,
    color: COLORS.Black,
    textAlign: 'center',
    fontSize: 12,
    padding: 0,
  },
});
