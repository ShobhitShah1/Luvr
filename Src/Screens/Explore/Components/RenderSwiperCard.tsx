/* eslint-disable react-hooks/exhaustive-deps */
import React, {FC, memo, useEffect} from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import CommonIcons from '../../../Common/CommonIcons';
import {COLORS} from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import {DummyImage} from '../../../Config/Setting';
import useCalculateAge from '../../../Hooks/useCalculateAge';
import {SwiperCard} from '../../../Types/SwiperCard';
import styles from '../styles';

interface RenderCardProps {
  CurrentCardIndex: number;
  card: number;
  setFirstImageLoading: (loading: boolean) => void;
  firstImageLoading: boolean;
  currentImageIndex: number;
  cardData: SwiperCard;
  startInterval: any;
  stopInterval: any;
}

const RenderSwiperCard: FC<RenderCardProps> = ({
  CurrentCardIndex,
  cardData,
  card,
  setFirstImageLoading,
  firstImageLoading,
  currentImageIndex,
  startInterval,
  stopInterval,
}) => {
  const opacity = useSharedValue(0);
  const IsFirstCard = CurrentCardIndex === card;
  const Age = useCalculateAge(cardData?.birthdate);
  // const YourInto = ['Cricket', 'Gaming', 'Coding'];

  // useEffect(() => {
  //   const fadeInDuration = 300; // Adjust the duration as needed

  //   translateX.value = withTiming(0, {}, finished => {
  //     if (finished) {
  //       runOnJS(setFirstImageLoading)(false);
  //       // Reset opacity for the next fade-in
  //       opacity.value = withTiming(1, {duration: 200});
  //     }
  //   });

  //   runOnJS(setFirstImageLoading)(true);

  //   // Simulate loading delay
  //   setTimeout(() => {
  //     opacity.value = withTiming(1, {duration: fadeInDuration});
  //   }, 200);

  //   // Simulate loading delay
  //   setTimeout(() => {
  //     runOnJS(setFirstImageLoading)(false);
  //     translateX.value = withTiming(0, {duration: 600}); // Slide out the image
  //   }, 700);
  // }, [currentImageIndex]);

  useEffect(() => {
    opacity.value = withSpring(1, {}, finished => {
      if (finished) {
        runOnJS(setFirstImageLoading)(false);
      }
    });

    runOnJS(setFirstImageLoading)(true);

    setTimeout(() => {
      runOnJS(setFirstImageLoading)(false);
      opacity.value = withSpring(1);
    }, 0);
  }, [currentImageIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, [opacity.value]);

  const handlePressIn = () => {
    stopInterval();
  };

  const handlePressOut = () => {
    startInterval();
  };

  const ImageLoading = () => {
    setFirstImageLoading(true);
    stopInterval();
  };

  const ImageLoaded = () => {
    setFirstImageLoading(false);
    startInterval();
  };

  const getCardImageUrl = (
    ImageCardData: any,
    isFirstCard: any,
    currentCardNumber: any,
  ) => {
    const defaultImageUrl = DummyImage;
    const imageIndex = isFirstCard ? currentCardNumber : 0;

    return (
      (ImageCardData?.recent_pik[imageIndex] &&
        `${ApiConfig.IMAGE_BASE_URL}${ImageCardData?.recent_pik[imageIndex]}`) ||
      defaultImageUrl
    );
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View style={styles.card}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <FastImage
            onLoadStart={ImageLoading}
            onLoad={ImageLoaded}
            resizeMode="cover"
            source={{
              uri: getCardImageUrl(cardData, IsFirstCard, currentImageIndex),
            }}
            style={styles.ImageStyle}
          />
        </Animated.View>

        <View style={styles.CardBottomDetailView}>
          <View style={styles.TitleView}>
            <Text style={styles.TitleText}>
              {`${cardData?.full_name ? cardData?.full_name : 'User'}, ${
                Age ? Age : 0
              }`}
            </Text>
            <Image
              source={CommonIcons.Verification_Icon}
              style={styles.VerifyIconImage}
            />
          </View>

          <View style={styles.LocationView}>
            <Image
              tintColor={'rgba(198, 198, 198, 1)'}
              style={styles.LocationIcon}
              source={CommonIcons.Location}
            />
            <Text numberOfLines={1} style={styles.LocationText}>
              {cardData?.city || 'Somewhere in earth'}
            </Text>
          </View>

          <View style={styles.MultipleBoxFlexView}>
            {/* {cardData.likes_into.length !== 0 &&
              cardData.likes_into[0] !== '' &&
              cardData.likes_into?.map((interestedInItem, index) => {
                return (
                  <View key={index} style={styles.MultipleBoxView}>
                    <Text style={styles.MultipleDetailText}>
                      {interestedInItem}
                    </Text>
                  </View>
                );
              })} */}
          </View>
        </View>

        {firstImageLoading && (
          <View style={styles.LoadingImageView}>
            <ActivityIndicator size="large" color={COLORS.Primary} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(RenderSwiperCard);
