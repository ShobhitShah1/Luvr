import appleAuth, { AppleRequestResponse } from '@invertase/react-native-apple-authentication';
import remoteConfig from '@react-native-firebase/remote-config';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import React, { memo, useEffect, useState } from 'react';
import { Alert, ImageBackground, Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import CommonImages from '../../../Common/CommonImages';
import CommonLogos from '../../../Common/CommonLogos';
import TextString from '../../../Common/TextString';
import LoginButton from '../../../Components/AuthComponents/LoginButton';
import OpenURL from '../../../Components/OpenURL';
import { APP_NAME } from '../../../Config/Setting';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { useThemedStyles } from '../../../Hooks/useThemedStyles';
import { updateField } from '../../../Redux/Action/actions';
import { store } from '../../../Redux/Store/store';
import UserService, { initGoogleSignIn } from '../../../Services/AuthService';
import { transformUserDataForApi } from '../../../Services/dataTransformService';
import { LocalStorageFields } from '../../../Types/LocalStorageFields';
import { ProfileType } from '../../../Types/ProfileType';
import { useCustomToast } from '../../../Utils/toastUtils';
import styles from './styles';

const appleLoginAlert = () => {
  Alert.alert(
    'Remove Apple Sign In for Luvr',
    'To remove Apple Sign In for Luvr, follow these steps:\n\n1. Open the Settings app on your device.\n\n2. Tap on your name at the top of the Settings menu.\n\n3. Select "Password & Security" from the options.\n\n4. Tap on "Apple ID logins".\n\n5. Find "Luvr" in the list of apps and tap on it.\n\n6. Tap "Stop Using Apple ID" to remove Apple Sign In for Luvr.',
    [
      {
        text: 'Go to Settings',
        onPress: () => Linking.openURL('App-Prefs:root=ACCOUNT_SETTINGS'),
      },
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
    ],
    { cancelable: true }
  );
};

const LoginScreen = () => {
  const style = useThemedStyles(styles);
  const { showToast } = useCustomToast();

  const { colors, isDark } = useTheme();

  const dispatch = useDispatch();
  const navigation = useCustomNavigation();
  const userData = useSelector((state: any) => state?.user);

  const [IsSocialLoginLoading, setIsSocialLoginLoading] = useState({
    Google: false,
    Facebook: false,
    Apple: false,
  });

  const [privacyLinks, setPrivacyLinks] = useState<{ [key: string]: string }>({
    PrivacyPolicy: '',
    TermsOfService: '',
    EULA: '',
  });

  const [isFollowTerms, setIsFollowTerms] = useState(false);

  useEffect(() => {
    async function initializeRemoteConfig() {
      await Promise.all([initGoogleSignIn(), RemoteConfig()]);
    }
    initializeRemoteConfig();
  }, []);

  const RemoteConfig = async () => {
    try {
      await remoteConfig().fetchAndActivate();
      const privacyPolicy = remoteConfig().getValue('PrivacyPolicy').asString();
      const termsOfService = remoteConfig().getValue('TermsOfService').asString();
      const EULA = remoteConfig().getValue('EULA').asString();

      setPrivacyLinks({
        PrivacyPolicy: privacyPolicy || '',
        TermsOfService: termsOfService || '',
        EULA: EULA || '',
      });
    } catch (error) {
      console.error('Error fetching remote config', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (!isFollowTerms) {
        showToast('Action Required', 'Please agree to the terms (EULA) to continue.', TextString.error);
        return;
      }

      setIsSocialLoginLoading({ ...IsSocialLoginLoading, Google: true });
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }
      const GoogleUserData = await GoogleSignin.signIn();

      await Promise.all([
        dispatch(updateField(LocalStorageFields.identity, GoogleUserData.user.email)),
        dispatch(updateField(LocalStorageFields.email, GoogleUserData.user.email)),
        dispatch(updateField(LocalStorageFields.full_name, GoogleUserData.user.familyName || '')),
        dispatch(updateField(LocalStorageFields.login_type, 'social')),
      ]);
      handleNavigation(GoogleUserData.user.email, GoogleUserData.user.name || GoogleUserData.user.givenName || '');
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        showToast('Error!', 'You cancelled the login flow', 'error');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        showToast('Error!', 'Operation is in progress already', 'error');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        showToast('Error!', 'Play services not available or outdated', 'error');
      } else {
        showToast('Error!', String(error?.message || error) || 'An error occurred during Google login', 'error');
      }
      setIsSocialLoginLoading({ ...IsSocialLoginLoading, Google: false });
    }
  };

  const handleAppleLogin = async () => {
    if (!isFollowTerms) {
      showToast('Action Required', 'Please agree to the terms (EULA) to continue.', TextString.error);
      return;
    }

    setIsSocialLoginLoading({ ...IsSocialLoginLoading, Apple: true });

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      if (credentialState === appleAuth.State.AUTHORIZED) {
        handleAppleLoginResponse(appleAuthRequestResponse);
      } else {
        setIsSocialLoginLoading({ ...IsSocialLoginLoading, Apple: false });
      }
    } catch (error) {
      showToast('Error!', String(error) || 'An error occurred during Apple login', 'error');
      setIsSocialLoginLoading({ ...IsSocialLoginLoading, Apple: false });
    }
  };

  const handleAppleLoginResponse = async (appleAuthRequestResponse: AppleRequestResponse) => {
    try {
      const { email, fullName, user } = appleAuthRequestResponse;
      const name = fullName?.givenName || fullName?.familyName;

      await Promise.all([
        dispatch(updateField(LocalStorageFields.apple_id, user)),
        dispatch(updateField(LocalStorageFields.login_type, 'social')),
      ]);

      if (email && name) {
        await Promise.all([
          dispatch(updateField(LocalStorageFields.identity, email)),
          dispatch(updateField(LocalStorageFields.email, email)),
          dispatch(updateField(LocalStorageFields.full_name, name)),
        ]);

        handleNavigation(email, name);
      } else {
        const userDataForApi = transformUserDataForApi(userData);
        const userDataWithValidation = {
          ...userDataForApi,
          eventName: 'app_user_register_social',
          login_type: 'social',
          validation: true,
          apple_id: user,
        };

        const APIResponse = await UserService.UserRegister(userDataWithValidation);

        if (APIResponse?.data?.token) {
          await Promise.all([
            dispatch(updateField(LocalStorageFields.Token, APIResponse.data.token)),
            dispatch(updateField(LocalStorageFields.isVerified, true)),
          ]);

          CheckDataAndNavigateToNumber();
        } else {
          navigation?.replace('NumberVerification', {
            screen: 'PhoneNumber',
          });
        }
      }

      setIsSocialLoginLoading({
        ...IsSocialLoginLoading,
        Apple: false,
      });
    } catch (error: any) {
      appleLoginAlert();
      setIsSocialLoginLoading({
        ...IsSocialLoginLoading,
        Apple: false,
      });
      showToast('Error!', String(error?.message || error) || 'An error occurred during Apple login', 'error');
    }
  };

  const handleNavigation = async (email: string, name: string) => {
    try {
      const userDataForApi = transformUserDataForApi(userData);
      const userDataWithValidation = {
        ...userDataForApi,
        eventName: 'app_user_register_social',
        login_type: 'social',
        validation: true,
        identity: email,
        full_name: name,
      };

      const APIResponse = await UserService.UserRegister(userDataWithValidation);

      const token = APIResponse?.data?.token || '';

      if (token) {
        await Promise.all([
          dispatch(updateField(LocalStorageFields.Token, token)),
          dispatch(updateField(LocalStorageFields.isVerified, true)),
        ]);

        CheckDataAndNavigateToNumber();
      } else {
        throw new Error('Token not found in API response');
      }
    } catch (error) {
      //* If Token Not Get From API User Not Filled Information!
      navigation?.replace('NumberVerification', {
        screen: 'PhoneNumber',
      });
      setIsSocialLoginLoading({
        ...IsSocialLoginLoading,
        Google: false,
        Apple: false,
      });
    }
  };

  const CheckDataAndNavigateToNumber = async () => {
    try {
      const userDataToSend = { eventName: 'get_profile' };

      const APIResponse = await UserService.UserRegister(userDataToSend);
      const data: ProfileType = APIResponse?.data;

      if (data.mobile_no) {
        navigation?.replace('BottomTab');
      } else if (
        data.identity.length === 0 ||
        (store.getState().user?.identity && store.getState().user?.identity?.length === 0)
      ) {
        navigation?.replace('LoginStack', {
          screen: 'AddEmail',
        });
      } else {
        navigation?.replace('NumberVerification', {
          screen: 'PhoneNumber',
        });
      }
    } catch (error) {
      showToast(TextString.error.toUpperCase(), String(error), 'error');
    } finally {
      setIsSocialLoginLoading({
        ...IsSocialLoginLoading,
        Google: false,
        Apple: false,
      });
    }
  };

  return (
    <ImageBackground
      resizeMode="cover"
      resizeMethod="resize"
      source={CommonImages.LoginBackground}
      style={style.Container}
    >
      <ScrollView bounces={false} style={style.ContentView} contentContainerStyle={style.ScrollViewContainContainer}>
        <View style={style.AppNameTitleView}>
          <Text style={style.AppNameTitle}>Welcome to the {APP_NAME}</Text>
        </View>
        <LinearGradient
          colors={isDark ? colors.BackgroundGradient : ['rgba(29,18,68,0.6)', 'rgba(8,2,29,1)']}
          style={{
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 1,
            opacity: isDark ? 0.9 : 1,
          }}
        />

        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={
            isDark
              ? ['rgba(183, 34, 97, 1)', 'rgba(141, 71, 242, 1)']
              : ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.2)']
          }
          style={style.LoginBoxContainer}
        >
          <View>
            <View style={style.LoginAndSignInTitleTextView}>
              <Text style={style.LoginTitleText}>Login</Text>
              <Text style={style.SignInTitleText}>Sign in to continue</Text>
            </View>

            <View style={style.ButtonView}>
              <LoginButton
                IsLoading={false}
                Title="LOGIN WITH PHONE NUMBER"
                Icon={CommonLogos.NumberLogin}
                onPress={() => {
                  if (!isFollowTerms) {
                    showToast('Action Required', 'Please agree to the terms (EULA) to continue.', TextString.error);
                    return;
                  }
                  navigation.navigate('NumberVerification', {
                    screen: 'PhoneNumber',
                  });
                }}
              />
              <LoginButton
                IsLoading={IsSocialLoginLoading.Google}
                Title="LOGIN WITH GOOGLE"
                Icon={CommonLogos.GoogleLogo}
                onPress={() => {
                  handleGoogleLogin();
                }}
              />
              {Platform.OS === 'ios' && (
                <LoginButton
                  IsLoading={IsSocialLoginLoading.Apple}
                  Title="LOGIN WITH APPLE"
                  Icon={CommonLogos.AppleLoginLogo}
                  onPress={() => {
                    handleAppleLogin();
                  }}
                />
              )}
            </View>

            <View style={style.TermsView}>
              <Pressable
                onPress={() => setIsFollowTerms(!isFollowTerms)}
                style={[style.FollowButtonView, { marginRight: 10 }]}
              >
                {isFollowTerms && <Text style={{ color: colors.White, fontSize: 13 }}>✓</Text>}
              </Pressable>
              <Text style={style.TermsViewText}>
                By Login, you agree to our{' '}
                <Text
                  onPress={() => {
                    if (privacyLinks?.EULA) {
                      OpenURL({ URL: String(privacyLinks?.EULA) });
                    }
                  }}
                  style={style.UnderLineText}
                >
                  EULA
                </Text>
                {', '}
                <Text
                  onPress={() => {
                    if (privacyLinks?.TermsOfService) {
                      OpenURL({ URL: String(privacyLinks?.TermsOfService) });
                    }
                  }}
                  style={style.UnderLineText}
                >
                  Terms of Service
                </Text>{' '}
                and
                <Text
                  onPress={() => {
                    if (privacyLinks?.PrivacyPolicy) {
                      OpenURL({ URL: String(privacyLinks?.PrivacyPolicy) });
                    }
                  }}
                  style={style.UnderLineText}
                >
                  {' '}
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </ImageBackground>
  );
};

export default memo(LoginScreen);
