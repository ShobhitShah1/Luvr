import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useEffect, useState} from 'react';
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CommonImages from '../../../Common/CommonImages';
import CommonLogos from '../../../Common/CommonLogos';
import LoginButton from '../../../Components/AuthComponents/LoginButton';
import {updateField} from '../../../Redux/Action/userActions';
import UserService, {initGoogleSignIn} from '../../../Services/AuthService';
import {transformUserDataForApi} from '../../../Services/dataTransformService';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useCustomToast} from '../../../Utils/toastUtils';
import styles from './styles';
// import {AccessToken, LoginManager, Settings} from 'react-native-fbsdk-next';
import remoteConfig from '@react-native-firebase/remote-config';
import OpenURL from '../../../Components/OpenURL';
import {APP_NAME} from '../../../Config/Setting';
import {ProfileType} from '../../../Types/ProfileType';
import appleAuth from '@invertase/react-native-apple-authentication';

const LoginScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{NumberVerification: {}}>>();
  const {showToast} = useCustomToast();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state?.user);
  const [IsSocialLoginLoading, setIsSocialLoginLoading] = useState({
    Google: false,
    Facebook: false,
    Apple: false,
  });
  const [privacyLinks, setPrivacyLinks] = useState<{[key: string]: string}>({
    PrivacyPolicy: '',
    TermsOfService: '',
  });

  useEffect(() => {
    async function initializeRemoteConfig() {
      await Promise.all([
        initGoogleSignIn(),
        RemoteConfig(),
      ]);
    }
    initializeRemoteConfig();
  }, []);

  const RemoteConfig = async () => {
    try {
      await remoteConfig().fetchAndActivate();
      const privacyPolicy = remoteConfig().getValue('PrivacyPolicy').asString();
      const termsOfService = remoteConfig()
        .getValue('TermsOfService')
        .asString();

      // Validate fetched config values before setting state
      if (validateConfig(privacyPolicy) && validateConfig(termsOfService)) {
        setPrivacyLinks({
          PrivacyPolicy: privacyPolicy,
          TermsOfService: termsOfService,
        });
      } else {
        console.log('Invalid config values');
      }
    } catch (error) {
      console.error('Error fetching remote config', error);
    }
  };

  // Example validation function, you can adjust it based on your requirements
  const validateConfig = (configValue: string): boolean => {
    // Add your validation logic here, e.g., check if configValue is not empty
    return configValue.trim().length > 0;
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('Initiating Google login...');
      setIsSocialLoginLoading({...IsSocialLoginLoading, Google: true});

      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }
      const GoogleUserData = await GoogleSignin.signIn();
      console.log('Updating fields and navigating...');
      await Promise.all([
        dispatch(
          updateField(LocalStorageFields.identity, GoogleUserData.user.email),
        ),
        dispatch(
          updateField(LocalStorageFields.email, GoogleUserData.user.email),
        ),
        dispatch(updateField(LocalStorageFields.login_type, 'social')),
      ]);

      console.log(GoogleUserData.user.email);

      handleNavigation(
        GoogleUserData.user.email,
        GoogleUserData.user.name || GoogleUserData.user.givenName || '',
      );
    } catch (error: any) {
      console.log('Google Login:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        showToast('Error!', 'You cancelled the login flow', 'error');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        showToast('Error!', 'Operation is in progress already', 'error');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        showToast('Error!', 'Play services not available or outdated', 'error');
      } else {
        showToast('Error!', 'An error occurred during Google login', 'error');
      }
      setIsSocialLoginLoading({...IsSocialLoginLoading, Google: false});
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

      console.log('userDataWithValidation', userDataWithValidation);

      const APIResponse = await UserService.UserRegister(
        userDataWithValidation,
      );

      console.log('API Response:', APIResponse);

      if (APIResponse?.data?.token) {
        await Promise.all([
          dispatch(
            updateField(LocalStorageFields.Token, APIResponse.data.token),
          ),
          dispatch(updateField(LocalStorageFields.isVerified, true)),
        ]);
        console.log('REDUX:', userData);
        CheckDataAndNavigateToNumber();
      } else {
        throw new Error('Token not found in API response');
      }
    } catch (error) {
      console.error('Navigation error:', error);

      //* If Token Not Get From API User Not Filled Information!
      navigation?.replace('NumberVerification', {
        screen: 'PhoneNumber',
      });
      console.log('REDUX:', userData);

      setIsSocialLoginLoading({...IsSocialLoginLoading, Google: false});
      setIsSocialLoginLoading({...IsSocialLoginLoading, Apple: false});
    }
  };

  const CheckDataAndNavigateToNumber = async () => {
    try {
      const userDataToSend = {
        eventName: 'get_profile',
      };
      const APIResponse = await UserService.UserRegister(userDataToSend);
      const Data: ProfileType = APIResponse?.data;
      console.log('Data.mobile_no:', Data, Data.mobile_no);
      if (Data.mobile_no) {
        navigation?.replace('BottomTab');
      } else {
        navigation?.replace('NumberVerification', {
          screen: 'PhoneNumber',
        });
      }
    } catch {
      console.log('Error in CheckDataAndNavigateToNumber');
    } finally {
      setIsSocialLoginLoading({...IsSocialLoginLoading, Google: false});
      setIsSocialLoginLoading({...IsSocialLoginLoading, Apple: false});
    }
  };

  const handleAppleLogin = async () => {
    setIsSocialLoginLoading({...IsSocialLoginLoading, Apple: true});

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        if (
          appleAuthRequestResponse.email &&
          (appleAuthRequestResponse.fullName?.givenName ||
            appleAuthRequestResponse.fullName?.familyName)
        ) {
          handleNavigation(
            appleAuthRequestResponse.email,
            appleAuthRequestResponse.fullName?.givenName ||
              appleAuthRequestResponse.fullName?.familyName ||
              '',
          );
        }
      }
    } catch (error) {
      console.log('ERROR:', error);
      setIsSocialLoginLoading({...IsSocialLoginLoading, Apple: false});
    }
  };

  return (
    <ImageBackground
      resizeMode="cover"
      resizeMethod="resize"
      source={CommonImages.WelcomeBackground}
      style={styles.Container}
      imageStyle={styles.BGImageStyle}>
      <StatusBar backgroundColor={'#843841'} barStyle="light-content" />
      <SafeAreaView />
      <ScrollView
        bounces={false}
        style={styles.ContentView}
        contentContainerStyle={styles.ScrollViewContainContainer}>
        <View style={styles.AppNameTitleView}>
          <Text style={styles.AppNameTitle}>Welcome to the {APP_NAME}</Text>
        </View>

        <View style={styles.LoginBoxContainer}>
          <View style={styles.LoginAndSignInTitleTextView}>
            <Text style={styles.LoginTitleText}>Login</Text>
            <Text style={styles.SignInTitleText}>Sign in to continue</Text>
          </View>

          <View style={styles.ButtonView}>
            <LoginButton
              IsLoading={false}
              Title="LOGIN WITH PHONE NUMBER"
              Icon={CommonLogos.EmailLoginLogo}
              onPress={() => {
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
            {/* <LoginButton
              IsLoading={IsSocialLoginLoading.Facebook}
              Title="LOGIN WITH FACEBOOK"
              Icon={CommonLogos.FacebookLogo}
              onPress={() => {
                // navigation.navigate('NumberVerification', {
                //   screen: 'PhoneNumber',
                // });
                handleFacebookLogin();
              }}
            /> */}
          </View>

          <View style={styles.TermsView}>
            <Text style={styles.TermsViewText}>
              By Login, you agree to our{'\n'}
              <Text
                onPress={() => {
                  if (privacyLinks?.TermsOfService) {
                    OpenURL({URL: String(privacyLinks?.TermsOfService)});
                  }
                }}
                style={styles.UnderLineText}>
                Terms of Service
              </Text>{' '}
              and
              <Text
                onPress={() => {
                  if (privacyLinks?.PrivacyPolicy) {
                    OpenURL({URL: String(privacyLinks?.PrivacyPolicy)});
                  }
                }}
                style={styles.UnderLineText}>
                {' '}
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
export default LoginScreen;
