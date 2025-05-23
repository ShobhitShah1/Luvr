import messaging from '@react-native-firebase/messaging';
import type { NavigationProp } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

import { DeepLinkEvent } from '../../App';
import CommonImages from '../Common/CommonImages';
import CommonLogos from '../Common/CommonLogos';
import { FONTS } from '../Common/Theme';
import { gradientEnd, gradientStart } from '../Config/Setting';
import { useTheme } from '../Contexts/ThemeContext';
import { useLocationPermission } from '../Hooks/useLocationPermission';
import { updateField, setDeepLinkUrl } from '../Redux/Action/actions';
import { store } from '../Redux/Store/store';
import { navigationRef } from '../Routes/RootNavigation';
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
  const [initializationStatus, setInitializationStatus] = useState<
    Record<InitializationStep, boolean>
  >({
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
    setInitializationStatus(prev => ({
      ...prev,
      [step]: success,
    }));
  };

  useEffect(() => {
    initializeAppFlow();
  }, []);

  const handleDeepLinkNavigation = useCallback((url: string) => {
    if (!navigationRef?.current) {
      return;
    }

    try {
      // Validate URL format
      if (!url || typeof url !== 'string') {
        console.error('Invalid deep link URL');

        return;
      }

      // Extract and validate profile ID
      const profileId = url.split('/').pop();
      if (!profileId) {
        console.error('Invalid profile ID in deep link');

        return;
      }

      // Create navigation state with proper history
      const navigationState = {
        index: 1,
        routes: [
          { name: 'BottomTab' },
          {
            name: url.includes('app/profile') ? 'ExploreCardDetail' : 'Chat',
            params: { id: profileId },
          },
        ],
      };

      // Apply navigation state
      navigationRef.reset(navigationState);
    } catch (error) {
      console.error('Error handling deep link navigation:', error);
      // Fallback to BottomTab if navigation fails
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'BottomTab' }],
      });
    }
  }, []);

  const navigateToDestination = (destination: NavigationDestination, params?: object) => {
    console.log(`[SplashScreen] Navigating to ${destination}`, params || '');

    // Check if we have a deep link URL to handle
    const deepLinkUrl = store.getState().user?.deepLinkUrl;

    if (deepLinkUrl && destination === NavigationDestination.BOTTOM_TAB) {
      // Clear the deep link URL from Redux
      store.dispatch(setDeepLinkUrl(null));

      // Validate user state before deep link navigation
      if (!userStoreData?.isVerified || !userStoreData?.mobile_no) {
        console.log('User not verified or missing phone number, skipping deep link');
        navigation.reset({
          index: 0,
          routes: [{ name: destination, ...(params && { params }) }],
        });

        return;
      }

      // Navigate to the deep link destination
      handleDeepLinkNavigation(deepLinkUrl);
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: destination, ...(params && { params }) }],
      });
    }
  };

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
      logInitializationState(InitializationStep.LOCATION_PERMISSION, false, {
        error: String(error),
      });

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
  appIcon: {
    alignItems: 'center',
    borderRadius: 20,
    elevation: 3,
    height: 100,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 100,
  },
  appIconContainer: {
    marginBottom: 20,
  },
  appIconText: {
    fontFamily: FONTS.Bold,
    fontSize: 24,
  },
  appSubtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 16,
  },
  appTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 32,
    marginBottom: 5,
  },
  bottomImage: {
    bottom: 0,
    height: '30%',
    left: 0,
    position: 'absolute',
    right: 0,
    width: '100%',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  gradientBackground: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
});

export default memo(SplashScreen);
