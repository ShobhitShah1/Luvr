import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../../Common/Theme';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

interface ContactTabButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const ContactTabButton: FC<ContactTabButtonProps> = ({
  label,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.TabBarButtonView,
        {
          backgroundColor: isSelected ? COLORS.Primary : COLORS.White,
          borderWidth: isSelected ? 2 : 0,
        },
      ]}
      activeOpacity={ActiveOpacity}
      onPress={onPress}>
      <Text
        style={[
          styles.TabBarButtonText,
          {
            color: isSelected ? COLORS.White : 'rgba(130, 130, 130, 1)',
          },
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default ContactTabButton;

const styles = StyleSheet.create({
  TabBarButtonView: {
    width: '43%',
    borderRadius: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.Primary,
    height: hp('6.5%'),
    borderColor: COLORS.White,
  },
  TabBarButtonText: {
    ...GROUP_FONT.h4,
  },
});
