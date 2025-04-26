import React from 'react';
import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../Contexts/ThemeContext';
import CommonIcons from '../../Common/CommonIcons';
import GradientButton from '../AuthComponents/GradientButton';
import GradientBorder from '../GradientBorder/GradientBorder';
import { FONTS } from '../../Common/Theme';

const { width } = Dimensions.get('window');

const benefits = [
  'Your profile appears at the top of the stack for nearby users',
  "You're highlighted for 30 minutes, increasing your chances of getting more matches",
];

export interface BoostModalProps {
  isVisible: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onBoostMe?: () => void;
}

const BoostModal = ({ isVisible, onClose, isLoading = false, onBoostMe }: BoostModalProps) => {
  const { colors, isDark } = useTheme();

  const handleBoostMe = () => {
    if (onBoostMe) {
      onBoostMe();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      hasBackdrop
      isVisible={isVisible}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: isDark ? 'rgba(18, 18, 19, 2)' : colors.White }]}>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="cover"
            style={styles.boostImage}
            source={isDark ? CommonIcons.ic_dark_boost : CommonIcons.ic_light_boost}
          />
        </View>

        <View style={styles.boostCardContainer}>
          <View style={[styles.boostCard, { backgroundColor: isDark ? 'rgba(60, 40, 90, 0.5)' : colors.White }]}>
            <GradientBorder
              borderWidth={1.5}
              borderRadius={20}
              gradientProps={{
                colors: colors.ButtonGradient,
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0 },
              }}
            />
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={colors.ButtonGradient}
              style={{ width: '100%', height: 30, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={[styles.boostText, { color: colors.White }]}>Boost</Text>
            </LinearGradient>
            <Text style={[styles.dayNumber, { color: isDark ? colors.White : colors.Primary }]}>1</Text>
            <Text style={[styles.dayText, { color: colors.TextColor }]}>Day</Text>
            <Text style={[styles.priceText, { color: isDark ? colors.White : colors.Primary }]}>$45</Text>
          </View>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={[styles.benefitsTitle, { color: isDark ? colors.White : colors.Black }]}>
            Benefits of using Boosts
          </Text>
          <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.LightGray }]} />

          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <View style={styles.bulletPointContainer}>
                <Image source={CommonIcons.ic_rocket} style={styles.rocket} />
              </View>
              <Text style={[styles.benefitText, { color: isDark ? colors.White : colors.Black }]}>{benefit}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <GradientButton Title="Boost me" Navigation={handleBoostMe} isLoading={isLoading} Disabled={isLoading} />
        </View>
      </View>
    </Modal>
  );
};

export default BoostModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    borderRadius: 25,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boostImage: {
    width: '100%',
    height: '100%',
  },
  boostCardContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  boostCard: {
    width: 110,
    height: 135,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    // elevation: 3,
  },
  boostText: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  dayNumber: {
    fontSize: 32,
    fontFamily: FONTS.SemiBold,
  },
  dayText: {
    marginBottom: 4,
    fontSize: 15,
    fontFamily: FONTS.Medium,
  },
  priceText: {
    fontSize: 16,
    fontFamily: FONTS.Medium,
  },
  benefitsContainer: {
    width: '100%',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  benefitsTitle: {
    marginBottom: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    marginBottom: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  bulletPointContainer: {
    marginRight: 12,
  },
  bulletPoint: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulletIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  benefitText: {
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 25,
    marginTop: 10,
  },
  rocket: {
    width: 20,
    height: 20,
  },
});
