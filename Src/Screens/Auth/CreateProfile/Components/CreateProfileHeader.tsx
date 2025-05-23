import React, { memo, useEffect } from 'react';
import type { FC } from 'react';
import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CommonIcons from '../../../../Common/CommonIcons';
import { COLORS, GROUP_FONT } from '../../../../Common/Theme';
import { useTheme } from '../../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../../Hooks/useCustomNavigation';

interface CreateProfileProps {
  ProgressCount: number;
  Skip: boolean;
  handleSkipPress?: () => void;
  hideBack?: boolean;
}

const CreateProfileHeader: FC<CreateProfileProps> = ({
  ProgressCount,
  Skip,
  handleSkipPress,
  hideBack,
}) => {
  const { colors } = useTheme();
  const navigation = useCustomNavigation();

  const countValue = useSharedValue(ProgressCount);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (countValue.value !== ProgressCount) {
      opacity.value = withTiming(0, { duration: 150 }, () => {
        countValue.value = ProgressCount;
        opacity.value = withTiming(1, { duration: 300 });
      });
    }
  }, [ProgressCount]);

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
        <Animated.View style={styles.leftSection}>
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

        <Animated.View style={styles.centerSection}>
          {ProgressCount !== 0 && (
            <Animated.Text
              style={[styles.pageCount, { color: colors.TextColor }, countAnimatedStyle]}
            >
              {countValue.value}/9
            </Animated.Text>
          )}
        </Animated.View>

        <Animated.View style={styles.rightSection}>
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
  backButtonView: {
    alignItems: 'center',
    height: hp('3.5%'),
    justifyContent: 'center',
  },
  buttonAndTitleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: hp('1.5%'),
    marginVertical: Platform.OS === 'ios' ? 0 : hp('1.5%'),
    width: '100%',
  },
  cancelButton: {
    height: hp('3.5%'),
    width: hp('3.5%'),
  },
  centerSection: {
    alignItems: 'center',
    flex: 1,
  },
  headerContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    margin: hp('1%'),
    paddingHorizontal: hp('1.5%'),
    width: '100%',
  },
  leftSection: {
    alignItems: 'flex-start',
    flex: 1,
  },
  pageCount: {
    ...GROUP_FONT.h3,
    fontSize: hp('1.9%'),
  },
  rightSection: {
    alignItems: 'flex-end',
    flex: 1,
  },
  skipButton: {
    justifyContent: 'center',
    marginRight: Platform.OS === 'ios' ? hp('2.5%') : hp('1%'),
  },
  skipText: {
    ...GROUP_FONT.h3,
    color: COLORS.Gray,
  },
});
