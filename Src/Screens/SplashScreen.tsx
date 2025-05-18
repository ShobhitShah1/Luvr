import messaging from '@react-native-firebase/messaging';
import { NavigationProp } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import CommonImages from '../Common/CommonImages';
import CommonLogos from '../Common/CommonLogos';
import { FONTS } from '../Common/Theme';
import { gradientEnd, gradientStart } from '../Config/Setting';
import { useTheme } from '../Contexts/ThemeContext';
import { useLocationPermission } from '../Hooks/useLocationPermission';
import { updateField } from '../Redux/Action/actions';
import { store } from '../Redux/Store/store';
import { initGoogleSignIn } from '../Services/AuthService';
import { LocalStorageFields } from '../Types/LocalStorageFields';
import { useCustomToast } from '../Utils/toastUtils';

interface SplashScreenProps {
  navigation: NavigationProp<any>;
}

enum NavigationDestination {
  NUMBER_VERIFICATION = 'NumberVerification',
  LOCATION_STACK = 'LocationStack',
  LOGIN_STACK = 'LoginStack',
  BOTTOM_TAB = 'BottomTab',
}

enum InitializationStep {
  NOTIFICATIONS = 'notifications',
  GOOGLE_SIGN_IN = 'googleSignIn',
  LOCATION_PERMISSION = 'locationPermission',
  USER_VERIFICATION = 'userVerification',
  PHONE_NUMBER = 'phoneNumber',
  PROFILE_IMAGE = 'profileImage',
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { isDark, colors } = useTheme();
  const { showToast } = useCustomToast();
  const { checkLocationPermission } = useLocationPermission();

  const userStoreData = useSelector((state: any) => state.user);
  const [initializationStatus, setInitializationStatus] = useState<Record<InitializationStep, boolean>>({
    [InitializationStep.NOTIFICATIONS]: false,
    [InitializationStep.GOOGLE_SIGN_IN]: false,
    [InitializationStep.LOCATION_PERMISSION]: false,
    [InitializationStep.USER_VERIFICATION]: false,
    [InitializationStep.PHONE_NUMBER]: false,
    [InitializationStep.PROFILE_IMAGE]: false,
  });

  // For debugging - logs the current initialization state
  const logInitializationState = (step: InitializationStep, success: boolean, details?: any) => {
    console.log(`[SplashScreen] ${step}: ${success ? 'SUCCESS' : 'FAILED'}`, details || '');
    setInitializationStatus((prev) => ({
      ...prev,
      [step]: success,
    }));
  };

  useEffect(() => {
    initializeAppFlow();
  }, []);

  useEffect(() => {
    const handleInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log('SPLASH: App opened with URL:', initialUrl);
      }
    };

