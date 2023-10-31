import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {CommonSize} from '../../Common/CommonSize';
import {ActiveOpacity, COLORS, FONTS} from '../../Common/Theme';

interface ButtonProps {
  Title: String;
  Navigation: () => void;
  Disabled: Boolean;
}

const GradientButton: FC<ButtonProps> = ({Title, Navigation, Disabled}) => {
  return (
    <LinearGradient
      colors={
        Boolean(Disabled) ? COLORS.DisableButtonGradient : COLORS.ButtonGradient
      }
      start={{x: 0, y: 1}}
      end={{x: 1, y: 0}}
      style={styles.CreateAccountButton}>
      <TouchableOpacity
        disabled={Boolean(Disabled)}
        activeOpacity={ActiveOpacity}
        onPress={Navigation}>
        <Text style={styles.NewAccountText}>{Title}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  CreateAccountButton: {
    width: '80%',
    height: CommonSize(45),
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: CommonSize(50),

    shadowColor: COLORS.Black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  NewAccountText: {
    textAlign: 'center',
    color: COLORS.White,
    fontSize: CommonSize(16),
    fontFamily: FONTS.Bold,
  },
});
