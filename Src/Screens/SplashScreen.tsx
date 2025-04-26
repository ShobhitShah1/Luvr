import React, { memo, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../Contexts/ThemeContext';
import { FONTS } from '../Common/Theme';
import CommonImages from '../Common/CommonImages';
import { useSelector } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';
import { useLocationPermission } from '../Hooks/useLocationPermission';
import { store } from '../Redux/Store/store';
import { LocalStorageFields } from '../Types/LocalStorageFields';
import { updateField } from '../Redux/Action/actions';
import messaging from '@react-native-firebase/messaging';
import { useCustomToast } from '../Utils/toastUtils';
import { initGoogleSignIn } from '../Services/AuthService';
import { gradientEnd, gradientStart } from '../Config/Setting';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  navigation: NavigationProp<any>;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { isDark, colors } = useTheme();
  const { showToast } = useCustomToast();
  const { checkLocationPermission } = useLocationPermission();
  const ReduxUserData = useSelector((state: any) => state.user);

  useEffect(() => {
    initializeAppFlow();
  }, []);

  const handleNotificationPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      if (authStatus === 1) {
        const Token = await messaging().getToken();
        if (Token) {
          store.dispatch(updateField(LocalStorageFields.notification_token, Token));
        }
      }
    } catch (error) {
      console.error('Notification Permission Error:', error);
    }
  };

  const initializeAppFlow = async () => {
    try {
      await Promise.all([handleNotificationPermission(), initGoogleSignIn()]);

      setTimeout(async () => {
        await determineInitialRoute();
      }, 1500);
    } catch (error) {
      showToast('Error', String(error), 'error');
      navigation.navigate('NumberVerification');
    }
  };

  const determineInitialRoute = async () => {
    try {
      // Check location permission
      const checkLoginPermission = await checkLocationPermission();

      // Validation checks
      const isUserVerified = ReduxUserData?.isVerified;
      const isNumberMissing = !ReduxUserData.mobile_no || ReduxUserData.mobile_no.length === 0;
      const isImageUploaded =
        ReduxUserData?.isImageUploaded ||
        (ReduxUserData?.userData?.recent_pik && ReduxUserData?.userData?.recent_pik?.length !== 0);

      // Navigation decisions
      if (!isUserVerified) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'NumberVerification' }],
        });
        return;
      }

      if (!checkLoginPermission) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LocationStack' }],
        });
        return;
      }

      if (isNumberMissing) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'NumberVerification',
              params: { screen: 'PhoneNumber' },
            },
          ],
        });
        return;
      }

      if (!isImageUploaded) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'LoginStack',
              params: { screen: 'AddRecentPics' },
            },
          ],
        });
        return;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTab' }],
      });
    } catch (error) {
      showToast('Navigation Error', String(error), 'error');
      navigation.navigate('NumberVerification');
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
            <View
              style={[
                styles.appIcon,
                {
                  backgroundColor: colors.White,
                  shadowColor: colors.ShadowColor,
                },
              ]}
            >
              <Text style={[styles.appIconText, { color: colors.Primary }]}>LUVR</Text>
            </View>
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
  coupleContainer: {
    position: 'relative',
    width: width,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coupleImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  person: {
    width: 80,
    height: 120,
    borderRadius: 40,
  },
  personLeft: {
    transform: [{ rotate: '-15deg' }],
    marginRight: -20,
  },
  personRight: {
    transform: [{ rotate: '15deg' }],
    marginLeft: -20,
  },
  heartContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: -20,
  },
  heart: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  bottomImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '30%', // Adjust as needed
  },
});

export default memo(SplashScreen);
