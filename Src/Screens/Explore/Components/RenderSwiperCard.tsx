/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigation } from '@react-navigation/native';
import React, { FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, LayoutChangeEvent, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import CommonIcons from '../../../Common/CommonIcons';
import ApiConfig from '../../../Config/ApiConfig';
import { DummyImage } from '../../../Config/Setting';
import { useTheme } from '../../../Contexts/ThemeContext';
import useCalculateAge from '../../../Hooks/useCalculateAge';
import { SwiperCard } from '../../../Types/SwiperCard';
import styles from '../styles';
import LinearGradient from 'react-native-linear-gradient';

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

const hobbyColors = [
  'rgba(6,282, 202, 1)',
  'rgba(128, 207,16, 1)',
  'rgba(220, 259, 35, 1)',
  'rgba(101, 77, 42, 1)',
  'rgba(255, 153, 0, 1)',
  'rgba(235, 59, 112, 1)',
];

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
  const { colors, isDark } = useTheme();

  const isFirstCard = CurrentCardIndex === card;
  const age = useCalculateAge(cardData?.birthdate);
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

  const flatListRef = useRef<FlatList>(null);
  const [ContainerWidthAndHeight, setContainerWidthAndHeight] = useState({
    width: 350,
    height: 350,
  });

  useEffect(() => {
    if (
      flatListRef.current &&
      isFirstCard &&
      cardData?.recent_pik?.length > 0 &&
      currentImageIndex >= 0 &&
      currentImageIndex < cardData.recent_pik.length
    ) {
      flatListRef?.current?.scrollToIndex({
        index: currentImageIndex || 0,
        animated: true,
      });
    }
  }, [currentImageIndex, cardData]);

  const LayOutChange = (item: LayoutChangeEvent) => {
    setContainerWidthAndHeight({
      height: item.nativeEvent.layout.height,
      width: item.nativeEvent.layout.width,
    });
  };

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffledHobbyColors = useMemo(() => shuffleArray(hobbyColors), [cardData?.likes_into]);

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLayout={(event) => LayOutChange(event)}
    >
      <View style={[styles.card, { backgroundColor: colors.Secondary }]}>
        <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} style={[styles.imageContainer]}>
          {cardData?.recent_pik && cardData?.recent_pik?.length !== 0 ? (
            <FlatList
              horizontal
              pagingEnabled
              ref={flatListRef}
              initialNumToRender={4}
              initialScrollIndex={0}
              scrollEnabled={false}
              nestedScrollEnabled={false}
              onScrollToIndexFailed={() => {}}
              keyExtractor={(item, index) => index.toString()}
              data={cardData?.recent_pik}
              removeClippedSubviews={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      height: ContainerWidthAndHeight.height ? ContainerWidthAndHeight.height : 530.9091186523438,
                      width: ContainerWidthAndHeight.width ? ContainerWidthAndHeight.width : 350.5454406738281,
                    }}
                  >
                    <FastImage
                      key={index}
                      resizeMode="cover"
                      onLoad={ImageLoaded}
                      onLoadStart={ImageLoading}
                      source={{
                        uri: item ? ApiConfig.IMAGE_BASE_URL + item : DummyImage,
                        priority: FastImage.priority.high,
                      }}
                      style={styles.ImageStyle}
                      removeClippedSubviews={true}
                    />
                  </View>
                );
              }}
            />
          ) : (
            <View
              style={{
                height: ContainerWidthAndHeight.height ? ContainerWidthAndHeight.height : 530.9091186523438,
                width: ContainerWidthAndHeight.width ? ContainerWidthAndHeight.width : 350.5454406738281,
              }}
            >
              <Image
                resizeMode="cover"
                onLoad={ImageLoaded}
                onLoadStart={ImageLoading}
                source={{ uri: DummyImage }}
                style={styles.ImageStyle}
              />
            </View>
          )}
        </Animated.View>

        <View style={styles.CardBottomDetailView}>
          <View style={{ width: '90%' }}>
            <View style={styles.TitleView}>
              <Text style={[styles.TitleText, { color: colors.White }]} numberOfLines={2}>
                {`${cardData?.full_name ? cardData?.full_name : 'User'}, ${age ? age : 0}`}
              </Text>
              <Image source={CommonIcons.Verification_Icon} style={styles.VerifyIconImage} />
            </View>

            <View style={styles.LocationView}>
              <Image tintColor={colors.White} style={styles.LocationIcon} source={CommonIcons.Location} />
              <Text numberOfLines={1} style={[styles.LocationText, { color: colors.White }]}>
                {cardData?.city || 'Somewhere in earth'}
              </Text>
            </View>

            <View style={styles.MultipleBoxFlexView}>
              {Array.isArray(cardData?.likes_into) &&
                cardData.likes_into.length > 0 &&
                cardData.likes_into[0] !== '' && (
                  <>
                    {cardData.likes_into.map((interestedInItem, index) => {
                      const backgroundColor = shuffledHobbyColors[index % shuffledHobbyColors.length];

                      return isDark ? (
                        <LinearGradient
                          start={{ x: 1, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          colors={colors.ButtonGradient}
                          key={index}
                          style={styles.MultipleBoxView}
                        >
                          <Text style={styles.MultipleDetailText}>{interestedInItem || ''}</Text>
                        </LinearGradient>
                      ) : (
                        <View key={index} style={[styles.MultipleBoxView, { backgroundColor }]}>
                          <Text style={styles.MultipleDetailText}>{interestedInItem || ''}</Text>
                        </View>
                      );
                    })}
                  </>
                )}
            </View>
          </View>

          <Pressable
            onPress={() => {
              navigation.navigate('ExploreCardDetail', { props: cardData });
            }}
            style={styles.ViewProfileBTN}
          >
            <Image source={CommonIcons.view_profile} style={styles.ViewProfileIcon} />
          </Pressable>
        </View>

        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            zIndex: 1,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(RenderSwiperCard);
