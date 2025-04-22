import React, { FC, memo } from 'react';
import { Image, ImageStyle, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import CommonIcons from '../../../Common/CommonIcons';
import { FONTS, GROUP_FONT } from '../../../Common/Theme';
import { useTheme } from '../../../Contexts/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

interface IncognitoFlexViewProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  itemStyle?: TextStyle;
}

const IncognitoFlexView: FC<IncognitoFlexViewProps> = ({ title, onPress, style, itemStyle }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.settingView, style]}
      hitSlop={{ top: 7, bottom: 7, left: 10, right: 10 }}
    >
      <Text style={[styles.itemTextStyle, { color: colors.TextColor }, itemStyle]}>{title}</Text>

      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={colors.ButtonGradient}
        style={styles.rightIconView}
      >
        <Text style={[styles.addText, { color: colors.White }]}>+ Add</Text>
      </LinearGradient>
    </Pressable>
  );
};
export default memo(IncognitoFlexView);

const styles = StyleSheet.create({
  settingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightIconView: {
    width: 70,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  rightArrowIcon: {
    width: 13,
    height: 13,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  itemTextStyle: {
    ...GROUP_FONT.body3,
    fontSize: 14.5,
    fontFamily: FONTS.Medium,
  },

  addText: {
    fontSize: 14.5,
    fontFamily: FONTS.SemiBold,
  },
});
