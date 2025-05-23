/* eslint-disable react-hooks/exhaustive-deps */

import { useIsFocused, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React, { memo, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CommonIcons from '../../../Common/CommonIcons';
import GradientView from '../../../Common/GradientView';
import TextString from '../../../Common/TextString';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import Paginator from '../../../Components/Paginator';
import ReportUserModalView from '../../../Components/ReportUserModalView';
import ApiConfig from '../../../Config/ApiConfig';
import { useSubscriptionModal } from '../../../Contexts/SubscriptionModalContext';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useUserData } from '../../../Contexts/UserDataContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { useShareProfile } from '../../../Hooks/useShareProfile';
import { onSwipeLeft, onSwipeRight } from '../../../Redux/Action/actions';
import { store } from '../../../Redux/Store/store';
import UserService from '../../../Services/AuthService';
import type { ProfileType } from '../../../Types/ProfileType';
import { useCustomToast } from '../../../Utils/toastUtils';

import DetailCardHeader from './Components/DetailCardHeader';
import RenderUserImagesView from './Components/RenderUserImagesView';

type DetailCardRouteParams = {
  props: ProfileType;
};

function ExploreCardDetailScreen() {
  const { colors, isDark } = useTheme();
  const isFocused = useIsFocused();
  const navigation = useCustomNavigation();
  const { showToast } = useCustomToast();
  const { subscription } = useUserData();
  const { showSubscriptionModal } = useSubscriptionModal();
  const shareProfile = useShareProfile();

  const cardDetail = useRoute<RouteProp<Record<string, DetailCardRouteParams>, string>>();

  const route = useRoute();
  const { id } = route.params as any;

  const scrollX = useRef(new Animated.Value(0)).current;
  const userId = id || cardDetail?.params?.props?._id || {};

  const [cardData, setCardData] = useState<ProfileType>();
  const [isLoading, setIsAPILoading] = useState(true);
  const [SelectedReportReason, setSelectedReportReason] = useState<string>('');
  const [showReportModalView, setShowReportModalView] = useState<boolean>(false);

  useEffect(() => {
    if (isFocused) {
      setIsAPILoading(!cardData);
      getUserData();
    }
  }, [isFocused]);

  const getUserData = async () => {
    try {
      const userDataForApi = {
        eventName: 'get_other_profile',
        id: userId,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        if (APIResponse.data) {
          setCardData(APIResponse.data);
        }
      } else {
        showToast('Error', APIResponse?.message || 'Please try again letter', TextString.error);
        setCardData({} as ProfileType);
      }
    } catch (error) {
    } finally {
      setIsAPILoading(false);
    }
  };

  const onLikePress = async () => {
    try {
      if (userId) {
        const userDataForApi = {
          eventName: 'like',
          like_to: userId,
        };

        const APIResponse = await UserService.UserRegister(userDataForApi);

        if (APIResponse?.code === 200) {
          store.dispatch(onSwipeRight(String(userId)));
          showToast(
            'Swipe Right Success',
            'You swiped right! Waiting for the other user to match.',
            'success',
          );

          navigation.canGoBack() && navigation.goBack();
        } else {
          showToast(
            TextString.error.toUpperCase(),
            APIResponse?.message || 'Please try again letter',
            TextString.error,
          );
        }
      } else {
        showToast(
          TextString.error.toUpperCase(),
          "Can't find user, please try again letter",
          TextString.error,
        );
      }
    } catch (error: any) {
      showToast('Error', error?.message?.toString(), 'error');
    }
  };

  const onRejectPress = async () => {
    try {
      if (userId) {
        store.dispatch(onSwipeLeft(String(userId)));
        navigation.canGoBack() && navigation.goBack();
      } else {
        showToast(
          TextString.error.toUpperCase(),
          "Can't find user please try again letter",
          TextString.error,
        );
      }
    } catch (error: any) {
      showToast('Error', error?.message?.toString(), 'error');
    }
  };

  const onSharePress = async () => {
    try {
      await shareProfile(cardDetail);
    } catch (error: any) {
      showToast('Error', error?.message?.toString() || 'Failed to share profile', 'error');
    }
  };

  const onBlockProfileClick = async () => {
    try {
      if (!subscription.isActive) {
        showToast(
          TextString.premiumFeatureAccessTitle,
          TextString.premiumFeatureAccessDescription,
          'error',
        );

        setTimeout(() => {
          showSubscriptionModal();
        }, 2000);

        return;
      }

      const BlockData = {
        eventName: ApiConfig.BlockProfile,
        blocked_to: userId,
      };

      const APIResponse = await UserService.UserRegister(BlockData);

      if (APIResponse && APIResponse?.code === 200) {
        store.dispatch(onSwipeLeft(String(userId)));
        showToast(
          'User Blocked',
          `Your request to block ${cardDetail.params?.props?.full_name} is successfully send`,
          'success',
        );

        navigation.canGoBack() && navigation.goBack();
      } else {
        showToast(
          TextString.error.toUpperCase(),
          String(APIResponse?.message) || 'Something went wrong',
          TextString.error,
        );
      }
    } catch (error: any) {
      showToast('Error', error?.message?.toString(), 'error');
    }
  };

  const onReportProfileClick = async () => {
    try {
      setShowReportModalView(false);
      const BlockData = {
        eventName: ApiConfig.ReportProfile,
        blocked_to: userId,
        reason: SelectedReportReason,
      };

      const APIResponse = await UserService.UserRegister(BlockData);

      if (APIResponse && APIResponse?.code === 200) {
        store.dispatch(onSwipeLeft(String(userId)));
        showToast(
          'Success!',
          `Your report against ${cardDetail.params?.props?.full_name} has been submitted. We appreciate your vigilance in maintaining a positive community.\nReason: ${SelectedReportReason}`,
          'success',
        );

        navigation.canGoBack() && navigation.goBack();
      } else {
        showToast(
          TextString.error.toUpperCase(),
          String(APIResponse?.message) || 'Something went wrong',
          TextString.error,
        );
      }
    } catch (error: any) {
      showToast('Error', error?.message?.toString(), 'error');
    }
  };

  if (isLoading) {
    return (
      <GradientView>
        <DetailCardHeader props={cardData} />
        <View style={[styles.Container, styles.LoaderContainer]}>
          <ActivityIndicator size="large" color={colors.Primary} />
        </View>
      </GradientView>
    );
  }

  return (
    <GradientView>
      <View style={styles.Container}>
        <DetailCardHeader props={cardData} />
        <View style={styles.ContentView}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ScrollViewContentContainerStyle}
          >
            <View style={styles.ProfileImageView}>
              {cardData?.recent_pik && cardData?.recent_pik?.length !== 0 && (
                <Animated.FlatList
                  horizontal={true}
                  pagingEnabled={true}
                  style={{ flex: 1, width: '100%' }}
                  showsHorizontalScrollIndicator={false}
                  data={cardData?.recent_pik}
                  renderItem={({ item, index }) => {
                    return <RenderUserImagesView Images={item} index={index} />;
                  }}
                  onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                  })}
                  scrollEventThrottle={32}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
              {cardData && cardData?.recent_pik?.length > 1 && (
                <Paginator data={cardData?.recent_pik} scrollX={scrollX} />
              )}
            </View>

            <View style={styles.UserInfoContainerView}>
              {/* About Me */}
              {cardData?.about && (
                <View
                  style={[
                    styles.DetailBoxContainerView,
                    { backgroundColor: colors.lightBackground },
                  ]}
                >
                  <View style={styles.TitleAndIconView}>
                    <Image
                      style={styles.DetailIconsView}
                      tintColor={isDark ? colors.TextColor : colors.TitleText}
                      resizeMode="contain"
                      source={CommonIcons.about_me_icon}
                    />
                    <Text
                      style={[
                        styles.TitleText,
                        { color: isDark ? colors.TextColor : colors.TitleText },
                      ]}
                      numberOfLines={1}
                    >
                      About me
                    </Text>
                  </View>
                  <Text style={[styles.DetailText, { color: colors.TextColor }]}>
                    {cardData?.about || ''}
                  </Text>
                </View>
              )}

              {cardData?.birthdate && (
                <View
                  style={[
                    styles.DetailBoxContainerView,
                    { backgroundColor: colors.lightBackground },
                  ]}
                >
                  <View style={styles.TitleAndIconView}>
                    <Image
                      style={styles.DetailIconsView}
                      tintColor={isDark ? colors.TextColor : colors.TitleText}
                      resizeMode="contain"
                      source={CommonIcons.birthday_icon}
                    />
                    <Text
                      style={[
                        styles.TitleText,
                        { color: isDark ? colors.TextColor : colors.TitleText },
                      ]}
                      numberOfLines={1}
                    >
                      Birthday
                    </Text>
                  </View>
                  <Text style={[styles.DetailText, { color: colors.TextColor }]}>
                    {cardData?.birthdate || 0}
                  </Text>
                </View>
              )}

              {cardData?.hoping &&
                cardData?.hoping?.length !== 0 &&
                cardData?.hoping?.length !== undefined && (
                  <View
                    style={[
                      styles.DetailBoxContainerView,
                      { backgroundColor: colors.lightBackground },
                    ]}
                  >
                    <View style={styles.TitleAndIconView}>
                      <Image
                        style={styles.DetailIconsView}
                        tintColor={isDark ? colors.TextColor : colors.TitleText}
                        resizeMode="contain"
                        source={CommonIcons.looking_for_icon}
                      />
                      <Text
                        style={[
                          styles.TitleText,
                          { color: isDark ? colors.TextColor : colors.TitleText },
                        ]}
                        numberOfLines={1}
                      >
                        Looking for
                      </Text>
                    </View>
                    <Text style={[styles.DetailText, { color: colors.TextColor }]}>
                      {cardData?.hoping}
                    </Text>
                  </View>
                )}

              {cardData?.orientation !== undefined && cardData?.orientation?.length !== 0 && (
                <View
                  style={[
                    styles.DetailBoxContainerView,
                    { backgroundColor: colors.lightBackground },
                  ]}
                >
                  <View style={styles.TitleAndIconView}>
                    <Image
                      style={styles.DetailIconsView}
                      tintColor={isDark ? colors.TextColor : colors.TitleText}
                      resizeMode="contain"
                      source={CommonIcons.interested_in_icon}
                    />
                    <Text
                      style={[
                        styles.TitleText,
                        { color: isDark ? colors.TextColor : colors.TitleText },
                      ]}
                      numberOfLines={1}
                    >
                      Interested in
                    </Text>
                  </View>
                  <View style={styles.MultipleBoxFlexView}>
                    {cardData?.orientation &&
                      cardData?.orientation?.map((orientation, index) => {
                        return (
                          <LinearGradient
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            colors={isDark ? colors.ButtonGradient : ['transparent', 'transparent']}
                            key={index}
                            style={[
                              styles.MultipleBoxView,
                              !isDark && { borderWidth: 1, borderColor: colors.Black },
                            ]}
                          >
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                              <Text
                                style={[styles.MultipleDetailText, { color: colors.TextColor }]}
                                key={index}
                              >
                                {`${orientation}` || ''}
                              </Text>
                            </View>
                          </LinearGradient>
                        );
                      })}
                  </View>
                </View>
              )}

              {cardData?.city && (
                <View
                  style={[
                    styles.DetailBoxContainerView,
                    { backgroundColor: colors.lightBackground },
                  ]}
                >
                  <View style={styles.TitleAndIconView}>
                    <Image
                      style={styles.DetailIconsView}
                      tintColor={isDark ? colors.TextColor : colors.TitleText}
                      resizeMode="contain"
                      source={CommonIcons.location_icon}
                    />
                    <Text
                      style={[
                        styles.TitleText,
                        { color: isDark ? colors.TextColor : colors.TitleText },
                      ]}
                      numberOfLines={1}
                    >
                      Location
                    </Text>
                  </View>
                  <Text style={[styles.DetailText, { color: colors.TextColor }]}>
                    {cardData?.city || 'City'}
                  </Text>
                </View>
              )}

              {cardData?.education?.college_name && cardData?.education?.college_name && (
                <View
                  style={[
                    styles.DetailBoxContainerView,
                    { backgroundColor: colors.lightBackground },
                  ]}
                >
                  <View style={styles.TitleAndIconView}>
                    <Image
                      style={styles.DetailIconsView}
                      tintColor={isDark ? colors.TextColor : colors.TitleText}
                      resizeMode="contain"
                      source={CommonIcons.education_icon}
                    />
                    <Text
                      style={[
                        styles.TitleText,
                        { color: isDark ? colors.TextColor : colors.TitleText },
                      ]}
                      numberOfLines={1}
                    >
                      Education
                    </Text>
                  </View>
                  <Text style={[styles.DetailText, { color: colors.TextColor }]}>
                    {cardData?.education?.college_name || ''}, {cardData?.education?.digree || ''}
                  </Text>
                </View>
              )}

              {cardData?.likes_into &&
                Array.isArray(cardData?.likes_into) &&
                cardData?.likes_into[0] !== '' &&
                cardData?.likes_into[0]?.length > 0 && (
                  <View
                    style={[
                      styles.DetailBoxContainerView,
                      { backgroundColor: colors.lightBackground },
                    ]}
                  >
                    <View style={styles.TitleAndIconView}>
                      <Image
                        style={styles.DetailIconsView}
                        tintColor={isDark ? colors.TextColor : colors.TitleText}
                        resizeMode="contain"
                        source={CommonIcons.i_like_icon}
                      />
                      <Text
                        style={[
                          styles.TitleText,
                          { color: isDark ? colors.TextColor : colors.TitleText },
                        ]}
                        numberOfLines={1}
                      >
                        I like
                      </Text>
                    </View>
                    <View style={styles.MultipleBoxFlexView}>
                      {cardData?.likes_into?.map((ILikeItem, index) => (
                        <LinearGradient
                          start={{ x: 1, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          colors={isDark ? colors.ButtonGradient : ['transparent', 'transparent']}
                          key={index}
                          style={[
                            styles.MultipleBoxView,
                            !isDark && { borderWidth: 1, borderColor: colors.Black },
                          ]}
                        >
                          <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={[styles.MultipleDetailText, { color: colors.TextColor }]}>
                              {`${ILikeItem}` || ''}
                            </Text>
                          </View>
                        </LinearGradient>
                      ))}
                    </View>
                  </View>
                )}

              <View style={styles.BlockAndReportProfileView}>
                <Pressable
                  onPress={onBlockProfileClick}
                  style={[
                    styles.BlockAndReportButtonView,
                    {
                      opacity: !subscription.isActive ? 0.5 : 1,
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.White,
                      borderColor: isDark ? 'transparent' : colors.Black,
                    },
                  ]}
                >
                  <Image
                    resizeMode="contain"
                    tintColor={colors.TextColor}
                    style={styles.BlockAndReportIcon}
                    source={CommonIcons.block_profile_icon}
                  />
                  <Text style={[styles.BlockAndReportText, { color: colors.TextColor }]}>
                    Block Profile
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setShowReportModalView(!showReportModalView)}
                  style={[
                    styles.BlockAndReportButtonView,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : colors.White,
                      borderColor: isDark ? 'transparent' : colors.Black,
                    },
                  ]}
                >
                  <Image
                    resizeMode="contain"
                    tintColor={colors.TextColor}
                    style={styles.BlockAndReportIcon}
                    source={CommonIcons.report_profile_icon}
                  />
                  <Text style={[styles.BlockAndReportText, { color: colors.TextColor }]}>
                    Report Profile
                  </Text>
                </Pressable>
              </View>

              <View style={styles.LikeAndRejectView}>
                <Pressable onPress={onRejectPress} style={styles.LikeAndRejectButtonView}>
                  <Image
                    resizeMode="contain"
                    style={styles.DislikeButton}
                    source={CommonIcons.dislike_button}
                  />
                </Pressable>

                <Pressable onPress={onLikePress} style={styles.LikeAndRejectButtonView}>
                  <Image
                    resizeMode="contain"
                    style={styles.LikeButton}
                    source={CommonIcons.like_button}
                  />
                </Pressable>

                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={
                    isDark
                      ? ['rgba(149, 119, 253, 1)', 'rgba(32, 20, 70, 1)']
                      : ['rgba(175, 152, 255, 1)', 'rgba(94, 74, 162, 1)']
                  }
                  style={[styles.ShareButtonView, { opacity: !subscription.isActive ? 0.5 : 1 }]}
                >
                  <Pressable onPress={onSharePress} style={styles.shareButton}>
                    <Image
                      resizeMode="contain"
                      style={styles.ShareIcon}
                      source={CommonIcons.ic_share}
                    />
                  </Pressable>
                </LinearGradient>
              </View>
            </View>

            <ReportUserModalView
              Visible={showReportModalView}
              setVisibility={setShowReportModalView}
              onReportPress={onReportProfileClick}
              SelectedReportReason={SelectedReportReason}
              setSelectedReportReason={setSelectedReportReason}
            />
          </ScrollView>
        </View>
      </View>
    </GradientView>
  );
}

