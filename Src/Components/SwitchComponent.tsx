import React, {useEffect, useRef, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { COLORS } from '../Common/Theme';
// import {clamp, snapPoint} from 'react-native-redash';
// import {scale} from 'react-native-size-matters';

type SwitchComponentProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
  labelContainer: React.ReactNode;
  backgroundColor: string;
};
const SWITCH_CONTAINER_WIDTH = 65;
const SWITCH_CONTAINER_HEIGHT = 35;
const CIRCLE_WIDTH = 27;
const BORDER = 1;
// const DEFAULT_MARGIN = 10;
const TRACK_CIRCLE_WIDTH = SWITCH_CONTAINER_WIDTH - CIRCLE_WIDTH - BORDER * 2;
const config: Animated.WithSpringConfig = {
  overshootClamping: true,
};
const SwitchComponent = ({
  value,
  onChange,
  backgroundColor,
}: SwitchComponentProps) => {
  const [isToggled, setIsToggled] = useState(value);
  const translateX = useSharedValue(0);
  useEffect(() => {
    onChange(isToggled);
  }, [isToggled]);
  const onPress = ({
    nativeEvent: {state},
  }: TapGestureHandlerStateChangeEvent) => {
    if (state !== State.ACTIVE) return;
    setIsToggled(prevstate => !prevstate);
    translateX.value = withSpring(isToggled ? 0 : TRACK_CIRCLE_WIDTH, config);
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
      width: interpolate(
        translateX.value,
        [0, TRACK_CIRCLE_WIDTH / 3, TRACK_CIRCLE_WIDTH],
        [CIRCLE_WIDTH, (CIRCLE_WIDTH / 2) * 2.5, CIRCLE_WIDTH],
      ),
    };
  });
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [0, TRACK_CIRCLE_WIDTH],
        ['white', backgroundColor],
      ),
    };
  });

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {x: number}
  >({
    onStart: (_e, ctx) => {
      ctx.x = translateX.value;
    },
    onActive: ({translationX}, ctx) => {
      // translateX.value = clamp(translationX + ctx.x, 0, TRACK_CIRCLE_WIDTH);
    },
    onEnd: ({velocityX}) => {
      // const selectedSnapPoint = snapPoint(translateX.value, velocityX, [
      //   0,
      //   TRACK_CIRCLE_WIDTH,
      // ]);
      // translateX.value = withSpring(selectedSnapPoint, config);
      // runOnJS(setIsToggled)(selectedSnapPoint !== 0);
    },
  });

  const panRef = useRef<PanGestureHandler>(null);

  return (
    <TapGestureHandler waitFor={panRef} onHandlerStateChange={onPress}>
      <Animated.View style={[animatedContainerStyle, styles.switchContainer]}>
        <PanGestureHandler ref={panRef} onGestureEvent={onGestureEvent}>
          <Animated.View
            style={[animatedStyle, styles.circle, {borderColor: 'transparent'}]}
          />
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};
export default SwitchComponent;

const styles = StyleSheet.create({
  switchContainer: {
    borderWidth: 1,
    borderRadius: 999,
    flexDirection: 'row',
    borderColor: COLORS.Primary,
    width: SWITCH_CONTAINER_WIDTH,
    height: SWITCH_CONTAINER_HEIGHT,
    backgroundColor: 'rgba(255, 229, 234, 1)',
  },
  circle: {
    alignSelf: 'center',
    width: CIRCLE_WIDTH,
    height: CIRCLE_WIDTH,
    borderRadius: 999,
    borderWidth: BORDER,
    backgroundColor: COLORS.Primary,
  },
});
