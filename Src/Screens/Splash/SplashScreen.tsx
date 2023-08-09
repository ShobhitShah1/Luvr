import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Animated, View} from 'react-native';
import CommonLogos from '../../Common/CommonLogos';
import styles from './styles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const SplashScreen: React.FC = () => {
  const LoadingProgress = new Animated.Value(0);
  const navigation = useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  useEffect(() => {
    Animated.timing(LoadingProgress, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: true,
      delay: 1000,
    }).start(() => {
      navigation.replace('LoginStack', {
        screen: 'Login',
      });
    });
  }, []);

  const ImageScale = {
    transform: [
      {
        scale: LoadingProgress.interpolate({
          inputRange: [0, 15, 100],
          outputRange: [1, 10, 32],
        }),
      },
    ],
  };

  return (
    <View style={styles.Container}>
      <Animated.Image
        resizeMode="center"
        style={[styles.TinderLogoStyle, ImageScale]}
        source={CommonLogos.TinderLogo}
      />
    </View>
  );
};

export default SplashScreen;
