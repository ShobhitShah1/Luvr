import React, { FC } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CommonSize } from '../../Common/CommonSize';
import { COLORS, FONTS } from '../../Common/Theme';
import { useTheme } from '../../Contexts/ThemeContext';

interface ButtonProps {
  Title: string;
  Navigation: () => void;
  Disabled: boolean;
  isLoading: boolean;
  icon?: React.ReactNode;
}

const GradientButton: FC<ButtonProps> = ({ Title, Navigation, Disabled, isLoading, icon }) => {
  const { colors, isDark } = useTheme();

  return (
    <LinearGradient
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={colors.ButtonGradient}
      style={styles.CreateAccountButton}
    >
      <Pressable disabled={isLoading || Disabled} onPress={Navigation} style={{ flex: 1, zIndex: 99 }}>
        <View style={[styles.GradientViewStyle]}>
          {isLoading ? (
            <ActivityIndicator color={colors.White} style={styles.LoaderView} size={25} />
          ) : (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              {icon}
              <Text style={[styles.NewAccountText, { color: colors.ButtonText }]}>{Title}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </LinearGradient>
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
