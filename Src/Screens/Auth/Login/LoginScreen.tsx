import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {ImageBackground, ScrollView, StatusBar, Text, View} from 'react-native';
import CommonImages from '../../../Common/CommonImages';
import CommonLogos from '../../../Common/CommonLogos';
import {COLORS} from '../../../Common/Theme';
import LoginButton from '../../../Components/AuthComponents/LoginButton';
import SplashScreen from '../../Splash/SplashScreen';
import styles from './styles';

const LoginScreen: FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  if (imageLoaded) {
    return <SplashScreen />;
  }

  return (
    <ImageBackground
      resizeMethod="auto"
      resizeMode="cover"
      source={CommonImages.WelcomeBackground}
      style={styles.Container}
      imageStyle={{flex: 1}}>
      <StatusBar backgroundColor={COLORS.Black} barStyle="light-content" />
      <ScrollView
        bounces={false}
        style={styles.ContentView}
        contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
      >
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
                navigation.navigate('LoginStack', {
                  screen: 'PhoneNumber',
                });
              }}
            />
            <LoginButton
              Title="LOGIN WITH GOOGLE"
              Icon={CommonLogos.GoogleLogo}
              onPress={() => {
                navigation.navigate('LoginStack', {
                  screen: 'PhoneNumber',
                });
              }}
            />
            <LoginButton
              Title="LOGIN WITH FACEBOOK"
              Icon={CommonLogos.FacebookLogo}
              onPress={() => {
                navigation.navigate('LoginStack', {
                  screen: 'PhoneNumber',
                });
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
