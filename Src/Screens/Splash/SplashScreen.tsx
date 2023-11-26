import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Animated, Image, StatusBar, View} from 'react-native';
import CommonLogos from '../../Common/CommonLogos';
import {COLORS} from '../../Common/Theme';
import styles from './styles';
import CommonImages from '../../Common/CommonImages';

const SplashScreen: React.FC = () => {
  const LoadingProgress = new Animated.Value(0);
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  useEffect(() => {
    // Animated.timing(LoadingProgress, {
    //   toValue: 100,
    //   duration: 1000,
    //   useNativeDriver: true,
    //   delay: 1000,
    // }).start(() => {
    //   navigation.replace('LoginStack', {
    //     screen: 'Login',
    //   });
    // });
    setTimeout(() => {
      navigation.replace('LoginStack', {
        screen: 'Login',
      });
    }, 1000);
  }, [navigation]);

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
      <StatusBar backgroundColor={COLORS.Primary} barStyle="light-content" />
      <Animated.Image
        resizeMode="center"
        style={[styles.TinderLogoStyle]}
        source={CommonLogos.TinderLogo}
      />
    </View>
  );
};

export default SplashScreen;
