import React, { memo, useMemo } from 'react';
import type { FC } from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

import CommonIcons from '../Common/CommonIcons';
import { COLORS } from '../Common/Theme';
import { useTheme } from '../Contexts/ThemeContext';

interface SwitchComponentProps {
  isActive: boolean;
  size: number;
  onPress: () => void;
}

const ANIMATION_DURATION = 300;
const EASING = Easing.inOut(Easing.ease);

const SwitchComponent: FC<SwitchComponentProps> = ({ isActive, size, onPress }) => {
  const { colors, isDark } = useTheme();

  const _colors = {
    Active: colors.Primary,
    ActiveBackground: isDark ? 'rgba(157, 133, 240, 0.25)' : 'rgba(240, 236, 255, 1)',
    InActive: 'rgba(108, 108, 108, 1)',
    InActiveBackground: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(234, 234, 234, 1)',
  };

  const trackWidth = useMemo(() => size * 1.5, [size]);
  const trackHeight = useMemo(() => size * 0.88, [size]);

  const progress = useSharedValue(isActive ? 1 : 0);
  const translateX = useSharedValue(isActive ? trackWidth / 5 : -trackWidth / 5);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: EASING,
    });

    translateX.value = withTiming(isActive ? trackWidth / 5 : -trackWidth / 5, {
      duration: ANIMATION_DURATION,
      easing: EASING,
    });

    opacity.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: EASING,
    });
  }, [isActive, progress, translateX, opacity, trackWidth]);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [_colors.InActiveBackground, _colors.ActiveBackground],
      ),
      borderColor: interpolateColor(progress.value, [0, 1], [_colors.InActive, _colors.Active]),
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      backgroundColor: interpolateColor(progress.value, [0, 1], [_colors.InActive, _colors.Active]),
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      style={{ width: trackWidth, height: size, justifyContent: 'center' }}
    >
      <View style={styles.switchContainer}>
        <Animated.View
          style={[
            styles.track,
            {
              width: trackWidth,
              height: trackHeight,
              borderRadius: trackHeight / 2,
              borderWidth: 1.5,
              paddingHorizontal: 5,
            },
            trackAnimatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.thumb,
            {
              width: size / 1.5,
              height: size / 1.5,
              borderRadius: size / 2,
            },
            thumbAnimatedStyle,
          ]}
        >
          <Animated.View style={iconAnimatedStyle}>
            <Image
              resizeMode="contain"
              style={{ width: 11.5, height: 11.5 }}
              source={isActive ? CommonIcons.Check : CommonIcons.Cancel}
              tintColor={COLORS.White}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </Pressable>
  );
};

export default memo(SwitchComponent);

const styles = StyleSheet.create({
  switchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
  },
});
