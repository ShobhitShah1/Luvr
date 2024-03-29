import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import {ActiveOpacity, COLORS, FONTS} from '../Common/Theme';

interface ButtonProps {
  onPress: () => void;
  ButtonTitle: string;
  isLoading: boolean;
}

const Button: FC<ButtonProps> = ({onPress, ButtonTitle, isLoading}) => {
  return (
    <View style={styles.ButtonContainer}>
      <TouchableOpacity
        disabled={isLoading}
        onPress={onPress}
        activeOpacity={ActiveOpacity}
        style={styles.LogoutButtonContainer}>
        {isLoading ? (
          <View style={styles.LoadingView}>
            <ActivityIndicator size={28} color={COLORS.White} />
          </View>
        ) : (
          <Text style={styles.LogoutButtonText}>{ButtonTitle}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Button;

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
