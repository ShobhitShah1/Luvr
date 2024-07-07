import React, {FC} from 'react';
import {Animated, StyleSheet, View, useWindowDimensions} from 'react-native';
import {COLORS} from '../Common/Theme';

interface PaginatorProps {
  data: any[];
  scrollX: any;
}

const Paginator: FC<PaginatorProps> = ({data, scrollX}) => {
  const {width} = useWindowDimensions();

  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 50, 10],
          extrapolate: 'clamp',
          useNativeDriver: true,
        });

        return (
          <Animated.View
            style={[styles.dot, {width: dotWidth}]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};

export default Paginator;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  dot: {
    height: 8,
    borderRadius: 50,
    marginHorizontal: 4,
    backgroundColor: COLORS.White,
  },
});
