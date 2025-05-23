import React, { memo } from 'react';
import type { FC } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS, FONTS } from '../Common/Theme';
import { useTheme } from '../Contexts/ThemeContext';

interface ButtonProps {
  onPress: () => void;
  ButtonTitle: string;
  isLoading: boolean;
}

const Button: FC<ButtonProps> = ({ onPress, ButtonTitle, isLoading }) => {
  const { colors } = useTheme();

  return (
    <LinearGradient
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={colors.ButtonGradient}
      style={styles.LogoutButtonContainer}
      accessibilityLabel="LinearGradient"
    >
      <Pressable
        accessibilityLabel="button"
        disabled={isLoading}
        onPress={onPress}
        style={{ flex: 1, justifyContent: 'center' }}
      >
        {isLoading ? (
          <View style={styles.LoadingView}>
            <ActivityIndicator size={28} color={colors.Primary} />
          </View>
        ) : (
          <Text style={styles.LogoutButtonText}>{ButtonTitle}</Text>
        )}
      </Pressable>
    </LinearGradient>
  );
};

export default memo(Button);

const styles = StyleSheet.create({
  ButtonContainer: {
    marginVertical: 10,
  },
  LoadingView: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  LogoutButtonContainer: {
    alignSelf: 'center',
    backgroundColor: COLORS.Primary,
    borderRadius: 20,
    height: 55,
    justifyContent: 'center',
    width: 220,
  },
  LogoutButtonText: {
    color: COLORS.White,
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    textAlign: 'center',
  },
});
