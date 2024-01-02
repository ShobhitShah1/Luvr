/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import NetInfo from '@react-native-community/netinfo';
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {Easing} from 'react-native-reanimated';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import CommonIcons from '../../Common/CommonIcons';
import {ActiveOpacity, COLORS, GROUP_FONT} from '../../Common/Theme';
import {CardDelay, CardLimit} from '../../Config/Setting';
import useInterval from '../../Hooks/useInterval';
import UserService from '../../Services/AuthService';
import {SwiperCard} from '../../Types/SwiperCard';
import {useCustomToast} from '../../Utils/toastUtils';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import RenderSwiperCard from './Components/RenderSwiperCard';

const ExploreCardScreen: FC = () => {
  const {width} = useWindowDimensions();
  const swipeRef = useRef<Swiper<SwiperCard>>(null);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const userData = useSelector((state: any) => state?.user);
  const {showToast} = useCustomToast();

  const [cards, setCards] = useState([]);
  const [cardToSkipNumber, setCardToSkipNumber] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [CurrentCardIndex, setCurrentCardIndex] = useState(0);
  const [firstImageLoading, setFirstImageLoading] = useState(true);
  const [IsAPILoading, setIsAPILoading] = useState(false);
  const [IsNetConnected, setIsNetConnected] = useState(false);

  useEffect(() => {
    CheckConnectionAndFetchAPI();
  }, []);

  const CheckConnectionAndFetchAPI = () => {
    setIsAPILoading(true);
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        FetchAPIData();
        setIsNetConnected(true);
      } else {
        showToast(
          'No Internet Connection',
          'Please check your internet connection',
          'error',
        );
        setIsNetConnected(true);
        setIsAPILoading(false);
        setCards([]);
      }
    });
  };

  const FetchAPIData = async () => {
    try {
      const userDataForApi = {
        limit: CardLimit,
        skip: cardToSkipNumber,
        radius: userData.radius,
        eventName: 'list_neighbour',
        latitude: userData.latitude,
        longitude: userData.longitude,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        setCards(APIResponse.data);
        console.log('APIResponse.data', APIResponse.data);
        swipeRef.current?.forceUpdate();
        startInterval();
      } else {
        showToast(
          'Something went wrong',
          APIResponse?.message || 'Please try again letter',
          'error',
        );
      }
    } catch (error) {
      console.log('Something Went Wrong With Feting API Data');
    } finally {
      setIsAPILoading(false);
    }
  };

  const {startInterval, stopInterval, clearInterval} = useInterval(
    () => {
      if (cards) {
        setCurrentImageIndex(
          prevIndex =>
            (prevIndex + 1) % cards[CurrentCardIndex]?.recent_pik.length || 0,
        );

        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();

        swipeRef.current?.forceUpdate();
      }
    },
    cards && cards?.length > 0 ? CardDelay : null,
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
    swipeRef.current?.forceUpdate();
    setCardToSkipNumber(cardToSkipNumber + 10);
    FetchAPIData();
    showToast(
      'All cards swiped',
      'Feting new cards for you (Toast is just for testing)',
      'success',
    );
  };

  const SwipeLeft = () => {
    swipeRef.current?.swipeLeft();
  };

  const SwipeRight = () => {
    swipeRef.current?.swipeRight();
  };

  const slideDownAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (cards?.length === 0) {
      Animated.timing(slideDownAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [cards, slideDownAnimation]);

  if (IsAPILoading) {
    return (
      <React.Fragment>
        <BottomTabHeader />
        <View style={[styles.container, styles.LoaderContainer]}>
          <ActivityIndicator size={'large'} color={COLORS.Primary} />
        </View>
      </React.Fragment>
    );
  }

  if (IsNetConnected && !IsAPILoading) {
    <React.Fragment>
      <BottomTabHeader />
      <View style={[styles.container, styles.LoaderContainer]}>
        <ActivityIndicator size={'large'} color={COLORS.Primary} />
      </View>
    </React.Fragment>;
  }

  return (
    <View style={styles.container}>
      <BottomTabHeader />

      <View
        style={[
          styles.SwiperContainer,
          {
            flex: cards?.length !== 0 ? 0.9 : 1,
          },
        ]}>
        {cards && cards.length !== 0 && !IsAPILoading && IsNetConnected ? (
          <Swiper
            ref={swipeRef}
            cards={cards}
            cardIndex={CurrentCardIndex}
            stackSize={2}
            stackSeparation={0}
            horizontalThreshold={width / 2.5}
            key={cards?.length || 0}
            secondCardZoom={0}
            swipeBackCard={true}
            onSwipedRight={OnSwipeRight}
            onSwiped={OnSwiped}
            onSwipedAll={OnSwipeAll}
            containerStyle={styles.CardContainerStyle}
            cardVerticalMargin={0}
            animateCardOpacity={true}
            animateOverlayLabelsOpacity={true}
            backgroundColor={'transparent'}
            disableBottomSwipe
            disableTopSwipe
            stackScale={0}
            cardStyle={styles.swiperStyle}
            overlayOpacityHorizontalThreshold={1}
            onSwiping={() => stopInterval()}
            onSwipedAborted={() => startInterval()}
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
            renderCard={(item: any, card: any) => {
              return (
                <RenderSwiperCard
                  CurrentCardIndex={CurrentCardIndex}
                  cardData={item}
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
        ) : (
          !IsAPILoading &&
          IsNetConnected && (
            <View style={styles.EmptyCardView}>
              <Text style={styles.EmptyCardText}>
                Your dating compass needs a spin! Adjust your settings and let
                the matchmaking magic begin. 🧭✨
              </Text>

              <TouchableOpacity
                activeOpacity={ActiveOpacity}
                onPress={() => {}}
                style={styles.ChangeSettingButton}>
                <Text style={styles.ChangeSettingText}>Change Setting</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>

      {/* Like And Reject View */}
      {cards?.length !== 0 && IsNetConnected && (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  LoaderContainer: {
    justifyContent: 'center',
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
    zIndex: 999,
    marginVertical: 10,
  },
  CardContainerStyle: {
    zIndex: 9999,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  swiperStyle: {
    height: '100%',
    borderWidth: 1,
    overflow: 'hidden',
    borderRadius: hp('4%'),
    borderColor: 'transparent',
  },
  LikeAndRejectView: {
    flex: 0.15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  LikeAndRejectButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
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
  EmptyCardView: {
    flex: 1,
    width: '90%',
    height: hp('100%'),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  EmptyCardText: {
    ...GROUP_FONT.h2,
    textAlign: 'center',
    color: COLORS.Primary,
  },
  ChangeSettingButton: {
    top: 20,
    width: 250,
    height: 50,
    alignItems: 'center',
    borderRadius: hp('4%'),
    justifyContent: 'center',
    backgroundColor: COLORS.Primary,
  },
  ChangeSettingText: {
    ...GROUP_FONT.h3,
    lineHeight: 18,
    color: COLORS.White,
  },
});

export default ExploreCardScreen;
