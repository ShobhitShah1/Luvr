/* eslint-disable react/self-closing-comp */
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {COLORS} from '../Common/Theme';

const rangeColor = COLORS.Primary;
const inactiveRangeColor = COLORS.Gray;

const sliderSize = 30;
const sliderlineHeight = 5;

const minPriceValue = 0;
const maxPriceValue = 100;
const priceSymbol = '$';

interface CustomMultiSliderProps {
  RightValue: number;
  LeftValue: number;
  onValueChange: (value: number) => void;
}
const CustomMultiSlider: React.FC<CustomMultiSliderProps> = ({
  RightValue,
  LeftValue,
  onValueChange,
}) => {
  const [containerWidth, setWidth] = useState(null);
  const [leftMove, setLeftMove] = useState(RightValue);
  const [rightMove, setRightMove] = useState(LeftValue);
  const [show, setShow] = useState(true);

  const saveMinMax = (price, isLeft) => {
    setShow(false);
    if (isLeft) {
      setLeftMove(price);
    } else {
      setRightMove(price);
    }
    setShow(true);
    onValueChange({
      leftValue: isLeft ? price : leftMove,
      rightValue: isLeft ? rightMove : price,
    });
  };

  const getPriceRange = isLeft => {
    return (
      minPriceValue +
      ((isLeft ? leftMove : rightMove) / 100) * (maxPriceValue - minPriceValue)
    );
  };
  let currentPriceRange = getPriceRange(true) + '-' + getPriceRange(false);

  return (
    <View style={styles.container}>
      <View
        style={styles.fullWidthCenterMain}
        onLayout={e => setWidth(e.nativeEvent.layout.width)}>
        {containerWidth && show && (
          <View style={styles.fullWidthCenter}>
            <View style={styles.activeBar}></View>
            <SliderCircle
              containerWidth={containerWidth}
              saveMinMax={saveMinMax}
              currentMinPricePos={leftMove}
              currentMaxPricePos={rightMove}
              isLeft
            />
            <SliderCircle
              containerWidth={containerWidth}
              saveMinMax={saveMinMax}
              currentMinPricePos={leftMove}
              currentMaxPricePos={rightMove}
            />
          </View>
        )}
      </View>
      {/* <Button
        title="Show range"
        onPress={() => console.log(currentPriceRange)}
      /> */}
    </View>
  );
};

let price = 0;

