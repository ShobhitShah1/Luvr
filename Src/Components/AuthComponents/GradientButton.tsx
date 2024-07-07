import React, {FC} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {CommonSize} from '../../Common/CommonSize';
import {ActiveOpacity, COLORS, FONTS} from '../../Common/Theme';

interface ButtonProps {
  Title: string;
  Navigation: () => void;
  Disabled: boolean;
  isLoading: boolean;
}

const GradientButton: FC<ButtonProps> = ({
  Title,
  Navigation,
  Disabled,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      disabled={isLoading || Disabled}
      activeOpacity={ActiveOpacity}
      onPress={Navigation}
      style={styles.CreateAccountButton}>
      <View
        style={[
          styles.GradientViewStyle,
          {
            backgroundColor: Disabled
              ? COLORS.DisableButtonBackground
              : COLORS.Primary,
          },
        ]}>
        {isLoading ? (
          <ActivityIndicator
            color={COLORS.White}
            style={styles.LoaderView}
            size={25}
          />
        ) : (
          <Text
            style={[
              styles.NewAccountText,
              {color: Disabled ? COLORS.Black : COLORS.White},
            ]}>
            {Title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  CreateAccountButton: {
    width: hp('25%'),
    overflow: 'hidden',
    alignSelf: 'center',
    height: hp('6%'),
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
    fontSize: hp('1.8%'),
    // fontSize: CommonSize(14),
    fontFamily: FONTS.Bold,
  },
  LoaderView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  TouchButtonStyle: {},
});
