import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {Easing} from 'react-native-reanimated';
import {COLORS, GROUP_FONT} from '../../Common/Theme';
import {CardDelay, imageArray} from '../../Config/Setting';
import useInterval from '../../Hooks/useInterval';
import RenderSwiperCard from './Components/RenderSwiperCard';
import BottomTabHeader from './Components/BottomTabHeader';
import CommonIcons from '../../Common/CommonIcons';
import {heightPercentageToDP} from 'react-native-responsive-screen';
const {width, height} = Dimensions.get('window');
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
    // startInterval();

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
    // startInterval();
    swipeRef.current?.forceUpdate();
  };

  return (
    <View style={styles.container}>
      <BottomTabHeader />

      <View
        style={{
          width: '90%',
          backgroundColor: 'red',
          // alignSelf: 'center',
          // height: heightPercentageToDP('50%'),
          // overflow: 'hidden',
        }}>
        <Swiper
          ref={swipeRef}
          cards={cards}
          cardIndex={CurrentCardIndex}
          stackSize={2}
          stackSeparation={0}
          // containerStyle={{height: height / 4}}
          horizontalThreshold={width / 2.5}
          key={cards.length}
          secondCardZoom={0}
          swipeBackCard={true}
          onSwipedRight={OnSwipeRight}
          onSwiped={OnSwiped}
          onSwipedAll={OnSwipeAll}
          cardHorizontalMargin={0}
          animateCardOpacity={true}
          animateOverlayLabelsOpacity={true}
          backgroundColor={COLORS.Secondary}
          disableBottomSwipe
          stackScale={0}
          overlayOpacityHorizontalThreshold={1}
          inputOverlayLabelsOpacityRangeX={
            Platform.OS === 'ios'
              ? [-width / 3, -1, 0, 1, width / 3]
              : [-width / 3, -1, 0, 1, width / 3]
          } // Adjust when the overlay label appears
          useViewOverflow={true}
          overlayLabels={{
            left: {
              element: (
                <Image
                  source={CommonIcons.like_button}
                  style={{
                    position: 'absolute',
                    top: 50,
                    right: 50,
                    width: 100,
                    height: 100,
                  }}
                />
              ),
            },
            right: {
              element: (
                <Image
                  source={CommonIcons.dislike_button}
                  style={{
                    position: 'absolute',
                    top: 50,
                    left: 50,
                    width: 100,
                    height: 100,
                  }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default ExploreCardScreen;
