/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigation } from '@react-navigation/native';
import React, { FC, memo, useCallback, useEffect } from 'react';
import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import { COLORS, FONTS } from '../../../Common/Theme';
import { APP_NAME, DonationIconAnimationTime } from '../../../Config/Setting';
import { useTheme } from '../../../Contexts/ThemeContext';

interface BottomTabHeaderProps {
  hideSettingAndNotification?: boolean;
  showSetting?: boolean;
  hideDonation?: boolean;
  showTitle?: boolean;
}

const ANGLE = 10;
const TIME = 100;
const EASING = Easing.elastic(1.5);

const BottomTabHeader: FC<BottomTabHeaderProps> = ({
  hideSettingAndNotification,
  showSetting,
  hideDonation = false,
  showTitle = false,
}) => {
  const navigation = useNavigation<any>();
  const rotation = useSharedValue(0);
  const { colors, isDark } = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  const playAnimation = useCallback(() => {
    rotation.value = withSequence(
      withTiming(-ANGLE, { duration: TIME / 2, easing: EASING }),

      withRepeat(withTiming(ANGLE, { duration: TIME, easing: EASING }), 7, true),
      withTiming(0, { duration: TIME / 2, easing: EASING })
    );
  }, []);

  useEffect(() => {
    const intervalId = setInterval(playAnimation, DonationIconAnimationTime);

    return () => clearInterval(intervalId);
  }, [playAnimation]);

  return (
    <View
      style={[
        styles.Container,
        { backgroundColor: !isDark ? colors.White : 'transparent' },
        !isDark && {
          shadowColor: colors.Black,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 10,
        },
      ]}
    >
      <SafeAreaView />
      <View style={styles.ContentView}>
        {Platform.OS === 'android' && !hideDonation && (
          <Pressable
            onPress={() => {
              navigation.navigate('Donation');
            }}
            style={[styles.DonationContainer]}
          >
            <Animated.View style={[styles.IconWrapper, animatedStyle]}>
              <Image style={styles.DonateIcon} resizeMode="contain" source={CommonIcons.donate_icon} />
            </Animated.View>
          </Pressable>
        )}

        {showTitle && (
          <View style={styles.TitleTextView}>
            <Text style={[styles.TitleText, { color: colors.TitleText }]}>{APP_NAME?.toUpperCase()}</Text>
          </View>
        )}

        <View style={styles.IconsView}>
          {(!hideSettingAndNotification || showSetting) && (
            <Pressable
              onPress={() => {
                navigation.navigate('Setting');
              }}
              style={styles.IconWrapper}
            >
              <Image
                style={styles.Icons}
                tintColor={colors.TextColor}
                resizeMode="contain"
                source={CommonIcons.Setting}
              />
            </Pressable>
          )}
          {!hideSettingAndNotification && (
            <Pressable
              onPress={() => {
                navigation.navigate('Notification');
              }}
              style={styles.IconWrapper}
            >
              <Image
                style={styles.Icons}
                tintColor={colors.TextColor}
                resizeMode="contain"
                source={CommonIcons.Notification}
              />
            </Pressable>
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
    height: Platform.OS === 'ios' ? hp('12.5%') : hp('7%'),
  },
  DonationContainer: {},
  ContentView: {
    width: '93%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TitleTextView: {
    position: 'absolute',
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  TitleText: {
    fontFamily: FONTS.Bold,
    fontSize: hp('2.2%'),
    color: COLORS.Primary,
  },
  IconsView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  IconWrapper: {
    marginHorizontal: 7,
    justifyContent: 'center',
  },
  Icons: {
    width: 22,
    height: 22,
  },
  DonateIcon: {
    width: 30,
    height: 30,
  },
});
