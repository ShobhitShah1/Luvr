import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {CommonSize} from '../../Common/CommonSize';
import {ActiveOpacity, COLORS, FONTS} from '../../Common/Theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface ButtonProps {
  Title: string;
  Navigation: () => void;
  Disabled: boolean;
}

const GradientButton: FC<ButtonProps> = ({Title, Navigation, Disabled}) => {
  return (
    <TouchableOpacity
      disabled={Disabled}
      activeOpacity={ActiveOpacity}
      onPress={Navigation}
      style={styles.CreateAccountButton}>
      <LinearGradient
        colors={Disabled ? COLORS.DisableButtonGradient : COLORS.ButtonGradient}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={styles.GradientViewStyle}>
        <Text
          style={[
            styles.NewAccountText,
            {color: Disabled ? COLORS.DisableText : COLORS.White},
          ]}>
          {Title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  CreateAccountButton: {
    width: '100%',
    overflow: 'hidden',
    alignSelf: 'center',
    height: hp('5.5%'),
    justifyContent: 'center',
    borderRadius: CommonSize(50),
  },
  GradientViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  NewAccountText: {
    textAlign: 'center',
    color: COLORS.White,
    fontSize: hp("1.8%"),
    // fontSize: CommonSize(14),
    fontFamily: FONTS.Bold,
  },
  TouchButtonStyle: {},
});
