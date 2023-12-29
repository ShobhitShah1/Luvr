import React, {FC, useRef} from 'react';
import {
  ActivityIndicator,
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {COLORS, GROUP_FONT} from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import {SwiperCard} from '../../../Types/SwiperCard';

interface RenderCardProps {
  CurrentCardIndex: number;
  card: number;
  setFirstImageLoading: (loading: boolean) => void;
  firstImageLoading: boolean;
  currentImageIndex: number;
  cardIndex: SwiperCard;
  startInterval: any;
  stopInterval: any;
}

const RenderSwiperCard: FC<RenderCardProps> = ({
  CurrentCardIndex,
  cardIndex,
  card,
  firstImageLoading,
  setFirstImageLoading,
  currentImageIndex,
  startInterval,
  stopInterval,
}) => {
  //* Press In Stop Timer For Image Looping
  const handlePressIn = () => {
    stopInterval();
    console.log('Press In');
  };

  //* Press Out Start Timer For Image Looping
  const handlePressOut = () => {
    startInterval();
    console.log('Press Out');
  };

  //* Image Loading Stop Timer
  const ImageLoading = () => {
    setFirstImageLoading(true);
    stopInterval();
  };

  //* Image Loaded Start Timer
  const ImageLoaded = () => {
    setFirstImageLoading(false);
    startInterval();
  };

  //* Check Card Right And Left Side
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        stopInterval();
      },
      onPanResponderRelease: (_, gestureState) => {
        // startInterval();
        const {dx} = gestureState;
        console.log(dx);
        if (dx > 50) {
          // Swiped right, show next image
          // You might want to add additional checks to avoid going beyond the array boundaries
          // For example, check if currentImageIndex < cardIndex.images.length - 1
          console.log('LEFT');
          setFirstImageLoading(true);
          setTimeout(() => {
            setFirstImageLoading(false);
          }, 500); // Simulating loading for demo purposes
        } else if (dx < -50) {
          // Swiped left, show previous image
          // You might want to add additional checks to avoid going below 0
          // For example, check if currentImageIndex > 0
          console.log('RIGHT');
          setFirstImageLoading(true);
          setTimeout(() => {
            setFirstImageLoading(false);
          }, 500); // Simulating loading for demo purposes
        }
      },
    }),
  ).current;

  //* Render First Card For Image Animation
  if (CurrentCardIndex === card) {
    return (
      <TouchableWithoutFeedback
        style={[styles.card]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <Animated.View style={[styles.card]} {...panResponder.panHandlers}>
          <React.Fragment>
            <FastImage
              onLoadStart={ImageLoading}
              onLoad={ImageLoaded}
              onLoadEnd={ImageLoaded}
              resizeMode="cover"
              source={{
                uri:
                  cardIndex?.recent_pik &&
                  `${
                    ApiConfig.IMAGE_BASE_URL +
                    cardIndex?.recent_pik[currentImageIndex]
                  }`,
                priority: FastImage.priority.high,
              }}
              style={styles.ImageStyle}
            />

            <View style={styles.CardBottomDetailView}>
              <View style={styles.TitleView}>
                <Text style={styles.TitleText}>
                  {(cardIndex?.full_name, cardIndex.radius)}
                </Text>
              </View>
            </View>

            {firstImageLoading && (
              <View style={styles.LoadingImageView}>
                <ActivityIndicator size="large" color={COLORS.Primary} />
              </View>
            )}
          </React.Fragment>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }

  //* 2nd Card (Bellow)
  return (
    <View style={[styles.card]}>
      <FastImage
        resizeMode="cover"
        source={{
          uri: cardIndex?.recent_pik[0],
          priority: FastImage.priority.high,
        }}
        style={styles.ImageStyle}
      />
    </View>
  );
};

export default RenderSwiperCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    zIndex: 9999,
  },
  topCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  ImageStyle: {
    width: '100%',
    height: '100%',
  },
  CardBottomDetailView: {
    bottom: 0,
    zIndex: 9999,
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
  },
  TitleView: {
    marginVertical: 5,
    justifyContent: 'center',
  },
  TitleText: {
    ...GROUP_FONT.h2,
    color: COLORS.White,
  },

  // Loader
  LoadingImageView: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
