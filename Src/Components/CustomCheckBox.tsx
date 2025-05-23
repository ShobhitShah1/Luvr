import React, { memo, useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CommonIcons from '../Common/CommonIcons';
import { COLORS, FONTS, GROUP_FONT } from '../Common/Theme';
import { useTheme } from '../Contexts/ThemeContext';

interface CustomCheckBoxProps {
  isChecked: boolean;
  onToggle: () => void;
  BoxText?: string;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({ isChecked, onToggle, BoxText }) => {
  const { colors } = useTheme();
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: isChecked ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isChecked, scaleValue]);

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <Pressable onPress={onToggle}>
      <View style={styles.BoxContainer}>
        <View
          style={[
            styles.checkbox,
            { borderColor: colors.TextColor },
            isChecked && { backgroundColor: colors.Primary, borderColor: colors.Primary },
          ]}
        >
          <Animated.View style={[styles.checkboxIcon, animatedStyle]}>
            {isChecked && <Image source={CommonIcons.Check} style={styles.IconCheck} />}
          </Animated.View>
        </View>

        {BoxText && (
          <Text style={[styles.CheckboxText, { color: colors.TextColor }]}>{BoxText}</Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  BoxContainer: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  CheckboxText: {
    ...GROUP_FONT.h4,
    alignSelf: 'center',
    fontFamily: FONTS.Medium,
    justifyContent: 'center',
    marginLeft: hp('0.5%'),
  },
  IconCheck: {
    alignSelf: 'center',
    height: hp('1.2%'),
    justifyContent: 'center',
    width: hp('1.2%'),
  },
  checkbox: {
    alignItems: 'center',
    borderColor: COLORS.Black,
    borderRadius: hp('50%'),
    borderWidth: 1,
    height: hp('2.1%'),
    justifyContent: 'center',
    width: hp('2.1%'),
  },
  checkboxIcon: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});

export default memo(CustomCheckBox);
