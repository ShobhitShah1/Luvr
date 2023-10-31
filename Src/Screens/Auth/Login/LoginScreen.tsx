import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MotiView} from 'moti';
import React from 'react';
import {StatusBar, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import CommonLogos from '../../../Common/CommonLogos';
import {COLORS} from '../../../Common/Theme';
import LoginButton from '../../../Components/AuthComponents/LoginButton';
import styles from './styles';

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  return (
    <LinearGradient
      colors={COLORS.Gradient}
      style={styles.Container}
      start={{x: 0, y: 1}}
      end={{x: 0, y: 1}}>
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
            By tapping Create Account or Sign In, you agree to our Terms. Learn
            how we process your data in our{' '}
            <Text style={styles.PolicyLinkText}>Privacy Policy</Text> and{' '}
            <Text style={styles.PolicyLinkText}>Cookies Policy</Text>.
          </Text>
        </View>

        <LoginButton
          Title="SIGN IN WITH GOOGLE"
          onPress={() =>
            navigation.navigate('LoginStack', {
              screen: 'CreateAccount',
            })
          }
        />
        <LoginButton
          Title="SIGN IN WITH PHONE NUMBER"
          onPress={() =>
            navigation.navigate('LoginStack', {
              screen: 'CreateAccount',
            })
          }
        />

        <View style={styles.TroubleView}>
          <Text style={styles.TroubleText}>Trouble Signing In?</Text>
        </View>
      </MotiView>
    </LinearGradient>
  );
}
