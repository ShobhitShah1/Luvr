import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {Easing} from 'react-native-reanimated';
import SplashScreen from 'react-native-splash-screen';
import {COLORS, GROUP_FONT} from '../../Common/Theme';
import RenderSwiperCard from './Components/RenderSwiperCard';

function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

interface Card {
  images: string[];
}

const imageArray = [
  'https://images.unsplash.com/photo-1681896616404-6568bf13b022?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80',
  'https://images.unsplash.com/photo-1681871197336-0250ed2fe23d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
  'https://images.unsplash.com/photo-1682686580433-2af05ee670ad?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1700989348331-180f18e06978?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1682686580922-2e594f8bdaa7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1699031101330-4de71e10ee8c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const HomeScreen = () => {
  const [cards, setCards] = useState<Card[]>(
    [...range(1, 50)].map(() => ({images: [...imageArray]})),
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [CurrentCardIndex, setCurrentCardIndex] = useState(0);

  const [firstImageLoading, setFirstImageLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(5);

  const swipeRef = useRef<Swiper<Card>>(null);
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    SplashScreen.hide();
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageArray.length);

      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();

      swipeRef.current?.forceUpdate();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [cards]);

  const OnSwipeRight = (item: any) => {
    console.log('cardIndex:', item);
  };
  const OnSwiped = (cardIndex: any) => {
    setCurrentCardIndex(cardIndex + 1);
    setCurrentImageIndex(0);
  };

  return (
    <View style={styles.container}>
      <Swiper
        ref={swipeRef}
        cards={cards}
        cardIndex={CurrentCardIndex}
        stackSize={2}
        stackSeparation={0}
        key={cards.length}
        swipeBackCard={true}
        onSwipedRight={OnSwipeRight}
        onSwiped={OnSwiped}
        cardVerticalMargin={0}
        cardHorizontalMargin={0}
        animateCardOpacity={true}
        animateOverlayLabelsOpacity={true}
        backgroundColor={COLORS.White}
        renderCard={(cardIndex: any, card: any) => {
          return (
            <RenderSwiperCard
              CurrentCardIndex={CurrentCardIndex}
              cardIndex={cardIndex}
              card={card}
              firstImageLoading={firstImageLoading}
              setFirstImageLoading={setFirstImageLoading}
              currentImageIndex={currentImageIndex}
            />
          );

          // if (CurrentCardIndex === card) {
          //   return (
          //     <Animated.View style={[styles.card]}>
          //       <Text style={styles.topCardTitle}>
          //         Image Index Is: {currentImageIndex}
          //       </Text>

          //       <FastImage
          //         onLoadStart={() => setFirstImageLoading(true)}
          //         onLoad={() => setFirstImageLoading(false)}
          //         onLoadEnd={() => setFirstImageLoading(false)}
          //         resizeMode="cover"
          //         source={{uri: cardIndex?.images[currentImageIndex], priority:FastImage.priority.high}}
          //         style={{width: '100%', height: '100%'}}
          //       />

          //       {firstImageLoading && (
          //         <View
          //           style={{
          //             position: 'absolute',
          //             justifyContent: 'center',
          //             alignSelf: 'center',
          //             top: 0,
          //             right: 0,
          //             bottom: 0,
          //             left: 0,
          //           }}>
          //           <ActivityIndicator size="large" color={COLORS.Primary} />
          //         </View>
          //       )}
          //     </Animated.View>
          //   );
          // }
          // return (
          //   <View style={[styles.card]}>
          //     <Image
          //       resizeMode="cover"
          //       source={{uri: cardIndex?.images[0]}}
          //       style={{width: '100%', height: '100%'}}
          //     />
          //   </View>
          // );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: COLORS.Primary
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

export default HomeScreen;
