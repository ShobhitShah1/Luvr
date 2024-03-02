import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useEffect, useState} from 'react';
import {ImageBackground, ScrollView, StatusBar, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CommonImages from '../../../Common/CommonImages';
import CommonLogos from '../../../Common/CommonLogos';
import LoginButton from '../../../Components/AuthComponents/LoginButton';
import {updateField} from '../../../Redux/Action/userActions';
import UserService from '../../../Services/AuthService';
import {transformUserDataForApi} from '../../../Services/dataTransformService';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useCustomToast} from '../../../Utils/toastUtils';
import styles from './styles';
import {AccessToken, LoginManager, Settings} from 'react-native-fbsdk-next';
import ApiConfig from '../../../Config/ApiConfig';

const LoginScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{NumberVerification: {}}>>();
  const {showToast} = useCustomToast();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state?.user);
  const [IsSocialLoginLoading, setIsSocialLoginLoading] = useState({
    Google: false,
    Facebook: false,
  });

  useEffect(() => {
    Settings.setAppID('1072075284080018');
    Settings.initializeSDK();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      console.log('Initiating Google login...');
      setIsSocialLoginLoading({...IsSocialLoginLoading, Google: true});

      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const GoogleUserData = await GoogleSignin.signIn();
      console.log('Google login successful:', GoogleUserData);

      // Proceed with your logic for successful login
      console.log('Updating fields and navigating...');
      handleNavigation(
        GoogleUserData.user.email,
        GoogleUserData.user.name || GoogleUserData.user.givenName || '',
      );
    } catch (error: any) {
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

  const handleFacebookLogin = async () => {
    try {
      LoginManager.logInWithPermissions(['public_profile']).then(
        function (result) {
          if (result.isCancelled) {
            console.log('Login cancelled');
          } else {
            console.log(
              'Login success with permissions: ' +
                result?.grantedPermissions?.toString(),
            );

            AccessToken.getCurrentAccessToken().then(data => {
              console.log('Facebook Data:', data);
              if (data?.accessToken) {
                fetch(ApiConfig.FACEBOOK_GRAPH_API + data.accessToken)
                  .then(response => response.json())
                  .then(json => {
                    console.log('FACEBOOK JSON DATA:', json);
                    // handleNavigation(
                    //   GoogleUserData.user.email,
                    //   GoogleUserData.user.name ||
                    //     GoogleUserData.user.givenName ||
                    //     '',
                    // );
                  })
                  .catch(() => {
                    console.error('ERROR GETTING DATA FROM FACEBOOK');
                  });
              } else {
                showToast('Error', 'Could not get access token', 'error');
              }
            });
          }
        },
        function (error) {
          console.log('Login fail with error: ' + error);
        },
      );
    } catch (error) {
      console.log('Facebook Login Error', error);
      showToast('Error', String(error || 'Facebook Login Error'), 'error');
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

      const APIResponse = await UserService.UserRegister(
        userDataWithValidation,
      );

      if (APIResponse?.data?.token) {
        await dispatch(
          updateField(LocalStorageFields.Token, APIResponse.data.token),
        );
        await dispatch(updateField(LocalStorageFields.isVerified, true));
        navigation.replace('BottomTab');
      } else {
        throw new Error('Token not found in API response');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      navigation.replace('LoginStack');
    } finally {
      setIsSocialLoginLoading({...IsSocialLoginLoading, Google: false});
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
      <ScrollView
        bounces={false}
        style={styles.ContentView}
        contentContainerStyle={styles.ScrollViewContainContainer}>
        <View style={styles.AppNameTitleView}>
          <Text style={styles.AppNameTitle}>Welcome to the{'\n'}App Name</Text>
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
            <LoginButton
              IsLoading={IsSocialLoginLoading.Facebook}
              Title="LOGIN WITH FACEBOOK"
              Icon={CommonLogos.FacebookLogo}
              onPress={() => {
                // navigation.navigate('NumberVerification', {
                //   screen: 'PhoneNumber',
                // });
                handleFacebookLogin();
              }}
            />
          </View>

          <View style={styles.TermsView}>
            <Text style={styles.TermsViewText}>
              By Login, you agree to our{'\n'}
              <Text style={styles.UnderLineText}>Terms of Service</Text> and
              <Text style={styles.UnderLineText}> Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
export default LoginScreen;
