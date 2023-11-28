import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActiveOpacity, COLORS, FONTS, GROUP_FONT} from '../Common/Theme';

interface CustomCheckBoxProps {
  isChecked: boolean;
  onToggle: () => void;
  BoxText?: string;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({
  isChecked,
  onToggle,
  BoxText,
}) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: isChecked ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isChecked]);

  const animatedStyle = {
    transform: [{scale: scaleValue}],
  };

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={ActiveOpacity}>
      <View style={styles.BoxContainer}>
        <View style={[styles.checkbox, isChecked && styles.checked]}>
          <Animated.View style={[styles.checkboxIcon, animatedStyle]}>
            {isChecked && (
              <Icon name="check" size={hp('1.5%')} color={COLORS.White} />
            )}
          </Animated.View>
        </View>

        {BoxText && <Text style={styles.CheckboxText}>{BoxText}</Text>}
      </View>
    </TouchableOpacity>
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
  checked: {
    backgroundColor: COLORS.Primary,
    borderColor: COLORS.Primary,
  },
  checkboxIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  CheckboxText: {
    ...GROUP_FONT.h4,
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: hp('0.5%'),
    fontFamily: FONTS.Medium,
  },
});

export default CustomCheckBox;