    handleInitialUrl();
  }, []);

  const handleNotificationPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      if (authStatus === 1) {
        const Token = await messaging().getToken();
        if (Token) {
          store.dispatch(updateField(LocalStorageFields.notification_token, Token));
          logInitializationState(InitializationStep.NOTIFICATIONS, true, { token: Token });
          return true;
        }
      }
      logInitializationState(InitializationStep.NOTIFICATIONS, false, { authStatus });
      return false;
    } catch (error) {
      logInitializationState(InitializationStep.NOTIFICATIONS, false, { error: String(error) });
      console.error('[SplashScreen] Notification Permission Error:', error);
      return false;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await initGoogleSignIn();
      logInitializationState(InitializationStep.GOOGLE_SIGN_IN, true);
      return true;
    } catch (error) {
      logInitializationState(InitializationStep.GOOGLE_SIGN_IN, false, { error: String(error) });
      console.error('[SplashScreen] Google Sign In Error:', error);
      return false;
    }
  };

  const handleLocationPermission = async () => {
    try {
      const isLocationEnabled = await checkLocationPermission();
      logInitializationState(InitializationStep.LOCATION_PERMISSION, isLocationEnabled);
      return isLocationEnabled;
    } catch (error) {
      logInitializationState(InitializationStep.LOCATION_PERMISSION, false, { error: String(error) });
      console.error('[SplashScreen] Location Permission Error:', error);
      return false;
    }
  };

  const checkUserVerification = () => {
    const isVerified = !!userStoreData?.isVerified;
    logInitializationState(InitializationStep.USER_VERIFICATION, isVerified);
    return isVerified;
  };

  const checkPhoneNumber = () => {
    const hasPhoneNumber = !(!userStoreData.mobile_no || userStoreData.mobile_no.length === 0);
    logInitializationState(InitializationStep.PHONE_NUMBER, hasPhoneNumber, {
      number: hasPhoneNumber ? 'present' : 'missing',
    });
    return hasPhoneNumber;
  };

  const checkProfileImage = () => {
    const hasImage =
      userStoreData?.isImageUploaded ||
      (userStoreData?.userData?.recent_pik && userStoreData?.userData?.recent_pik?.length !== 0);
    logInitializationState(InitializationStep.PROFILE_IMAGE, hasImage);
    return hasImage;
  };

  const navigateToDestination = (destination: NavigationDestination, params?: object) => {
    console.log(`[SplashScreen] Navigating to ${destination}`, params || '');
    navigation.reset({
      index: 0,
      routes: [{ name: destination, ...(params && { params }) }],
    });
  };

  const initializeAppFlow = async () => {
    try {
      console.log('[SplashScreen] Starting app initialization');

      await handleNotificationPermission();
      await handleGoogleSignIn();

      if (!checkUserVerification()) {
        navigateToDestination(NavigationDestination.NUMBER_VERIFICATION);
        return;
      }

      const locationEnabled = await handleLocationPermission();
      if (!locationEnabled) {
        navigateToDestination(NavigationDestination.LOCATION_STACK);
        return;
      }

      if (!checkPhoneNumber()) {
        navigateToDestination(NavigationDestination.NUMBER_VERIFICATION, {
          screen: 'PhoneNumber',
        });
        return;
      }

      if (!checkProfileImage()) {
        navigateToDestination(NavigationDestination.LOGIN_STACK, {
          screen: 'AddRecentPics',
        });
        return;
      }

      navigateToDestination(NavigationDestination.BOTTOM_TAB);
    } catch (error) {
      console.error('[SplashScreen] Initialization Error:', error);
      showToast('Initialization Error', `Could not complete setup: ${String(error)}`, 'error');

      if (!initializationStatus[InitializationStep.USER_VERIFICATION]) {
        navigateToDestination(NavigationDestination.NUMBER_VERIFICATION);
      } else if (!initializationStatus[InitializationStep.LOCATION_PERMISSION]) {
        navigateToDestination(NavigationDestination.LOCATION_STACK);
      } else if (!initializationStatus[InitializationStep.PHONE_NUMBER]) {
        navigateToDestination(NavigationDestination.NUMBER_VERIFICATION, { screen: 'PhoneNumber' });
      } else {
        navigateToDestination(NavigationDestination.NUMBER_VERIFICATION);
      }
    }
  };

  const backgroundImage = isDark ? CommonImages.dark_splash_bg : CommonImages.light_splash_bg;

  return (
    <View style={styles.container}>
      <LinearGradient
        start={gradientStart}
        end={gradientEnd}
        colors={isDark ? ['#1A0933', '#170729', '#230D45'] : ['#744DFD', '#5F3BDD4D']}
        style={styles.gradientBackground}
      >
        <View style={styles.contentContainer}>
          <View style={styles.appIconContainer}>
            <Image source={CommonLogos.AppIcon} style={styles.appIcon} />
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.appTitle, { color: colors.White }]}>LUVR</Text>
            <Text style={[styles.appSubtitle, { color: colors.White }]}>The Dating App</Text>
          </View>
        </View>
      </LinearGradient>

      <Image source={backgroundImage} style={styles.bottomImage} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradientBackground: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIconContainer: {
    marginBottom: 20,
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appIconText: {
    fontFamily: FONTS.Bold,
    fontSize: 24,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 32,
    marginBottom: 5,
  },
  appSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 16,
  },
  bottomImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '30%',
  },
});

export default memo(SplashScreen);
