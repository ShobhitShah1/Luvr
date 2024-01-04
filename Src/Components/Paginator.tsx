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
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={[styles.Dot, {width: dotWidth, opacity}]}
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
  },
  Dot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    marginHorizontal: 4,
    backgroundColor: COLORS.Primary,
  },
});
