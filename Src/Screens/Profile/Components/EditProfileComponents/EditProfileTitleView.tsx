import { Image, StyleSheet, Text, View, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import React, { FC, memo } from 'react';
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

const EditProfileTitleView: FC<EditProfileProps> = ({ Icon, Title, isIcon, style, iconStyle, titleStyle }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.TitleViewContainer, style]}>
      {isIcon && (
        <Image resizeMode="contain" source={Icon} tintColor={colors.TextColor} style={[styles.IconView, iconStyle]} />
      )}
      <Text style={[styles.TitleText, { color: colors.TextColor }, titleStyle]}>{Title}</Text>
    </View>
  );
};

export default memo(EditProfileTitleView);

const styles = StyleSheet.create({
  TitleViewContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  IconView: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  TitleText: {
    marginLeft: 5,
    ...GROUP_FONT.h3,
    color: COLORS.Black,
  },
});
