/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { addEventListener } from '@react-native-community/netinfo';
import remoteConfig from '@react-native-firebase/remote-config';
import { useIsFocused } from '@react-navigation/native';
import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { AdEventType, AppOpenAd, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import LinearGradient from 'react-native-linear-gradient';
import { Easing } from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import Swiper from 'rn-swipe-deck';
import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { BOTTOM_TAB_HEIGHT, COLORS, FONTS, GROUP_FONT } from '../../Common/Theme';
import GradientButton from '../../Components/AuthComponents/GradientButton';
import ApiConfig from '../../Config/ApiConfig';
import { CardDelay, CardLimit, MAX_RADIUS } from '../../Config/Setting';
import { useSubscriptionModal } from '../../Contexts/SubscriptionModalContext';
import { useTheme } from '../../Contexts/ThemeContext';
import { useUserData } from '../../Contexts/UserDataContext';
import { useCustomNavigation } from '../../Hooks/useCustomNavigation';
import useInterval from '../../Hooks/useInterval';
import { onSwipeLeft, onSwipeRight, resetSwipeCount, setCardSkipNumber } from '../../Redux/Action/actions';
import { store } from '../../Redux/Store/store';
import UserService from '../../Services/AuthService';
import { ProfileType } from '../../Types/ProfileType';
import { useCustomToast } from '../../Utils/toastUtils';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import ItsAMatch from './Components/ItsAMatch';
import RenderSwiperCard from './Components/RenderSwiperCard';
import { useBoostModal } from '../../Hooks/useBoostModal';

const appOpenAdUnitId = __DEV__ ? TestIds.APP_OPEN : ApiConfig.ANDROID_AD_ID;
const interstitialAdUnitId = __DEV__ ? TestIds.INTERSTITIAL : ApiConfig.ANDROID_AD_ID;

const appOpenAd = AppOpenAd.createForAdRequest(appOpenAdUnitId, {
  keywords: ['fashion', 'clothing', 'dating'],
});

const interstitialAd = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
  keywords: ['fashion', 'clothing', 'dating'],
});

