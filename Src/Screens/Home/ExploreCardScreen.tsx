import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {Easing} from 'react-native-reanimated';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../Common/CommonIcons';
import {ActiveOpacity, COLORS, GROUP_FONT} from '../../Common/Theme';
import {CardDelay, imageArray} from '../../Config/Setting';
import useInterval from '../../Hooks/useInterval';
import BottomTabHeader from './Components/BottomTabHeader';
import RenderSwiperCard from './Components/RenderSwiperCard';

function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

interface Card {
  images: string[];
}

const ExploreCardScreen: FC = () => {
  const {width} = useWindowDimensions();
  const [cards, setCards] = useState<Card[]>(
    [...range(1, 50)].map(() => ({images: [...imageArray]})),
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [CurrentCardIndex, setCurrentCardIndex] = useState(0);

  const [firstImageLoading, setFirstImageLoading] = useState(true);

  const swipeRef = useRef<Swiper<Card>>(null);
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const {startInterval, stopInterval, clearInterval} = useInterval(
    () => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageArray.length);

      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();

      swipeRef.current?.forceUpdate();
    },
    cards.length > 0 ? CardDelay : null,
  );

  useEffect(() => {
    startInterval();

    return () => {
      clearInterval();
    };
  }, [startInterval, clearInterval]);

  const OnSwipeRight = (item: any) => {
    console.log('cardIndex:', item);
  };
  const OnSwiped = (cardIndex: any) => {
    setCurrentCardIndex(cardIndex + 1);
    setCurrentImageIndex(0);
  };

  const OnSwipeAll = () => {
    Alert.alert('All cards swiped');
    setCards([...range(1, 50)].map(() => ({images: [...imageArray]})));
    startInterval();
    swipeRef.current?.forceUpdate();
  };

  const SwipeLeft = () => {
    swipeRef.current?.swipeLeft();
  };

  const SwipeRight = () => {
    swipeRef.current?.swipeRight();
  };

  return (
    <View style={styles.container}>
      <BottomTabHeader />

      <View style={styles.SwiperContainer}>
        <Swiper
          ref={swipeRef}
          cards={cards}
          cardIndex={CurrentCardIndex}
          stackSize={2}
          stackSeparation={0}
          horizontalThreshold={width / 2.5}
          key={cards.length}
          secondCardZoom={0}
          swipeBackCard={true}
          onSwipedRight={OnSwipeRight}
          onSwiped={OnSwiped}
          onSwipedAll={OnSwipeAll}
          containerStyle={styles.CardContainerStyle}
          cardVerticalMargin={0}
          animateCardOpacity={true}
          animateOverlayLabelsOpacity={true}
          backgroundColor={COLORS.Secondary}
          disableBottomSwipe
          stackScale={0}
          cardStyle={styles.swiperStyle}
          overlayOpacityHorizontalThreshold={1}
          inputOverlayLabelsOpacityRangeX={
            Platform.OS === 'ios'
              ? [-width / 3, -1, 0, 1, width / 3]
              : [-width / 3, -1, 0, 1, width / 3]
          }
          useViewOverflow={true}
          overlayLabels={{
            left: {
              element: (
                <Image
                  source={CommonIcons.dislike_button}
                  style={styles.LeftImage}
                />
              ),
            },
            right: {
              element: (
                <Image
                  source={CommonIcons.like_button}
                  style={styles.RightImage}
                />
              ),
            },
          }}
          renderCard={(cardIndex: any, card: any) => {
            return (
              <RenderSwiperCard
                CurrentCardIndex={CurrentCardIndex}
                cardIndex={cardIndex}
                card={card}
                firstImageLoading={firstImageLoading}
                setFirstImageLoading={setFirstImageLoading}
                currentImageIndex={currentImageIndex}
                startInterval={startInterval}
                stopInterval={stopInterval}
              />
            );
          }}
        />
      </View>

      {/* Like And Reject View */}
      <View style={styles.LikeAndRejectView}>
        {/* Reject Button */}
        <TouchableOpacity
          onPress={SwipeLeft}
          activeOpacity={ActiveOpacity}
          style={styles.LikeAndRejectButtonView}>
          <Image
            resizeMode="contain"
            style={styles.DislikeButton}
            source={CommonIcons.dislike_button}
          />
        </TouchableOpacity>

        {/* Like Button */}
        <TouchableOpacity
          onPress={SwipeRight}
          activeOpacity={ActiveOpacity}
          style={styles.LikeAndRejectButtonView}>
          <Image
            resizeMode="contain"
            style={styles.LikeButton}
            source={CommonIcons.like_button}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  topCardTitle: {
    position: 'absolute',
    top: 50,
    zIndex: 9999,
    ...GROUP_FONT.h1,
    color: COLORS.White,
  },
  LeftImage: {
    position: 'absolute',
    top: 50,
    right: 50,
    width: 100,
    height: 100,
    zIndex: 9999,
  },
  RightImage: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 100,
    height: 100,
    zIndex: 9999,
  },
  SwiperContainer: {
    padding: 0,
    flex: 0.6,
    marginVertical: hp('2%'),
  },
  CardContainerStyle: {
    // zIndex: 9999,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  swiperStyle: {
    // width: hp('47%'),
    height: hp('65%'),
    borderWidth: 1,
    overflow: 'hidden',
    borderRadius: hp('4%'),
  },

  LikeAndRejectView: {
    marginTop: hp('67%'),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  LikeAndRejectButtonView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  DislikeButton: {
    padding: 0,
    width: hp('9%'),
    height: hp('9%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  LikeButton: {
    padding: 0,
    width: hp('12%'),
    height: hp('12%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default ExploreCardScreen;
