// SettingFlexView.js
import React, {FC} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import CommonIcons from '../../../Common/CommonIcons';
import {ActiveOpacity, COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';

interface SettingFlexViewProps {
  Item: string;
  onPress: () => void;
  style?: ViewStyle;
  itemStyle?: TextStyle;
  rightIconViewStyle?: ViewStyle;
  rightArrowIconStyle?: ImageStyle;
}

const SettingFlexView: FC<SettingFlexViewProps> = ({
  Item,
  onPress,
  style,
  itemStyle,
  rightIconViewStyle,
  rightArrowIconStyle,
}) => {
  return (
    <View style={[styles.SettingView, style]}>
      <Text style={[styles.ItemTextStyle, itemStyle]}>{Item}</Text>
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={onPress}
        style={[styles.RightIconView, rightIconViewStyle]}>
        <Image
          resizeMode="contain"
          source={CommonIcons.RightArrow}
          style={[styles.RightArrowIcon, rightArrowIconStyle]}
        />
      </TouchableOpacity>
    </View>
  );
};
export default SettingFlexView;

const styles = StyleSheet.create({
  SettingView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'space-between',
  },
  RightIconView: {
    width: 32,
    height: 32,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(234, 234, 234, 1)',
  },
  RightArrowIcon: {
    width: 15,
    height: 15,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  ItemTextStyle: {
    ...GROUP_FONT.body3,
    color: COLORS.Black,
    fontSize: 15,
    fontFamily: FONTS.Medium,
  },
});
