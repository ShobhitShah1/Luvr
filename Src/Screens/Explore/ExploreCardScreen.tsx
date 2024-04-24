/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
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
import Modal from 'react-native-modal';
import {Easing} from 'react-native-reanimated';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import CommonIcons from '../../Common/CommonIcons';
import {ActiveOpacity, COLORS, GROUP_FONT} from '../../Common/Theme';
import {CardDelay, CardLimit} from '../../Config/Setting';
import useInterval from '../../Hooks/useInterval';
import {onSwipeLeft, onSwipeRight} from '../../Redux/Action/userActions';
import {store} from '../../Redux/Store/store';
import UserService from '../../Services/AuthService';
import {SwiperCard} from '../../Types/SwiperCard';
import {useCustomToast} from '../../Utils/toastUtils';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import ItsAMatch from './Components/ItsAMatch';
import RenderSwiperCard from './Components/RenderSwiperCard';

const ExploreCardScreen: FC = () => {
  const {width} = useWindowDimensions() || {};

  const swipeRef = useRef<Swiper<SwiperCard>>(null);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const slideDownAnimation = useRef(new Animated.Value(1)).current;

  const navigation = useNavigation();
  const isScreenFocused = useIsFocused();

  const userData = useSelector((state: any) => state?.user);
  const {showToast} = useCustomToast();

  const LeftSwipedUserIds = useSelector(
    state => state?.user?.swipedLeftUserIds || [],
  );
  const RightSwipedUserIds = useSelector(
    state => state?.user?.swipedRightUserIds || [],
  );

  const [cards, setCards] = useState<SwiperCard[]>([]);
  const [cardToSkipNumber, setCardToSkipNumber] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [CurrentCardIndex, setCurrentCardIndex] = useState(0);
  const [firstImageLoading, setFirstImageLoading] = useState(true);
  const [IsAPILoading, setIsAPILoading] = useState(true);
  const [IsNetConnected, setIsNetConnected] = useState(true);
  const [ItsMatchModalView, setItsMatchModalView] = useState(false);

  const {startInterval, stopInterval, clearInterval} = useInterval(
    () => {
      if (cards && isScreenFocused) {
        setCurrentImageIndex(
          prevIndex =>
            (prevIndex + 1) % cards[CurrentCardIndex]?.recent_pik?.length || 0,
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
    if (ItsMatchModalView) {
      stopInterval();
    } else {
      startInterval();
    }
  }, [ItsMatchModalView]);

  //* Blur Screen useEffect
  useEffect(() => {
    const _unsubscribe = navigation.addListener('blur', () => {
      stopInterval();
      clearInterval();
      setCardToSkipNumber(0);
    });
    return () => _unsubscribe();
  }, []);

  //* Focus Screen useEffect
  useEffect(() => {
    if (isScreenFocused) {
      startInterval();
      setIsAPILoading(true);
      FetchAPIData(0);
      setCardToSkipNumber(0);
      setCurrentCardIndex(0);
      setCurrentImageIndex(0);
    }
  }, [isScreenFocused]);

  useEffect(() => {
    if (cards?.length === 0) {
      Animated.timing(slideDownAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [cards, slideDownAnimation]);

  const FetchAPIData = useCallback(
    async (cardSkipValue: number | undefined) => {
      setCurrentCardIndex(0);
      try {
        const userDataForApi = {
          limit: CardLimit,
          unlike: LeftSwipedUserIds, //LeftSwipedUserIds
          like: RightSwipedUserIds, //RightSwipedUserIds
          skip: cardSkipValue || cardToSkipNumber,
          radius: userData.radius,
          eventName: 'list_neighbour',
          latitude: userData.latitude,
          longitude: userData.longitude,
        };
        const APIResponse = await UserService.UserRegister(userDataForApi);

        if (APIResponse?.code === 200 && Array.isArray(APIResponse.data)) {
          const newCards = APIResponse.data;
          if (newCards.length !== 0) {
            const filteredCards = newCards.filter(
              card => card?.name || card?.enable === 1,
            );
            setCards(filteredCards);
            swipeRef.current?.forceUpdate();
            startInterval();
          } else {
            setCards([]);
            stopInterval();
          }
        } else {
          showToast(
            'Something went wrong',
            APIResponse?.message || 'Please try again later',
            'error',
          );
        }
      } catch (error) {
        console.log('Something Went Wrong With Fetching API Data');
      } finally {
        setIsAPILoading(false);
      }
    },
    [
      LeftSwipedUserIds,
      RightSwipedUserIds,
      cardToSkipNumber,
      userData,
      CardLimit,
      store.getState().user?.swipedLeftUserIds,
      store.getState().user?.swipedRightUserIds,
    ],
  );

  //* On Swipe Right Do Something
  const OnSwipeRightCard = (cardIndex: number) => {
    console.log('Swipe Right Card Index', cardIndex);
    if (cards && cards[CurrentCardIndex]?._id) {
      console.log(cards[CurrentCardIndex]?._id, CurrentCardIndex);
      LikeUserAPI(String(cards[CurrentCardIndex]?._id));
      store.dispatch(onSwipeRight(String(cards[CurrentCardIndex]?._id)));
    }
  };

  //* On Swipe Left Do Something
  const OnSwipeLeft = (cardIndex: any) => {
    if (cards[cardIndex] && cards[cardIndex]?._id) {
      store.dispatch(onSwipeLeft(String(cards[cardIndex]?._id)));
    }
  };

  //* All Card Swiped
  const OnSwiped = (cardIndex: any) => {
    setCurrentCardIndex(cardIndex + 1);
    setCurrentImageIndex(0);
  };

  //* When Swipe All Card Fetch New
  const OnSwipeAll = () => {
    swipeRef.current?.forceUpdate();
    setIsAPILoading(true);
    setCardToSkipNumber(cardToSkipNumber + CardLimit);
    FetchAPIData(cardToSkipNumber + CardLimit);
  };

  //* This Will Just Swipe Left
  const SwipeLeft = () => {
    swipeRef.current?.swipeLeft();
  };

  //* This Will Just Swipe Right
  const SwipeRight = () => {
    swipeRef.current?.swipeRight();
  };

  //* User Like API
  const LikeUserAPI = async (id: string) => {
    try {
      const userDataForApi = {
        eventName: 'like',
        like_to: id,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        console.log('LikeUserAPI APIResponse Data ---:>', APIResponse.data);
        if (APIResponse.data?.status === 'match') {
          setItsMatchModalView(true);
        }
        swipeRef.current?.forceUpdate();
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

  if (IsAPILoading) {
    return (
      <React.Fragment>
        <BottomTabHeader
          showSetting={true}
          hideSettingAndNotification={false}
        />
        <View style={[styles.container, styles.LoaderContainer]}>
          <ActivityIndicator size={'large'} color={COLORS.Primary} />
        </View>
      </React.Fragment>
    );
  }

  if (!IsNetConnected && !IsAPILoading) {
    return (
      <React.Fragment>
        <BottomTabHeader
          showSetting={true}
          hideSettingAndNotification={false}
        />
        <View style={[styles.container, styles.LoaderContainer]}>
          <Text style={styles.NoNetText}>
            Unable to establish an internet connection at the moment. Please
            check your network settings and try again."
          </Text>
        </View>
      </React.Fragment>
    );
  }

  return (
    <View style={styles.container}>
      <BottomTabHeader showSetting={true} hideSettingAndNotification={false} />

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
            key={cards?.length}
            secondCardZoom={10}
            swipeBackCard={true}
            onSwipedRight={OnSwipeRightCard}
            onSwiped={OnSwiped}
            onSwipedLeft={OnSwipeLeft}
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
            // useViewOverflow={true}
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
            renderCard={(cardData: any, cardIndex: any) => {
              return (
                <RenderSwiperCard
                  CurrentCardIndex={CurrentCardIndex}
                  cardData={cardData}
                  card={cardIndex}
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
                onPress={() => {
                  navigation.navigate('Setting');
                }}
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

      <Modal
        isVisible={
          IsAPILoading || cards?.length === 0 ? false : ItsMatchModalView
        }
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        useNativeDriver
        useNativeDriverForBackdrop
        hasBackdrop
        onBackdropPress={() => {
          setItsMatchModalView(false);
        }}
        onBackButtonPress={() => {
          setItsMatchModalView(false);
        }}
        style={{
          flex: 1,
          margin: 0,
        }}>
        <ItsAMatch
          user={cards && cards[CurrentCardIndex - 1]}
          onSayHiClick={() => {
            setItsMatchModalView(false);
            navigation.navigate('Chat', {
              id: cards[CurrentCardIndex - 1]?._id,
            });
          }}
          onCloseModalClick={() => setItsMatchModalView(false)}
          setItsMatch={setItsMatchModalView}
        />
      </Modal>
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
    marginTop: 20,
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
    width: '90%',
    textAlign: 'center',
    color: COLORS.White,
  },
  NoNetText: {
    width: '90%',
    ...GROUP_FONT.h2,
    textAlign: 'center',
    alignSelf: 'center',
    color: COLORS.Primary,
  },
});

export default ExploreCardScreen;
