import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, memo, useEffect } from 'react';
import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import CommonIcons from '../../../../Common/CommonIcons';
import { COLORS, GROUP_FONT } from '../../../../Common/Theme';
import { useTheme } from '../../../../Contexts/ThemeContext';

interface CreateProfileProps {
  ProgressCount: number;
  Skip: boolean;
  handleSkipPress?: () => void;
  hideBack?: boolean;
}

const CreateProfileHeader: FC<CreateProfileProps> = ({ ProgressCount, Skip, handleSkipPress, hideBack }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<{ LoginStack: {} }>>();

  // Shared values for animations
  const countValue = useSharedValue(ProgressCount);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Animate count change
    if (countValue.value !== ProgressCount) {
      // Fade out
      opacity.value = withTiming(0, { duration: 150 }, () => {
        // Update value
        countValue.value = ProgressCount;
        // Fade in
        opacity.value = withTiming(1, { duration: 300 });
      });
    }
  }, [ProgressCount]);

  // Animated styles for count text
  const countAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: interpolate(opacity.value, [0, 1], [10, 0]) }],
    };
  });

  return (
    <View style={styles.headerContainer}>
      <SafeAreaView />
      <View style={styles.buttonAndTitleContainer}>
        {/* Left: Back Button */}
        <Animated.View style={[styles.leftSection]}>
          {!hideBack && (
            <Pressable
              style={styles.backButtonView}
              onPress={() => navigation.canGoBack() && navigation.goBack()}
              hitSlop={{ bottom: 10, top: 10, left: 10, right: 10 }}
            >
              <Image
                resizeMode="contain"
                tintColor={colors.TextColor}
                source={CommonIcons.TinderBack}
                style={styles.cancelButton}
              />
            </Pressable>
          )}
        </Animated.View>

        {/* Center: Progress Count */}
        <Animated.View style={[styles.centerSection]}>
          {ProgressCount !== 0 && (
            <Animated.Text style={[styles.pageCount, { color: colors.TextColor }, countAnimatedStyle]}>
              {countValue.value}/9
            </Animated.Text>
          )}
        </Animated.View>

        {/* Right: Skip Button */}
        <Animated.View style={[styles.rightSection]}>
          {Skip && (
            <Pressable
              onPress={handleSkipPress}
              hitSlop={{ bottom: 10, top: 10, left: 10, right: 10 }}
              style={styles.skipButton}
            >
              <Text style={[styles.skipText, { color: colors.TextColor }]}>Skip</Text>
            </Pressable>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

export default memo(CreateProfileHeader);

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    margin: hp('1%'),
    paddingHorizontal: hp('1.5%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonAndTitleContainer: {
    width: '100%',
    marginHorizontal: hp('1.5%'),
    marginVertical: Platform.OS === 'ios' ? 0 : hp('1.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  cancelButton: {
    width: hp('3.5%'),
    height: hp('3.5%'),
  },
  pageCount: {
    ...GROUP_FONT.h3,
    fontSize: hp('1.9%'),
  },
  skipText: {
    ...GROUP_FONT.h3,
    color: COLORS.Gray,
  },
  backButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('3.5%'),
  },
  skipButton: {
    justifyContent: 'center',
    marginRight: hp('1%'),
  },
});