export default memo(ExploreCardDetailScreen);

const styles = StyleSheet.create({
  BlockAndReportButtonView: {
    alignItems: 'center',
    borderRadius: hp('5%'),
    borderWidth: 1,
    flexDirection: 'row',
    height: hp('6.8%'),
    justifyContent: 'center',
    marginHorizontal: hp('0.5%'),
    marginVertical: hp('2%'),
    overflow: 'hidden',
    paddingHorizontal: hp('1%'),
    width: '47%',
  },
  BlockAndReportIcon: {
    height: hp('2.4%'),
    width: hp('2.4%'),
  },
  BlockAndReportProfileView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  BlockAndReportText: {
    color: COLORS.Black,
    fontFamily: FONTS.Bold,
    fontSize: hp('1.8%'),
    marginHorizontal: hp('0.5%'),
  },
  Container: {
    flex: 1,
  },
  ContentView: {
    alignSelf: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  DetailBoxContainerView: {
    borderRadius: hp('4%'),
    marginVertical: hp('1%'),
    paddingHorizontal: hp('2%'),
    paddingVertical: hp('1.5%'),
  },
  DetailIconsView: {
    height: hp('2.4%'),
    width: hp('2.4%'),
  },
  DetailText: {
    alignSelf: 'flex-end',
    fontFamily: FONTS.Regular,
    fontSize: hp('1.8%'),
    justifyContent: 'center',
    paddingVertical: hp('0.8%'),
    width: '91.5%',
  },
  DislikeButton: {
    alignSelf: 'center',
    height: hp('7.2%'),
    justifyContent: 'center',
    padding: 0,
    width: hp('7.2%'),
  },
  ImageCarousel: {
    alignSelf: 'center',
    borderRadius: hp('4%'),
    justifyContent: 'center',
    marginVertical: hp('2%'),
  },
  ImageLoaderView: {
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 9999,
  },
  LikeAndRejectButtonView: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginHorizontal: hp('0.4%'),
  },
  LikeAndRejectView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 30 : 0,
    marginTop: hp('3%'),
    width: '100%',
  },
  LikeButton: {
    alignSelf: 'center',
    height: hp('9%'),
    justifyContent: 'center',
    padding: 0,
    width: hp('9%'),
  },
  LoaderContainer: {
    justifyContent: 'center',
  },
  MultipleBoxFlexView: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
    width: '92%',
  },
  MultipleBoxView: {
    borderRadius: hp('2%'),
    marginRight: hp('1%'),
    marginTop: hp('1%'),
    overflow: 'hidden',
    paddingHorizontal: hp('1.5%'),
  },
  MultipleDetailText: {
    alignSelf: 'flex-end',
    color: 'rgba(108, 108, 108, 1)',
    fontFamily: FONTS.Regular,
    fontSize: hp('1.8%'),
    justifyContent: 'center',
    paddingVertical: hp('0.8%'),
  },
  ProfileImageView: {
    alignSelf: 'center',
    borderRadius: 20,
    height: 430,
    overflow: 'hidden',
    width: '100%',
  },
  ScrollViewContentContainerStyle: {
    alignSelf: 'center',
    paddingBottom: hp('10%'),
    width: '100%',
  },
  ShareButtonView: {
    alignSelf: 'center',
    backgroundColor: 'yellow',
    borderRadius: 5000,
    height: 50,
    justifyContent: 'center',
    margin: hp('1.25%'),
    width: 50,
  },
  ShareIcon: {
    alignSelf: 'center',
    height: hp('3.2%'),
    justifyContent: 'center',
    width: hp('3.2%'),
  },
  TitleAndIconView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: hp('0.5%'),
  },
  TitleText: {
    ...GROUP_FONT.h3,
    justifyContent: 'center',
    paddingHorizontal: hp('0.7%'),
  },
  UserInfoContainerView: {
    alignSelf: 'center',
    width: '90%',
  },
  UserProfileImages: {
    height: 350,
    width: Dimensions.get('screen').width,
  },
  shareButton: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});
