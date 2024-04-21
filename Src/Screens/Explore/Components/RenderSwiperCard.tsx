/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import {Skeleton} from 'moti/skeleton';
import React, {FC, memo, useEffect} from 'react';
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import CommonIcons from '../../../Common/CommonIcons';
import {ActiveOpacity, COLORS} from '../../../Common/Theme';
import ApiConfig from '../../../Config/ApiConfig';
import {DummyImage} from '../../../Config/Setting';
import useCalculateAge from '../../../Hooks/useCalculateAge';
import {SwiperCard} from '../../../Types/SwiperCard';
import styles from '../styles';
import FastImage from 'react-native-fast-image';

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
  const navigation = useNavigation();

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
    const imageUrl = ImageCardData?.recent_pik[imageIndex];
    return imageUrl
      ? `${ApiConfig.IMAGE_BASE_URL}${imageUrl}`
      : defaultImageUrl;
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View style={styles.card}>
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          style={[styles.imageContainer]}>
          <FastImage
            onLoadStart={ImageLoading}
            resizeMode="cover"
            removeClippedSubviews={true}
            onLoadEnd={ImageLoaded}
            key={currentImageIndex + getRandomInt(cardData.recent_pik.length)}
            fallback={Platform.OS === 'android'}
            source={{
              uri: getCardImageUrl(cardData, IsFirstCard, currentImageIndex),
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={styles.ImageStyle}
          />
        </Animated.View>

        <View style={styles.CardBottomDetailView}>
          <View>
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
              {cardData?.likes_into &&
                cardData?.likes_into !== null &&
                cardData?.likes_into?.length !== 0 &&
                cardData?.likes_into[0] !== '' &&
                cardData?.likes_into?.map((interestedInItem, index) => {
                  return (
                    <View key={index} style={styles.MultipleBoxView}>
                      <Text style={styles.MultipleDetailText}>
                        {interestedInItem}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={ActiveOpacity}
            onPress={() => {
              navigation.navigate('ExploreCardDetail', {props: cardData});
            }}
            style={styles.ViewProfileBTN}>
            <Image
              source={CommonIcons.view_profile}
              style={styles.ViewProfileIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(RenderSwiperCard);
