// SettingFlexView.js
import React, { FC, memo, useEffect, useState } from 'react';
import { Image, ImageStyle, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import CommonIcons from '../../../Common/CommonIcons';
import { FONTS, GROUP_FONT } from '../../../Common/Theme';
import SwitchComponent from '../../../Components/SwitchComponent';
import { useTheme } from '../../../Contexts/ThemeContext';

interface SettingFlexViewProps {
  Item: string;
  onPress?: () => void;
  style?: ViewStyle;
  IsSwitch?: boolean;
  itemStyle?: TextStyle;
  rightIconViewStyle?: ViewStyle;
  rightArrowIconStyle?: ImageStyle;
  isActive: boolean;
  onSwitchPress?: () => void;
  hideRightIcon?: boolean;
}

const SettingFlexView: FC<SettingFlexViewProps> = ({
  Item,
  onPress,
  style,
  itemStyle,
  IsSwitch,
  rightIconViewStyle,
  rightArrowIconStyle,
  isActive,
  onSwitchPress,
  hideRightIcon,
}) => {
  const { colors, isDark } = useTheme();
  const [localIsActive, setLocalIsActive] = useState(isActive);

  useEffect(() => {
    setLocalIsActive(isActive);
  }, [isActive, Item, IsSwitch]);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.SettingView, style]}
      hitSlop={{ top: 7, bottom: 7, left: 10, right: 10 }}
    >
      <Text style={[styles.ItemTextStyle, { color: colors.TextColor }, itemStyle]}>{Item}</Text>
      {!hideRightIcon && IsSwitch ? (
        <SwitchComponent size={38} isActive={localIsActive} onPress={() => (onSwitchPress ? onSwitchPress() : {})} />
      ) : (
        <View
          style={[
            styles.RightIconView,
            rightIconViewStyle,
            { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(234, 234, 234, 1)' },
          ]}
        >
          <Image
            resizeMode="contain"
            tintColor={colors.TextColor}
            source={CommonIcons.RightArrow}
            style={[styles.RightArrowIcon, rightArrowIconStyle]}
          />
        </View>
      )}
    </Pressable>
  );
};
export default memo(SettingFlexView);

const styles = StyleSheet.create({
  SettingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  RightIconView: {
    width: 30,
    height: 30,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  RightArrowIcon: {
    width: 13,
    height: 13,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  ItemTextStyle: {
    ...GROUP_FONT.body3,
    fontSize: 14.5,
    fontFamily: FONTS.Medium,
  },
});