function SliderCircle({
  containerWidth,
  isLeft,
  saveMinMax,
  currentMinPricePos,
  currentMaxPricePos,
}: any) {
  const minPrice = 0;
  const maxPrice = 100;
  const offset = containerWidth - sliderSize * 2;
  const initialPos =
    (((isLeft ? currentMinPricePos : currentMaxPricePos) -
      (isLeft ? minPrice : maxPrice)) /
      (maxPrice - minPrice)) *
    offset;
  const animation = useRef(new Animated.ValueXY({x: initialPos, y: 0})).current;
  let minValue, maxValue;
  const initialPos1 =
    (((!isLeft ? currentMinPricePos : currentMaxPricePos) -
      (!isLeft ? minPrice : maxPrice)) /
      (maxPrice - minPrice)) *
    offset;
  if (isLeft) {
    minValue = 0;
    maxValue = offset + initialPos1;
  } else {
    minValue = -offset + initialPos1;
    maxValue = 0;
  }
  const translateX = Animated.diffClamp(animation.x, minValue, maxValue);

  const priceValueRef = useRef();
  const translateXInactiveLeft = Animated.add(
    translateX,
    new Animated.Value(-containerWidth),
  );
  const translateXInactiveRight = Animated.add(
    translateX,
    new Animated.Value(containerWidth),
  );
  useEffect(() => {
    let value =
      minPriceValue +
      ((isLeft ? currentMinPricePos : currentMaxPricePos) / 100) *
        (maxPriceValue - minPriceValue);
    value = value.toString() + ' ' + priceSymbol;
    priceValueRef.current.setNativeProps({text: value});
  });

  useEffect(() => {
    translateX.addListener(val => {
      if (isLeft) {
        let value = (
          minPrice +
          (val.value / offset) * (maxPrice - minPrice)
        ).toFixed(0);
        price = value;
        value = minPriceValue + (value / 100) * (maxPriceValue - minPriceValue);
        value = value.toString() + ' ' + priceSymbol;
        priceValueRef.current.setNativeProps({text: value});
      } else {
        let value = (
          maxPrice +
          (val.value / offset) * (maxPrice - minPrice)
        ).toFixed(0);
        price = value;
        value = minPriceValue + (value / 100) * (maxPriceValue - minPriceValue);
        value = value.toString() + ' ' + priceSymbol;
        priceValueRef.current.setNativeProps({text: value});
      }
    });
    return () => {
      animation.removeAllListeners();
    };
  }, [saveMinMax]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        animation.setOffset({x: animation.x._value, y: animation.y._value});
        animation.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event(
        [null, {dx: animation.x, dy: animation.y}],
        {
          useNativeDriver: false,
        },
      ),
      onPanResponderRelease: () => {
        animation.flattenOffset();
        setTimeout(() => {
          saveMinMax(price, isLeft);
        }, 0);
      },
      onPanResponderTerminate: () => {},
      onShouldBlockNativeResponder: () => {
        return true;
      },
    }),
  ).current;

  return (
    <View style={[styles.fullWidthCenter]}>
      <View style={styles.overflowContainer}>
        <Animated.View
          style={[
            isLeft ? styles.inactiveBarLeft : styles.inactiveBarRight,
            {
              transform: [
                {
                  translateX: isLeft
                    ? translateXInactiveLeft
                    : translateXInactiveRight,
                },
              ],
            },
          ]}></Animated.View>
      </View>
      <Animated.View
        style={[
          isLeft ? styles.leftSlider : styles.rightSlider,
          {transform: [{translateX}]},
        ]}
        {...panResponder.panHandlers}
      />
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          isLeft ? styles.leftSliderTxt : styles.rightSliderTxt,
          {transform: [{translateX}, {translateY: -30}]},
        ]}>
        <TextInput editable={false} ref={priceValueRef} />
      </Animated.View>
    </View>
  );
}

export default CustomMultiSlider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  activeBar: {
    ...StyleSheet.absoluteFill,
    height: sliderlineHeight,
    backgroundColor: rangeColor,
  },
  inactiveBarLeft: {
    ...StyleSheet.absoluteFill,
    height: sliderlineHeight,
    backgroundColor: inactiveRangeColor,
  },
  inactiveBarRight: {
    ...StyleSheet.absoluteFill,
    height: sliderlineHeight,
    backgroundColor: inactiveRangeColor,
  },
  leftSlider: {
    position: 'absolute',
    height: sliderSize,
    width: sliderSize,
    borderWidth: 2,
    borderColor: rangeColor,
    borderRadius: sliderSize / 2,
    backgroundColor: '#fff',
  },
  rightSlider: {
    position: 'absolute',
    height: sliderSize,
    width: sliderSize,
    borderWidth: 2,
    borderColor: rangeColor,
    borderRadius: sliderSize / 2,
    backgroundColor: '#fff',
    right: 0,
  },
  leftSliderTxt: {
    position: 'absolute',
    padding: 0,
    flexGrow: 0,
  },
  rightSliderTxt: {
    position: 'absolute',
    padding: 0,
    flexGrow: 0,
    right: 0,
  },
  fullWidthCenterMain: {
    width: '100%',
    justifyContent: 'center',
    minHeight: sliderlineHeight,
  },
  fullWidthCenter: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    minHeight: sliderlineHeight,
  },
  overflowContainer: {
    overflow: 'hidden',
    height: sliderlineHeight,
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
  },
});
