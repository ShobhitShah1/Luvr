import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, deviceHeightWithStatusbar } from '../Common/Theme';
import { gradientEnd, gradientStart } from '../Config/Setting';
import { useTheme } from '../Contexts/ThemeContext';
import { setAgeVerified } from '../Redux/Action/actions';
import { RootState } from '../Redux/Store/store';
import { BlurredBackdrop } from './BlurredBackdrop';

const AGE_VERIFICATION_KEY = '@age_verification_status';

const AgeVerificationModal: React.FC = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const isAgeVerified = useSelector((state: RootState) => state.user.isAgeVerified);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAgeVerificationStatus();
  }, []);

  const checkAgeVerificationStatus = async () => {
    try {
      const storedStatus = await AsyncStorage.getItem(AGE_VERIFICATION_KEY);
      if (storedStatus === 'true') {
        dispatch(setAgeVerified(true));
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      await AsyncStorage.setItem(AGE_VERIFICATION_KEY, 'true');
      dispatch(setAgeVerified(true));
    } catch (error) {}
  };

  const handleDecline = () => {
    BackHandler.exitApp();
  };

  if (isLoading) {
    return null;
  }

  return (
    <Modal
      isVisible={!isAgeVerified}
      useNativeDriver={true}
      deviceHeight={deviceHeightWithStatusbar}
      statusBarTranslucent={true}
      useNativeDriverForBackdrop={true}
      hasBackdrop={true}
      onBackButtonPress={handleDecline}
      customBackdrop={<BlurredBackdrop toggleModal={handleDecline} />}
    >
      <View style={[styles.container, { backgroundColor: isDark ? 'rgba(18, 18, 19, 0.7)' : colors.White }]}>
        <SafeAreaView style={{ flex: 1 }}>
          <View>
            <View style={styles.titleView}>
              <Text style={[styles.titleText, { color: colors.TitleText }]}>Age Verification</Text>
            </View>
            <Text style={[styles.titleSubText, { color: colors.TextColor }]}>
              This app contains content suitable for individuals aged 18 and above. By proceeding, you confirm that you
              are at least 18 years old.
            </Text>
          </View>

          <View style={styles.contentContainer}>
            <View style={[styles.infoBox, { backgroundColor: isDark ? 'transparent' : colors.lightFiledBackground }]}>
              <Text style={[styles.infoText, { color: colors.TextColor }]}>
                Please verify your age to continue using the app. This helps us maintain a safe and appropriate
                environment for all users.
              </Text>
            </View>
          </View>

          <View style={styles.buttonView}>
            <LinearGradient
              start={gradientStart}
              end={gradientEnd}
              colors={colors.ButtonGradient}
              style={styles.confirmButtonView}
            >
              <Pressable onPress={handleConfirm} style={styles.confirmButton}>
                <Text style={[styles.confirmButtonText, { color: isDark ? colors.TextColor : colors.White }]}>
                  I'm 18 or older
                </Text>
              </Pressable>
            </LinearGradient>

            <Pressable onPress={handleDecline} style={styles.declineButtonView}>
              <Text style={[styles.declineButtonText, { color: colors.TitleText }]}>I'm under 18</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '45%',
    overflow: 'hidden',
    borderRadius: 20,
    paddingVertical: 10,
  },
  titleView: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  titleText: {
    left: 5,
    fontSize: 20,
    zIndex: 9999,
    fontFamily: FONTS.Bold,
  },
  titleSubText: {
    marginTop: 3,
    zIndex: 9999,
    opacity: 0.8,
    width: '90%',
    fontSize: 13.5,
    marginBottom: 8,
    textAlign: 'center',
    alignSelf: 'center',
    color: COLORS.DescriptionGray,
    fontFamily: FONTS.SemiBold,
  },
  closeModalIconView: {
    zIndex: 9999,
  },
  closeModalIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  infoBox: {
    width: '100%',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.Primary,
  },
  infoText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: FONTS.Medium,
  },
  buttonView: {
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  confirmButtonView: {
    width: 200,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  confirmButtonText: {
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
  },
  declineButtonView: {
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButtonText: {
    textAlign: 'center',
    color: COLORS.Primary,
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
  },
});

export default AgeVerificationModal;
