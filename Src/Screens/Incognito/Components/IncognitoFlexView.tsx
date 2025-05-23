import React, { memo } from 'react';
import type { FC } from 'react';
import { Image, ImageStyle, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import CommonIcons from '../../../Common/CommonIcons';
import { FONTS, GROUP_FONT } from '../../../Common/Theme';
import { useTheme } from '../../../Contexts/ThemeContext';

interface IncognitoFlexViewProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  itemStyle?: TextStyle;
  disabled?: boolean;
}

const IncognitoFlexView: FC<IncognitoFlexViewProps> = ({
  title,
  onPress,
  style,
  itemStyle,
  disabled,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || false}
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
  addText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 14.5,
  },
  itemTextStyle: {
    ...GROUP_FONT.body3,
    fontFamily: FONTS.Medium,
    fontSize: 14.5,
  },
  rightArrowIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 13,
    justifyContent: 'center',
    width: 13,
  },
  rightIconView: {
    alignItems: 'center',
    borderRadius: 100,
    height: 35,
    justifyContent: 'center',
    width: 70,
  },

  settingView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
