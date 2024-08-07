/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {FC, memo, useCallback, useEffect} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import {ActiveOpacity, COLORS, FONTS} from '../../../Common/Theme';
import {APP_NAME, DonationIconAnimationTime} from '../../../Config/Setting';

interface BottomTabHeaderProps {
  hideSettingAndNotification?: boolean;
  showSetting?: boolean;
}

const ANGLE = 10;
const TIME = 100;
const EASING = Easing.elastic(1.5);

const BottomTabHeader: FC<BottomTabHeaderProps> = ({
  hideSettingAndNotification,
  showSetting,
}) => {
  const navigation = useNavigation<any>();
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{rotateZ: `${rotation.value}deg`}],
  }));

  const playAnimation = useCallback(() => {
    rotation.value = withSequence(
      withTiming(-ANGLE, {duration: TIME / 2, easing: EASING}),

      withRepeat(withTiming(ANGLE, {duration: TIME, easing: EASING}), 7, true),
      withTiming(0, {duration: TIME / 2, easing: EASING}),
    );
  }, []);

  useEffect(() => {
    const intervalId = setInterval(playAnimation, DonationIconAnimationTime);

    return () => clearInterval(intervalId);
  }, [playAnimation]);

  return (
    <View style={styles.Container}>
      <SafeAreaView />
      <StatusBar
        animated={true}
        barStyle={'dark-content'}
        backgroundColor={COLORS.White}
      />
      <View style={styles.ContentView}>
        <View style={styles.TitleTextView}>
          <Text style={styles.TitleText}>{APP_NAME}</Text>
        </View>

        <View style={styles.IconsView}>
          {Platform.OS === 'android' && (
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              onPress={() => {
                navigation.navigate('Donation');
              }}
              style={[styles.DonationContainer]}>
              <Animated.View style={[styles.IconWrapper, animatedStyle]}>
                <Image
                  style={styles.DonateIcon}
                  resizeMode="contain"
                  source={CommonIcons.donate_icon}
                />
              </Animated.View>
            </TouchableOpacity>
          )}
          {!hideSettingAndNotification && (
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              onPress={() => {
                navigation.navigate('Notification');
              }}
              style={styles.IconWrapper}>
              <Image
                style={styles.Icons}
                resizeMode="contain"
                source={CommonIcons.Notification}
              />
            </TouchableOpacity>
          )}
          {(!hideSettingAndNotification || showSetting) && (
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              onPress={() => {
                navigation.navigate('Setting');
              }}
              style={styles.IconWrapper}>
              <Image
                style={styles.Icons}
                resizeMode="contain"
                source={CommonIcons.Setting}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(BottomTabHeader);

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor: COLORS.White,
    height: Platform.OS === 'ios' ? hp('12.5%') : hp('8%'),

    shadowColor: COLORS.Black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  DonationContainer: {},
  ContentView: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TitleTextView: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  TitleText: {
    fontFamily: FONTS.Bold,
    fontSize: hp('2%'),
    color: COLORS.Primary,
  },
  IconsView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  IconWrapper: {
    marginHorizontal: hp('1%'),
    justifyContent: 'center',
  },
  Icons: {
    width: hp('3.5%'),
    height: hp('3%'),
  },
  DonateIcon: {
    width: 32,
    height: 32,
  },
});
