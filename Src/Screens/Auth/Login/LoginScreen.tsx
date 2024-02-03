import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {ImageBackground, ScrollView, StatusBar, Text, View} from 'react-native';
import CommonImages from '../../../Common/CommonImages';
import CommonLogos from '../../../Common/CommonLogos';
import LoginButton from '../../../Components/AuthComponents/LoginButton';
import styles from './styles';
import UserService, {signInWithGoogle} from '../../../Services/AuthService';
import {useDispatch, useSelector} from 'react-redux';
import {updateField} from '../../../Redux/Action/userActions';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useCustomToast} from '../../../Utils/toastUtils';
import {transformUserDataForApi} from '../../../Services/dataTransformService';

const LoginScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{NumberVerification: {}}>>();
  const {showToast} = useCustomToast();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state?.user);

  const handleGoogleLogin = async () => {
    const GoogleData = await signInWithGoogle();
    // console.log('GoogleData', GoogleData);
    const GoogleUserData = GoogleData?.user;
    if (GoogleUserData) {
      console.log('GoogleUserData', GoogleUserData);
      await Promise.all([
        dispatch(
          updateField(LocalStorageFields.identity, GoogleUserData.email),
        ),
        dispatch(
          updateField(
            LocalStorageFields.full_name,
            GoogleUserData.name || GoogleUserData.givenName,
          ),
        ),
        dispatch(updateField(LocalStorageFields.login_type, 'social')),
        dispatch(
          updateField(LocalStorageFields.eventName, 'app_user_register_social'),
        ),
        dispatch(updateField(LocalStorageFields.isVerified, true)),
      ]);

      // API Go Here
      setTimeout(() => {
        handleNavigation(
          GoogleUserData.email,
          GoogleUserData.name || GoogleUserData.givenName || '',
        );
      }, 0);
    } else {
      // showToast(
      //   'Error!',
      //   'Something went wrong while fetching your data',
      //   'error',
      // );
    }
  };

  const handleNavigation = async (email: string, name: string) => {
    const userDataForApi = transformUserDataForApi(userData);
    console.log('userDataForApi', userDataForApi);

    const userDataWithValidation = {
      ...userDataForApi,
      eventName: 'app_user_register_social',
      login_type: 'social',
      validation: true,
      identity: email,
      full_name: name,
    };

    console.log('userDataWithValidation', userDataWithValidation);

    const APIResponse = await UserService.UserRegister(userDataWithValidation);
    console.log('APIResponse?.data?', APIResponse?.data?.token);

    if (APIResponse?.data?.token) {
      await dispatch(
        updateField(LocalStorageFields.Token, APIResponse.data?.token),
      );
      setTimeout(() => {
        navigation.replace('BottomTab');
      }, 0);
    } else {
      navigation.replace('LoginStack');
    }
    // // setSocialLoginLoading(false);
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
              Title="LOGIN WITH PHONE NUMBER"
              Icon={CommonLogos.EmailLoginLogo}
              onPress={() => {
                navigation.navigate('NumberVerification', {
                  screen: 'PhoneNumber',
                });
              }}
            />
            <LoginButton
              Title="LOGIN WITH GOOGLE"
              Icon={CommonLogos.GoogleLogo}
              onPress={() => {
                handleGoogleLogin();
              }}
            />
            <LoginButton
              Title="LOGIN WITH FACEBOOK"
              Icon={CommonLogos.FacebookLogo}
              onPress={() => {
                // navigation.navigate('NumberVerification', {
                //   screen: 'PhoneNumber',
                // });
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
