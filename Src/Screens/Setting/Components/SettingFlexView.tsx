// SettingFlexView.js
import React, { FC, memo, useEffect, useState } from 'react';
import { Image, ImageStyle, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import CommonIcons from '../../../Common/CommonIcons';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
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
  const { colors } = useTheme();
  const [localIsActive, setLocalIsActive] = useState(isActive);

  useEffect(() => {
    setLocalIsActive(isActive);
  }, [isActive, Item, IsSwitch]);

  return (
    <Pressable onPress={onPress} style={[styles.SettingView, style]}>
      <Text style={[styles.ItemTextStyle, { color: colors.TextColor }, itemStyle]}>{Item}</Text>
      {!hideRightIcon && IsSwitch ? (
        <SwitchComponent size={38} isActive={localIsActive} onPress={() => (onSwitchPress ? onSwitchPress() : {})} />
      ) : (
        <View style={[styles.RightIconView, rightIconViewStyle]}>
          <Image
            resizeMode="contain"
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
    fontSize: 14.5,
    fontFamily: FONTS.Medium,
  },
});

// // SettingFlexView.js
// import React, {FC} from 'react';
// import {
//   Image,
//   ImageStyle,
//   StyleSheet,
//   Text,
//   TextStyle,
//   TouchableOpacity,
//   View,
//   ViewStyle,
// } from 'react-native';
// import CommonIcons from '../../../Common/CommonIcons';
// import {ActiveOpacity, COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
// import SwitchComponent from '../../../Components/SwitchComponent';

// interface SettingFlexViewProps {
//   Item: string;
//   onPress: () => void;
//   style?: ViewStyle;
//   IsSwitch?: boolean;
//   itemStyle?: TextStyle;
//   rightIconViewStyle?: ViewStyle;
//   rightArrowIconStyle?: ImageStyle;
// }

// const SettingFlexView: FC<SettingFlexViewProps> = ({
//   Item,
//   onPress,
//   style,
//   itemStyle,
//   IsSwitch,
//   rightIconViewStyle,
//   rightArrowIconStyle,
// }) => {
//   return (
//     <TouchableOpacity
//       activeOpacity={ActiveOpacity}
//       onPress={onPress}
//       style={[styles.SettingView, style]}>
//       <Text style={[styles.ItemTextStyle, itemStyle]}>{Item}</Text>
//       {IsSwitch ? (
//         <SwitchComponent isActive={true} size={38} />
//       ) : (
//         <View style={[styles.RightIconView, rightIconViewStyle]}>
//           <Image
//             resizeMode="contain"
//             source={CommonIcons.RightArrow}
//             style={[styles.RightArrowIcon, rightArrowIconStyle]}
//           />
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// };
// export default SettingFlexView;

// const styles = StyleSheet.create({
//   SettingView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//     justifyContent: 'space-between',
//   },
//   RightIconView: {
//     width: 32,
//     height: 32,
//     borderRadius: 100,
//     alignItems: 'center',
//     alignSelf: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(234, 234, 234, 1)',
//   },
//   RightArrowIcon: {
//     width: 15,
//     height: 15,
//     alignItems: 'center',
//     alignSelf: 'center',
//     justifyContent: 'center',
//   },
//   ItemTextStyle: {
//     ...GROUP_FONT.body3,
//     color: COLORS.Black,
//     fontSize: 15,
//     fontFamily: FONTS.Medium,
//   },
// });