const ExploreCardScreen: FC = () => {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const { subscription } = useUserData();
  const { showSubscriptionModal } = useSubscriptionModal();
  const { showModal } = useBoostModal();

  const swipeRef = useRef<any>(null);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const slideDownAnimation = useRef(new Animated.Value(1)).current;
  const swipeCountRef = useRef(0);

  const currentSkipNumberRef = useRef(0);
  const isRequestInProgressRef = useRef(false);

  const navigation = useCustomNavigation();
  const isFocused = useIsFocused();

  const userData = useSelector((state: any) => state?.user);
  const swipeCount = useSelector((state: any) => state?.user?.swipeCount || 0);
  const { showToast } = useCustomToast();

  const LeftSwipedUserIds = useSelector((state: any) => state?.user?.swipedLeftUserIds || []);
  const RightSwipedUserIds = useSelector((state: any) => state?.user?.swipedRightUserIds || []);
  const storedSkipNumber = useSelector((state: any) => state?.user?.cardSkipNumber || 0);

  const [cards, setCards] = useState<ProfileType[]>([]);
  const [cardToSkipNumber, setCardToSkipNumber] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [CurrentCardIndex, setCurrentCardIndex] = useState(0);
  const [firstImageLoading, setFirstImageLoading] = useState(true);
  const [IsAPILoading, setIsAPILoading] = useState(true);
  const [IsNetConnected, setIsNetConnected] = useState(true);
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [MatchedUserInfo, setMatchedUserInfo] = useState<ProfileType | null>(null);

  const [adSwipeThreshold, setAdSwipeThreshold] = useState(2);

  const [appOpenAdLoaded, setAppOpenAdLoaded] = useState(false);
  const [interstitialAdLoaded, setInterstitialAdLoaded] = useState(false);

  useEffect(() => {
    currentSkipNumberRef.current = storedSkipNumber;
  }, [storedSkipNumber]);

  useEffect(() => {
    const setupRemoteConfig = async () => {
      try {
        await remoteConfig().fetchAndActivate();

        const thresholdValue = remoteConfig().getValue('swipe_add_count').asNumber();
        setAdSwipeThreshold(thresholdValue || 3);
      } catch (error) {}
    };

    setupRemoteConfig();
  }, []);

  useEffect(() => {
    const unsubscribeAppOpenLoaded = appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      setAppOpenAdLoaded(true);
    });

    const unsubscribeAppOpenOpened = appOpenAd.addAdEventListener(AdEventType.OPENED, () => {
      setAppOpenAdLoaded(false);
    });

    const unsubscribeAppOpenClosed = appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      appOpenAd.load();
    });

    const unsubscribeInterstitialLoaded = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialAdLoaded(true);
    });

    const unsubscribeInterstitialOpened = interstitialAd.addAdEventListener(AdEventType.OPENED, () => {
      setInterstitialAdLoaded(false);
    });

    const unsubscribeInterstitialClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      interstitialAd.load();
    });

    interstitialAd.load();

    appOpenAd.load();

    return () => {
      unsubscribeAppOpenLoaded();
      unsubscribeAppOpenOpened();
      unsubscribeAppOpenClosed();

      unsubscribeInterstitialLoaded();
      unsubscribeInterstitialOpened();
      unsubscribeInterstitialClosed();
    };
  }, []);

  const { startInterval, stopInterval, clearInterval } = useInterval(
    () => {
      if (cards && isFocused) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % cards[CurrentCardIndex]?.recent_pik?.length || 0);
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
        swipeRef.current?.forceUpdate();
      }
    },
    cards && cards?.length > 0 ? CardDelay : null
  );

  useEffect(() => {
    const unsubscribe = addEventListener((state) => {
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
    if (isFocused) {
      startInterval();

      if (cards.length === 0) {
        setIsAPILoading(true);
      }

      currentSkipNumberRef.current = storedSkipNumber;
      fetchAPIData(storedSkipNumber);
      setCurrentCardIndex(0);
      setCurrentImageIndex(0);
    } else {
      stopInterval();
      clearInterval();
    }

    // setCardToSkipNumber(0);
  }, [isFocused, storedSkipNumber]);

  useEffect(() => {
    if (cards?.length === 0) {
      Animated.timing(slideDownAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [cards, slideDownAnimation]);

  const resetCardSkip = () => {
    currentSkipNumberRef.current = 0;
    dispatch(setCardSkipNumber(0));
    setCardToSkipNumber(0);
    fetchAPIData(0);
  };

  const fetchAPIData = useCallback(
    async (cardSkipValue: number | undefined) => {
      if (!IsNetConnected) {
        showToast(TextString.error.toUpperCase(), TextString.PleaseCheckYourInternetConnection, TextString.error);
        setIsAPILoading(false);
        return;
      }

      const skipValue = Number.isInteger(cardSkipValue) ? cardSkipValue || 0 : currentSkipNumberRef.current || 0;

      setCurrentCardIndex(0);

      try {
        const userDataForApi = {
          limit: CardLimit,
          like: RightSwipedUserIds,
          unlike: LeftSwipedUserIds,
          skip: skipValue,
          radius: userData.radius || MAX_RADIUS,
          eventName: 'list_neighbour',
          latitude: userData.latitude,
          longitude: userData.longitude,
          is_online: false,
        };

        const APIResponse = await UserService.UserRegister(userDataForApi);

        if (APIResponse?.code === 200 && Array.isArray(APIResponse.data)) {
          const filteredCards = await APIResponse.data.filter((card: any) => card?.name || card?.enable === 1);

          if (filteredCards.length > 0) {
            setCards(filteredCards);
            if (swipeRef.current) {
              swipeRef.current.forceUpdate();
            }
            startInterval();
          } else {
            setCards([]);
            if (skipValue > 0) {
              resetCardSkip();
            }
          }
        } else {
          showToast(TextString.error.toUpperCase(), APIResponse?.message || 'Something went wrong', TextString.error);
          stopInterval();
          if (skipValue > CardLimit * 2) {
            resetCardSkip();
          }
        }
      } catch (error: any) {
        showToast('Error', String(error?.message || error), 'error');
        if (skipValue > CardLimit * 2) {
          resetCardSkip();
        }
      } finally {
        setIsAPILoading(false);
      }
    },
    [LeftSwipedUserIds, RightSwipedUserIds, userData, showToast, startInterval]
  );

  const swipeCardAction = (cardIndex: number, swipeAction: (id: string) => void, shouldCallApi: boolean = false) => {
    try {
      if (isMatchModalVisible || !cards || !cards[cardIndex]?._id) {
        return;
      }

      const currentCard = cards[cardIndex];
      const cardId = String(currentCard._id);

      if (shouldCallApi) {
        likeUserAPICall(cardId, currentCard);
      }

      store.dispatch(swipeAction(cardId));
    } catch (error) {}
  };

  const onSwipeRightCard = (cardIndex: number) => {
    swipeCardAction(cardIndex, onSwipeRight, true);
  };

  const onSwipeLeftCard = (cardIndex: number) => {
    swipeCardAction(cardIndex, onSwipeLeft);
  };

  const onSwipedCard = async (cardIndex: any) => {
    try {
      if (!IsNetConnected) {
        showToast(TextString.error.toUpperCase(), TextString.PleaseCheckYourInternetConnection, TextString.error);
        swipeRef.current?.swipeBack();
        return;
      }

      setCurrentImageIndex(0);
      setCurrentCardIndex(cardIndex + 1);

      swipeCountRef.current += 1;
      if (swipeCountRef.current >= 5) {
        swipeCountRef.current = 0;
        showModal();
      }

      if ((swipeCount + 1) % adSwipeThreshold === 0 && !subscription.isActive) {
        setTimeout(async () => {
          try {
            if (appOpenAdLoaded) {
              await appOpenAd.show();
            } else if (interstitialAdLoaded) {
              await interstitialAd.show();
            }
          } catch (error) {
          } finally {
            interstitialAd.load();
            appOpenAd.load();
          }
        }, 1000);
      }
    } catch (error) {}
  };

  const onSwipedAllCard = useCallback(async () => {
    if (isRequestInProgressRef.current || IsAPILoading) {
      return;
    }

    try {
      isRequestInProgressRef.current = true;
      setIsAPILoading(true);

      const newSkipNumber = currentSkipNumberRef.current + CardLimit;
      currentSkipNumberRef.current = newSkipNumber;

      setCardToSkipNumber(newSkipNumber);
      dispatch(setCardSkipNumber(newSkipNumber));

      await fetchAPIData(newSkipNumber);

      dispatch(resetSwipeCount());

      if (swipeRef.current) {
        swipeRef.current.forceUpdate();
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), TextString.error);
    } finally {
      isRequestInProgressRef.current = false;
      setIsAPILoading(false);
    }
  }, [fetchAPIData, CardLimit, IsAPILoading, dispatch]);

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

  const likeUserAPICall = async (id: string, cardData: ProfileType) => {
    if (!IsNetConnected) {
      showToast(TextString.error.toUpperCase(), TextString.PleaseCheckYourInternetConnection, TextString.error);
      return;
    }

    try {
      const APIResponse = await UserService.UserRegister({ eventName: 'like', like_to: id });

      if (APIResponse?.code === 200) {
        if (APIResponse.data?.status === 'match') {
          setMatchedUserInfo(cardData);
          setIsMatchModalVisible(true);
        }
      } else {
        showToast(TextString.error.toUpperCase(), APIResponse?.message || 'Please try again letter', TextString.error);
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), TextString.error);
    } finally {
      setIsAPILoading(false);
      swipeRef.current?.forceUpdate();
    }
  };

  if (IsAPILoading) {
    return (
      <GradientView>
        <BottomTabHeader showSetting={true} hideSettingAndNotification={false} />
        <View style={[styles.container, styles.LoaderContainer]}>
          <ActivityIndicator size={'large'} color={colors.Primary} />
        </View>
      </GradientView>
    );
  }

  if (!IsNetConnected && !IsAPILoading) {
    return (
      <GradientView>
        <BottomTabHeader showSetting={true} hideSettingAndNotification={false} />
        <View style={[styles.container, styles.LoaderContainer]}>
          <Text style={styles.NoNetText}>
            Unable to establish an internet connection at the moment. Please check your network settings and try again."
          </Text>
        </View>
      </GradientView>
    );
  }

  return (
    <GradientView>
      <View style={[styles.container, { paddingBottom: BOTTOM_TAB_HEIGHT }]}>
        <BottomTabHeader showSetting={true} hideSettingAndNotification={false} />
        <View style={[styles.SwiperContainer, { flex: cards?.length !== 0 ? 0.9 : 1 }]}>
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
              cardStyle={{
                height: '100%',
                borderWidth: 0.8,
                overflow: 'hidden',
                borderRadius: hp('4%'),
                borderColor: isDark ? colors.White : 'transparent',
              }}
              overlayOpacityHorizontalThreshold={1}
              onSwiping={() => stopInterval()}
              onSwipedAborted={() => startInterval()}
              inputOverlayLabelsOpacityRangeX={
                Platform.OS === 'ios' ? [-width / 3, -1, 0, 1, width / 3] : [-width / 3, -1, 0, 1, width / 3]
              }
              overlayLabels={{
                left: {
                  element: <Image source={CommonIcons.dislike_button} style={styles.LeftImage} />,
                },
                right: {
                  element: <Image source={CommonIcons.like_button} style={styles.RightImage} />,
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
                <Text style={[styles.EmptyCardText, { color: colors.TextColor }]}>
                  Ready to find your match? Let's adjust your preferences to discover meaningful connections.
                </Text>

                <View style={{ marginTop: 15 }}>
                  <GradientButton
                    Disabled={false}
                    isLoading={false}
                    Title="Change Setting"
                    Navigation={() => navigation.navigate('Setting')}
                  />
                </View>
              </View>
            )
          )}
        </View>

        {cards?.length !== 0 && (
          <View style={styles.LikeAndRejectView}>
            <Pressable onPress={SwipeLeft} style={styles.LikeAndRejectButtonView}>
              <Image
                resizeMode="contain"
                style={styles.DislikeButton}
                source={isDark ? CommonIcons.dark_dislike_button : CommonIcons.dislike_button}
              />
            </Pressable>

            <Pressable onPress={SwipeRight} style={styles.LikeAndRejectButtonView}>
              <Image resizeMode="contain" style={styles.LikeButton} source={CommonIcons.like_button} />
            </Pressable>

            <LinearGradient colors={['rgba(92, 196, 255, 1)', 'rgba(12, 145, 219, 1)']} style={styles.infoIconView}>
              <Pressable
                onPress={() => {
                  cards?.[CurrentCardIndex] &&
                    navigation.navigate('ExploreCardDetail', { props: cards?.[CurrentCardIndex] });
                }}
                style={styles.infoButton}
              >
                <Image resizeMode="contain" style={styles.infoIcon} source={CommonIcons.ic_info_shape} />
              </Pressable>
            </LinearGradient>
          </View>
        )}

        <ItsAMatch
          isVisible={!IsAPILoading && isMatchModalVisible}
          onClose={() => {
            setIsMatchModalVisible(false);
            setMatchedUserInfo(null);
          }}
          user={MatchedUserInfo}
          onSayHiClick={() => {
            if (!subscription.isActive) {
              Alert.alert(TextString.premiumFeatureAccessTitle, TextString.premiumFeatureAccessDescription, [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Upgrade',
                  onPress: () => {
                    showSubscriptionModal();
                  },
                },
              ]);

              return;
            }

            setIsMatchModalVisible(false);
            navigation.navigate('Chat', {
              id: MatchedUserInfo?._id?.toString(),
            });
          }}
          onCloseModalClick={() => {
            setIsMatchModalVisible(false);
            setMatchedUserInfo(null);
          }}
          setItsMatch={setIsMatchModalVisible}
        />
      </View>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  LikeAndRejectView: {
    flex: 0.15,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  LikeAndRejectButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: hp('0.4%'),
  },
  DislikeButton: {
    padding: 0,
    width: hp('7.2%'),
    height: hp('7.2%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  LikeButton: {
    padding: 0,
    width: hp('9%'),
    height: hp('9%'),
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
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'center',
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
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
  infoIconView: {
    marginHorizontal: hp('0.4%'),
    width: 50,
    height: 50,
    bottom: Platform.OS === 'ios' ? 2.5 : 0,
    marginLeft: 10,
    borderRadius: 500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  infoIcon: {
    width: Platform.OS === 'ios' ? '48%' : '55%',
    height: Platform.OS === 'ios' ? '48%' : '55%',
  },
});

export default memo(ExploreCardScreen);
