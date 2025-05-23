import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { FONTS, SIZES } from '../../../Common/Theme';
import CustomTextInput from '../../../Components/CustomTextInput';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';

interface EmailInputModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddEmail: (email: string) => void;
}

const EmailInputModal: React.FC<EmailInputModalProps> = ({ isVisible, onClose, onAddEmail }) => {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState<string>('');

  const handleAddEmail = () => {
    if (email.trim() && isValidEmail(email)) {
      onAddEmail(email.trim());
      setEmail('');
      onClose();
    }
  };

  const isValidEmail = (text: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(text);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <GradientBorderView
        gradientProps={{ colors: colors.ButtonGradient }}
        style={{
          width: '90%',
          alignSelf: 'center',
          borderWidth: 1,
          borderRadius: 20,
          backgroundColor: isDark ? 'rgba(13, 1, 38, 0.9)' : 'rgba(255, 255, 255, 0.98)',
          overflow: 'hidden',
        }}
      >
        <View style={styles.modalContent}>
          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.closeButtonText, { color: colors.TextColor }]}>✕</Text>
          </Pressable>

          <CustomTextInput
            style={[
              styles.input,
              {
                borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.3)' : colors.TextColor,
              },
            ]}
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.5)' : colors.TextColor}
          />

          <LinearGradient colors={colors.ButtonGradient} style={styles.addButton}>
            <Pressable
              style={{
                width: '100%',
                height: '100%',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={handleAddEmail}
              disabled={!email.trim() || !isValidEmail(email)}
            >
              <Text style={[styles.addButtonText, { color: colors.White }]}>Add</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </GradientBorderView>
    </View>
  );
};

export default memo(EmailInputModal);

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 50,
    justifyContent: 'center',
    marginTop: SIZES.padding,
    width: '55%',
  },
  addButtonText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    width: 30,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    fontFamily: FONTS.Regular,
    fontSize: 16,
    height: 50,
    marginVertical: 10,
    width: '100%',
  },
  modalContent: {
    alignItems: 'center',
    padding: SIZES.padding,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
});
