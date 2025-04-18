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

        {BoxText && <Text style={[styles.CheckboxText, { color: colors.TextColor }]}>{BoxText}</Text>}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  BoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: hp('2.1%'),
    height: hp('2.1%'),
    borderRadius: hp('50%'),
    borderWidth: 1,
    borderColor: COLORS.Black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  IconCheck: {
    width: hp('1.2%'),
    height: hp('1.2%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  CheckboxText: {
    ...GROUP_FONT.h4,
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: hp('0.5%'),
    fontFamily: FONTS.Medium,
  },
});

export default memo(CustomCheckBox);
