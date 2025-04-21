import React, { FC, memo } from 'react';
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
    >
      <Pressable disabled={isLoading} onPress={onPress} style={{ flex: 1, justifyContent: 'center' }}>
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
  LogoutButtonContainer: {
    width: 220,
    height: 55,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.Primary,
  },
  LoadingView: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  LogoutButtonText: {
    fontSize: 15,
    color: COLORS.White,
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
  },
});
