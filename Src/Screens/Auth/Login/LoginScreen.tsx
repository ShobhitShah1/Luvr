import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, FONTS} from '../../../Common/Theme';
import styles from './styles';
import {Image, Text, View} from 'react-native';
import CommonLogos from '../../../Common/CommonLogos';
import LoginButton from '../../../Components/AuthComponents/LoginButton';
import {MotiView} from 'moti';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  return (
    <LinearGradient
      colors={COLORS.Gradient}
      style={styles.Container}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 0}}>
      <View style={styles.ContantView}>
        <View style={styles.TinderLogoView}>
          <Image
            resizeMode="contain"
            style={styles.TinderLogo}
            source={CommonLogos.TinderTextLogo}
          />
        </View>
        <MotiView
          from={{opacity: 0, scale: 0}}
          animate={{opacity: 1, scale: 1}}
          transition={{
            type: 'timing',
            duration: 500,
          }}
          style={styles.LogiBottomView}>
          <View style={styles.PolicyTextView}>
            <Text style={styles.PolicyText}>
              By tapping Create Account or Sign In, you agree to our Terms.
              Learn how we process your data in our{' '}
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
      </View>
    </LinearGradient>
  );
}
