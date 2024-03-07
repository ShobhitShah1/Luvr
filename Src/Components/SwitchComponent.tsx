/* eslint-disable react-native/no-inline-styles */
import {MotiImage, MotiTransitionProp, MotiView} from 'moti';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Easing} from 'react-native-reanimated';
import {COLORS} from '../Common/Theme';
import CommonIcons from '../Common/CommonIcons';

const _colors = {
  Active: COLORS.Primary,
  ActiveBackground: 'rgba(255, 229, 234, 1)',
  InActive: 'rgba(108, 108, 108, 1)',
  InActiveBackground: 'rgba(234, 234, 234, 1)',
};

interface SwitchComponentProps {
  isActive: boolean;
  size: number;
  onPress: () => any;
}

const transition: MotiTransitionProp = {
  type: 'timing',
  duration: 300,
  easing: Easing.inOut(Easing.ease),
};

const SwitchComponent: FC<SwitchComponentProps> = ({
  isActive,
  size,
  onPress,
}) => {
  // const [IsActive, setSetIsActive] = useState(isActive);

  // useEffect(() => {
  //   setSetIsActive(isActive);
  // }, [isActive, setSetIsActive]);

  const trackWidth = useMemo(() => {
    return size * 1.5;
  }, [size]);

  const trackHeight = useMemo(() => {
    return size * 0.88;
  }, [size]);

  // const onPress = () => setSetIsActive(!isActive);
  return (
    <Pressable
      onPress={onPress}
      style={{width: size * 1.5, height: size * 1, justifyContent: 'center'}}>
      <View style={styles.SwitchContainer}>
        <MotiView
          transition={transition}
          from={{
            backgroundColor: isActive
              ? _colors.InActiveBackground
              : _colors.ActiveBackground,
            borderColor: isActive ? _colors.InActive : _colors.Active,
          }}
          animate={{
            backgroundColor: isActive
              ? _colors.ActiveBackground
              : _colors.InActiveBackground,
            borderColor: isActive ? _colors.Active : _colors.InActive,
          }}
          style={[
            styles.MotiTopViewStyle,
            {
              width: trackWidth,
              height: trackHeight,
              borderRadius: trackHeight / 2,
              borderWidth: 1.5,
              // backgroundColor: _colors.Active,
              paddingHorizontal: 5,
            },
          ]}
        />
        <MotiView
          transition={transition}
          animate={{
            translateX: isActive ? trackWidth / 5 : -trackWidth / 5,
          }}
          style={{
            width: size / 1.5,
            height: size / 1.5,
            borderRadius: size / 2,
            // left: 5,
            // right: -10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isActive ? _colors.Active : _colors.InActive,
          }}>
          <MotiImage
            transition={transition}
            from={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            resizeMode="contain"
            style={{width: 11.5, height: 11.5}}
            source={isActive ? CommonIcons.Check : CommonIcons.Cancel}
            tintColor={COLORS.White}
          />
        </MotiView>
      </View>
    </Pressable>
  );
};

export default SwitchComponent;

const styles = StyleSheet.create({
  SwitchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  MotiTopViewStyle: {
    position: 'absolute',
  },
});
