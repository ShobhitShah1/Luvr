/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {addEventListener} from '@react-native-community/netinfo';
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
import TextString from '../../Common/TextString';
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
import {BlurView} from '@react-native-community/blur';

const ExploreCardScreen: FC = () => {
  const {width, height} = useWindowDimensions();

  const swipeRef = useRef<Swiper<SwiperCard>>(null);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const slideDownAnimation = useRef(new Animated.Value(1)).current;

  const navigation = useNavigation() as any;
  const isScreenFocused = useIsFocused();

  const userData = useSelector((state: any) => state?.user);
  const {showToast} = useCustomToast();

  const LeftSwipedUserIds = useSelector(
    (state: any) => state?.user?.swipedLeftUserIds || [],
  );
  const RightSwipedUserIds = useSelector(
    (state: any) => state?.user?.swipedRightUserIds || [],
  );

  const [cards, setCards] = useState<SwiperCard[]>([]);
  const [cardToSkipNumber, setCardToSkipNumber] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [CurrentCardIndex, setCurrentCardIndex] = useState(0);
  const [firstImageLoading, setFirstImageLoading] = useState(true);
  const [IsAPILoading, setIsAPILoading] = useState(true);
  const [IsNetConnected, setIsNetConnected] = useState(true);
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [MatchedUserInfo, setMatchedUserInfo] = useState<SwiperCard | null>(
    null,
  );

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
    const unsubscribe = addEventListener(state => {
      setIsNetConnected(state?.isConnected || false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isMatchModalVisible) {
      stopInterval();
    } else {
      startInterval();
    }
  }, [isMatchModalVisible]);

  useEffect(() => {
    if (isScreenFocused) {
      startInterval();
      if (cards.length === 0) {
        setIsAPILoading(true);
      }
      fetchAPIData(0);
      setCurrentCardIndex(0);
      setCurrentImageIndex(0);
    } else {
      stopInterval();
      clearInterval();
    }
    setCardToSkipNumber(0);
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

  const fetchAPIData = useCallback(
    async (cardSkipValue: number | undefined) => {
      if (!IsNetConnected) {
        showToast(
          TextString.error.toUpperCase(),
          TextString.PleaseCheckYourInternetConnection,
          TextString.error,
        );
        setIsAPILoading(false);
        return;
      }

      setCurrentCardIndex(0);
      try {
        const userDataForApi = {
          limit: CardLimit,
          unlike: LeftSwipedUserIds,
          like: RightSwipedUserIds,
          skip: cardSkipValue || cardToSkipNumber,
          radius: userData.radius,
          eventName: 'list_neighbour',
          latitude: userData.latitude,
          longitude: userData.longitude,
        };
        const APIResponse = await UserService.UserRegister(userDataForApi);

        if (APIResponse?.code === 200 && Array.isArray(APIResponse.data)) {
          const filteredCards = await APIResponse.data.filter(
            (card: any) => card?.name || card?.enable === 1,
          );

          setCards(filteredCards);
          swipeRef.current?.forceUpdate();
          startInterval();
        } else {
          showToast(
            TextString.error.toUpperCase(),
            APIResponse?.message || 'Something went wrong',
            TextString.error,
          );
          stopInterval();
        }
      } catch (error: any) {
        showToast('Error', String(error?.message || error), 'error');
      } finally {
        setIsAPILoading(false);
      }
    },
    [LeftSwipedUserIds, RightSwipedUserIds, userData, showToast, startInterval],
  );

  const swipeCardAction = (
    cardIndex: number,
    swipeAction: (id: string) => void,
    shouldCallApi: boolean = false,
  ) => {
    if (isMatchModalVisible || !cards || !cards[cardIndex]?._id) {
      return;
    }

    const currentCard = cards[cardIndex];
    const cardId = String(currentCard._id);

    if (shouldCallApi) {
      likeUserAPICall(cardId, currentCard);
    }

    store.dispatch(swipeAction(cardId));
  };

  const onSwipeRightCard = (cardIndex: number) => {
    swipeCardAction(cardIndex, onSwipeRight, true);
  };

  const onSwipeLeftCard = (cardIndex: number) => {
    swipeCardAction(cardIndex, onSwipeLeft);
  };

  const onSwipedCard = async (cardIndex: any) => {
    if (!IsNetConnected) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );
      swipeRef.current?.swipeBack();
      return;
    }

    setCurrentImageIndex(0);
    setCurrentCardIndex(cardIndex + 1);
  };

  const onSwipedAllCard = useCallback(() => {
    setIsAPILoading(true);
    swipeRef.current?.forceUpdate();
    setCardToSkipNumber(cardToSkipNumber + CardLimit);
    fetchAPIData(cardToSkipNumber + CardLimit);
  }, [cardToSkipNumber, fetchAPIData]);

  const SwipeLeft = async () => {
    if (isMatchModalVisible) {
      return;
    }
    swipeRef.current?.swipeLeft();
  };

  const SwipeRight = () => {
    if (isMatchModalVisible) {
      return;
    }
    swipeRef.current?.swipeRight();
  };

  const likeUserAPICall = async (id: string, cardData: SwiperCard) => {
    if (!IsNetConnected) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );
      return;
    }

    try {
      const userDataForApi = {eventName: 'like', like_to: id};

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        if (APIResponse.data?.status === 'match') {
          setMatchedUserInfo(cardData);
          setIsMatchModalVisible(true);
        }
        swipeRef.current?.forceUpdate();
      } else {
        showToast(
          TextString.error.toUpperCase(),
          APIResponse?.message || 'Please try again letter',
          TextString.error,
        );
        swipeRef.current?.swipeBack();
      }
    } catch (error: any) {
      showToast(
        TextString.error.toUpperCase(),
        String(error?.message || error),
        TextString.error,
      );
      swipeRef.current?.swipeBack();
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
        style={[styles.SwiperContainer, {flex: cards?.length !== 0 ? 0.9 : 1}]}>
        {cards && cards.length !== 0 ? (
          <Swiper
            ref={swipeRef}
            cards={cards}
            cardIndex={CurrentCardIndex}
            stackSize={10}
            stackSeparation={0}
            horizontalThreshold={width / 2.5}
            key={cards?.length}
            secondCardZoom={10}
            swipeBackCard={true}
            onSwipedRight={onSwipeRightCard}
            onSwiped={onSwipedCard}
            onSwipedLeft={onSwipeLeftCard}
            onSwipedAll={onSwipedAllCard}
            containerStyle={styles.CardContainerStyle}
            cardVerticalMargin={0}
            animateCardOpacity={true}
            animateOverlayLabelsOpacity={true}
            backgroundColor={'transparent'}
            disableBottomSwipe={true}
            disableTopSwipe={true}
            disableLeftSwipe={isMatchModalVisible}
            disableRightSwipe={isMatchModalVisible}
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
          !IsAPILoading && (
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

      {cards?.length !== 0 && (
        <View style={styles.LikeAndRejectView}>
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
        isVisible={!IsAPILoading && isMatchModalVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        hasBackdrop={true}
        onBackdropPress={() => {
          setIsMatchModalVisible(false);
          setMatchedUserInfo(null);
        }}
        onBackButtonPress={() => {
          setIsMatchModalVisible(false);
          setMatchedUserInfo(null);
        }}
        statusBarTranslucent={true}
        style={styles.modalContainer}>
        <ItsAMatch
          user={MatchedUserInfo}
          onSayHiClick={() => {
            setIsMatchModalVisible(false);
            navigation.navigate('Chat', {
              id: MatchedUserInfo?._id,
            });
          }}
          onCloseModalClick={() => {
            setIsMatchModalVisible(false);
            setMatchedUserInfo(null);
          }}
          setItsMatch={setIsMatchModalVisible}
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
  modalContainer: {
    flex: 1,
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default ExploreCardScreen;
