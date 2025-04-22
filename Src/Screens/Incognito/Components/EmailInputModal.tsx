import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FONTS, SIZES } from '../../../Common/Theme';
import CustomTextInput from '../../../Components/CustomTextInput';
import { GradientBorderView } from '../../../Components/GradientBorder';
import { useTheme } from '../../../Contexts/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

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

  if (!isVisible) return null;

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
              style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  modalContent: {
    padding: SIZES.padding,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    fontSize: 16,
    fontFamily: FONTS.Regular,
    marginVertical: 10,
  },
  addButton: {
    width: '55%',
    height: 50,
    borderRadius: 20,
    marginTop: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: FONTS.Bold,
  },
});
