import React, { memo } from 'react';
import type { FC } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { ViewStyle, ImageStyle, TextStyle } from 'react-native';

import { COLORS, GROUP_FONT } from '../../../../Common/Theme';
import { useTheme } from '../../../../Contexts/ThemeContext';

interface EditProfileProps {
  Icon: any;
  Title: string;
  isIcon?: boolean;
  style?: ViewStyle;
  iconStyle?: ImageStyle;
  titleStyle?: TextStyle;
}

const EditProfileTitleView: FC<EditProfileProps> = ({
  Icon,
  Title,
  isIcon,
  style,
  iconStyle,
  titleStyle,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.TitleViewContainer, style]}>
      {isIcon && (
        <Image
          resizeMode="contain"
          source={Icon}
          tintColor={colors.TextColor}
          style={[styles.IconView, iconStyle]}
        />
      )}
      <Text style={[styles.TitleText, { color: colors.TextColor }, titleStyle]}>{Title}</Text>
    </View>
  );
};

export default memo(EditProfileTitleView);

const styles = StyleSheet.create({
  IconView: {
    alignSelf: 'center',
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  TitleText: {
    marginLeft: 5,
    ...GROUP_FONT.h3,
    color: COLORS.Black,
  },
  TitleViewContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
});
