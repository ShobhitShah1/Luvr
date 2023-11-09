import React, {useState, useRef, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../Common/Theme';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

interface CustomCheckBoxProps {
  isChecked: boolean;
  onToggle: () => void;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({
  isChecked,
  onToggle,
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
    <TouchableOpacity onPress={onToggle}>
      <View style={[styles.checkbox, isChecked && styles.checked]}>
        <Animated.View style={[styles.checkboxIcon, animatedStyle]}>
          {isChecked && <Icon name="check" size={13} color={COLORS.White} />}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: hp('2.1%'),
    height: hp('2.1%'),
    borderRadius: hp('0.2%'),
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
});

export default CustomCheckBox;
