/* eslint-disable react-native/no-inline-styles */
import {MotiImage, MotiTransitionProp, MotiView} from 'moti';
import React, {FC, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Easing} from 'react-native-reanimated';
import {COLORS} from '../Common/Theme';
import CommonIcons from '../Common/CommonIcons';

const _colors = {
  Active: COLORS.Primary,
  InActive: COLORS.Gray,
};

interface SwitchComponentProps {
  isActive: boolean;
  size: number;
}

const transition: MotiTransitionProp = {
  type: 'timing',
  duration: 300,
  easing: Easing.inOut(Easing.ease),
};

const SwitchComponent: FC<SwitchComponentProps> = ({isActive, size}) => {
  const [IsActive, setSetIsActive] = useState(isActive);
  const trackWidth = useMemo(() => {
    return size * 1.5;
  }, [size]);

  const trackHeight = useMemo(() => {
    return size * 0.8;
  }, [size]);

  const knobSize = useMemo(() => {
    return size * 0.6;
  }, [size]);

  const onPress = () => setSetIsActive(!IsActive);
  console.log('IsActive:', IsActive);
  return (
    <Pressable
      onPress={onPress}
      style={{width: size * 1.5, height: size * 1, justifyContent: 'center'}}>
      <View style={styles.SwitchContainer}>
        <MotiView
          transition={transition}
          from={{
            backgroundColor: IsActive ? _colors.InActive : _colors.Active,
          }}
          animate={{
            backgroundColor: IsActive ? _colors.Active : _colors.InActive,
          }}
          style={[
            styles.MotiTopViewStyle,
            {
              width: trackWidth,
              height: trackHeight,
              borderRadius: trackHeight / 2,
              backgroundColor: _colors.Active,
              paddingHorizontal: 5,
            },
          ]}
        />
        <MotiView
          transition={transition}
          animate={{
            translateX: IsActive ? trackWidth / 4 : -trackWidth / 4,
          }}
          style={{
            width: size / 1.7,
            height: size / 1.7,
            borderRadius: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.White,
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
            style={{width: 13, height: 13}}
            source={IsActive ? CommonIcons.Check : CommonIcons.Cancel}
            tintColor={IsActive ? _colors.Active : _colors.InActive}
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
