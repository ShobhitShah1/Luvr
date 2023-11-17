import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MotiView} from 'moti';
import React, {FC} from 'react';
import {StatusBar, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import CommonLogos from '../../../Common/CommonLogos';
import {COLORS} from '../../../Common/Theme';
import LoginButton from '../../../Components/AuthComponents/LoginButton';
import styles from './styles';

const LoginScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  return (
    <LinearGradient
      colors={COLORS.Gradient}
      style={styles.Container}
      start={{x: 1, y: 0}}
      end={{x: 1, y: 1}}>
      <StatusBar backgroundColor={COLORS.Black} barStyle="light-content" />
      <View style={styles.SubContainer}>
        <View style={styles.TinderLogoView}>
          <Animated.Image
            sharedTransitionTag="Tag"
            resizeMode="contain"
            style={styles.TinderLogo}
            source={CommonLogos.TinderTextLogo}
          />
        </View>
      </View>

      <MotiView
        from={{opacity: 0, scale: 0}}
        animate={{opacity: 1, scale: 1}}
        transition={{
          type: 'timing',
          duration: 500,
        }}
        style={styles.LoginBottomView}>
        <View style={styles.PolicyTextView}>
          <Text style={styles.PolicyText}>
            By clicking "Log in.", you agree with our{' '}
            <Text style={styles.PolicyLinkText}>Terms</Text>. Learn how we
            process your data in our{' '}
            <Text style={styles.PolicyLinkText}>Privacy Policy</Text> and{' '}
            <Text style={styles.PolicyLinkText}>Cookies Policy</Text>.
          </Text>
        </View>

        <LoginButton
          Title="LOG IN WITH GOOGLE"
          Icon={CommonLogos.GoogleLogo}
          onPress={() =>
            navigation.navigate('LoginStack', {
              screen: 'Welcome',
            })
          }
        />

        <LoginButton
          Title="LOG IN WITH FACEBOOK"
          Icon={CommonLogos.FacebookLogo}
          onPress={() =>
            navigation.navigate('LoginStack', {
              screen: 'Welcome',
            })
          }
        />

        <LoginButton
          Title="LOG IN WITH PHONE NUMBER"
          Icon={CommonLogos.EmailLoginLogo}
          onPress={() =>
            navigation.navigate('LoginStack', {
              screen: 'PhoneNumber',
            })
          }
        />

        <View style={styles.TroubleView}>
          <Text style={styles.TroubleText}>Trouble Signing In?</Text>
        </View>
      </MotiView>
    </LinearGradient>
  );
};
export default LoginScreen;
