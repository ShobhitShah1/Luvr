/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../Common/CommonIcons';
import {ActiveOpacity, COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import Paginator from '../../../Components/Paginator';
import ReportUserModalView from '../../../Components/ReportUserModalView';
import ApiConfig from '../../../Config/ApiConfig';
import {onSwipeLeft, onSwipeRight} from '../../../Redux/Action/actions';
import {store} from '../../../Redux/Store/store';
import UserService from '../../../Services/AuthService';
import {ProfileType} from '../../../Types/ProfileType';
import {useCustomToast} from '../../../Utils/toastUtils';
import DetailCardHeader from './Components/DetailCardHeader';
import RenderUserImagesView from './Components/RenderUserImagesView';
import TextString from '../../../Common/TextString';

type DetailCardRouteParams = {
  props: ProfileType;
};

const ExploreCardDetailScreen = () => {
  const CardDetail =
    useRoute<RouteProp<Record<string, DetailCardRouteParams>, string>>();

  const scrollX = useRef(new Animated.Value(0)).current;
  const {showToast} = useCustomToast();
  const UserID = CardDetail.params.props?._id || {};
  const IsFocused = useIsFocused();
  const [CurrentIndex, setCurrentIndex] = useState<number>(0);
  const [CardData, setCardData] = useState<ProfileType>();
  const [IsAPILoading, setIsAPILoading] = useState(true);
  const navigation = useNavigation();
  const [SelectedReportReason, setSelectedReportReason] = useState<string>('');
  const [ShowReportModalView, setShowReportModalView] =
    useState<boolean>(false);

  useEffect(() => {
    if (IsFocused) {
      GetUserData();
    }
  }, [IsFocused]);

  const GetUserData = async () => {
    setIsAPILoading(true);
    try {
      const userDataForApi = {
        eventName: 'get_other_profile',
        id: UserID,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        if (APIResponse.data) {
          setCardData(APIResponse.data);
        }
      } else {
        showToast(
          TextString.error.toUpperString(),
          APIResponse?.message || 'Please try again letter',
          TextString.error,
        );
        setCardData({} as ProfileType);
      }
    } catch (error) {
      console.log('Something Went Wrong With Feting API Data');
    } finally {
      setIsAPILoading(false);
    }
  };

  const viewableItemsChanged = useRef(({viewableItems}: any) => {
    setCurrentIndex(viewableItems[0]?.index);
  }).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const onLikePress = async () => {
    if (UserID) {
      const userDataForApi = {
        eventName: 'like',
        like_to: UserID,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        if (APIResponse.data?.status === 'match') {
        }
        store.dispatch(onSwipeRight(String(UserID)));
        showToast(
          'Swipe Right Success',
          'You swiped right! Waiting for the other user to match.',
          'success',
        );
        navigation.goBack();
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
        "Can't find UserID please try again letter",
        TextString.error,
      );
    }
  };

  const onRejectPress = async () => {
    if (UserID) {
      store.dispatch(onSwipeLeft(String(UserID)));
      navigation.goBack();
    } else {
      showToast(
        TextString.error.toUpperCase(),
        "Can't find UserID please try again letter",
        TextString.error,
      );
    }
  };

  const onBlockProfileClick = async () => {
    const BlockData = {
      eventName: ApiConfig.BlockProfile,
      blocked_to: UserID,
    };
    const APIResponse = await UserService.UserRegister(BlockData);

    if (APIResponse && APIResponse?.code === 200) {
      store.dispatch(onSwipeLeft(String(UserID)));
      showToast(
        'User Blocked',
        `Your request to block ${CardDetail.params?.props?.full_name} is successfully send`,
        'success',
      );
      navigation.goBack();
    } else {
      showToast(
        TextString.error.toUpperCase(),
        String(APIResponse?.message) || 'Something went wrong',
        TextString.error,
      );
    }
  };

  const onReportProfileClick = async () => {
    setShowReportModalView(false);
    const BlockData = {
      eventName: ApiConfig.ReportProfile,
      blocked_to: UserID,
      reason: SelectedReportReason,
    };
    const APIResponse = await UserService.UserRegister(BlockData);

    console.log('Report APIResponse', APIResponse);

    if (APIResponse && APIResponse?.code === 200) {
      store.dispatch(onSwipeLeft(String(UserID)));
      showToast(
        'Success!',
        `Your report against ${CardDetail.params?.props?.full_name} has been submitted. We appreciate your vigilance in maintaining a positive community.\nReason: ${SelectedReportReason}`,
        'success',
      );
      navigation.goBack();
    } else {
      showToast(
        TextString.error.toUpperCase(),
        String(APIResponse?.message) || 'Something went wrong',
        TextString.error,
      );
    }
  };

  if (IsAPILoading) {
    return (
      <React.Fragment>
        <DetailCardHeader props={CardData} />
        <View style={[styles.Container, styles.LoaderContainer]}>
          <ActivityIndicator size={'large'} color={COLORS.Primary} />
        </View>
      </React.Fragment>
    );
  }

  return (
    <View style={styles.Container}>
      <DetailCardHeader props={CardData} />
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.White} />

      <View style={styles.ContentView}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ScrollViewContentContainerStyle}>
          <View style={styles.ProfileImageView}>
            {CardData?.recent_pik?.length !== 0 && (
              <Animated.FlatList
                horizontal={true}
                pagingEnabled={true}
                style={{flex: 1, width: '100%'}}
                showsHorizontalScrollIndicator={false}
                data={CardData?.recent_pik}
                renderItem={({item, index}) => {
                  return <RenderUserImagesView Images={item} index={index} />;
                }}
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {x: scrollX}}}],
                  {
                    useNativeDriver: false,
                  },
                )}
                scrollEventThrottle={32}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
            {CardData && CardData?.recent_pik?.length > 1 && (
              <Paginator data={CardData?.recent_pik} scrollX={scrollX} />
            )}
          </View>

          <View style={styles.UserInfoContainerView}>
            {/* About Me */}
            {CardData?.about && (
              <View style={styles.DetailBoxContainerView}>
                <View style={styles.TitleAndIconView}>
                  <Image
                    style={styles.DetailIconsView}
                    resizeMode="contain"
                    source={CommonIcons.about_me_icon}
                  />
                  <Text style={styles.TitleText} numberOfLines={1}>
                    About me
                  </Text>
                </View>
                <Text style={styles.DetailText}>{CardData?.about || ''}</Text>
              </View>
            )}

            {CardData?.birthdate && (
              <View style={styles.DetailBoxContainerView}>
                <View style={styles.TitleAndIconView}>
                  <Image
                    style={styles.DetailIconsView}
                    resizeMode="contain"
                    source={CommonIcons.birthday_icon}
                  />
                  <Text style={styles.TitleText} numberOfLines={1}>
                    Birthday
                  </Text>
                </View>
                <Text style={styles.DetailText}>
                  {CardData?.birthdate || 0}
                </Text>
              </View>
            )}

            {CardData?.hoping &&
              CardData?.hoping?.length !== 0 &&
              CardData?.hoping?.length !== undefined && (
                <View style={styles.DetailBoxContainerView}>
                  <View style={styles.TitleAndIconView}>
                    <Image
                      style={styles.DetailIconsView}
                      resizeMode="contain"
                      source={CommonIcons.looking_for_icon}
                    />
                    <Text style={styles.TitleText} numberOfLines={1}>
                      Looking for
                    </Text>
                  </View>
                  <Text style={styles.DetailText}>{CardData?.hoping}</Text>
                </View>
              )}

            {CardData?.orientation !== undefined &&
              CardData?.orientation?.length !== 0 && (
                <View style={styles.DetailBoxContainerView}>
                  <View style={styles.TitleAndIconView}>
                    <Image
                      style={styles.DetailIconsView}
                      resizeMode="contain"
                      source={CommonIcons.interested_in_icon}
                    />
                    <Text style={styles.TitleText} numberOfLines={1}>
                      Interested in
                    </Text>
                  </View>
                  <View style={styles.MultipleBoxFlexView}>
                    {CardData?.orientation &&
                      CardData?.orientation?.map((orientation, index) => {
                        return (
                          <View key={index} style={styles.MultipleBoxView}>
                            <Text style={styles.MultipleDetailText} key={index}>
                              {`${orientation}` || ''}
                            </Text>
                          </View>
                        );
                      })}
                  </View>
                </View>
              )}

            {CardData?.city && (
              <View style={styles.DetailBoxContainerView}>
                <View style={styles.TitleAndIconView}>
                  <Image
                    style={styles.DetailIconsView}
                    resizeMode="contain"
                    source={CommonIcons.location_icon}
                  />
                  <Text style={styles.TitleText} numberOfLines={1}>
                    Location
                  </Text>
                </View>
                <Text style={styles.DetailText}>
                  {CardData?.city || 'City'}
                </Text>
              </View>
            )}

            {CardData?.education?.college_name &&
              CardData?.education?.college_name && (
                <View style={styles.DetailBoxContainerView}>
                  <View style={styles.TitleAndIconView}>
                    <Image
                      style={styles.DetailIconsView}
                      resizeMode="contain"
                      source={CommonIcons.education_icon}
                    />
                    <Text style={styles.TitleText} numberOfLines={1}>
                      Education
                    </Text>
                  </View>
                  <Text style={styles.DetailText}>
                    {CardData?.education?.college_name || ''},{' '}
                    {CardData?.education?.digree || ''}
                  </Text>
                </View>
              )}

            {CardData?.likes_into &&
              Array.isArray(CardData?.likes_into) &&
              CardData?.likes_into[0] !== '' &&
              CardData?.likes_into[0]?.length > 0 && (
                <View style={styles.DetailBoxContainerView}>
                  <View style={styles.TitleAndIconView}>
                    <Image
                      style={styles.DetailIconsView}
                      resizeMode="contain"
                      source={CommonIcons.i_like_icon}
                    />
                    <Text style={styles.TitleText} numberOfLines={1}>
                      I like
                    </Text>
                  </View>
                  <View style={styles.MultipleBoxFlexView}>
                    {CardData?.likes_into?.map((ILikeItem, index) => (
                      <View key={index} style={styles.MultipleBoxView}>
                        <Text style={styles.MultipleDetailText}>
                          {`${ILikeItem}` || ''}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            <View style={styles.BlockAndReportProfileView}>
              <TouchableOpacity
                onPress={onBlockProfileClick}
                activeOpacity={ActiveOpacity}
                style={styles.BlockAndReportButtonView}>
                <Image
                  resizeMode="contain"
                  style={styles.BlockAndReportIcon}
                  source={CommonIcons.block_profile_icon}
                />
                <Text style={styles.BlockAndReportText}>Block Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowReportModalView(!ShowReportModalView)}
                activeOpacity={ActiveOpacity}
                style={styles.BlockAndReportButtonView}>
                <Image
                  resizeMode="contain"
                  style={styles.BlockAndReportIcon}
                  source={CommonIcons.report_profile_icon}
                />
                <Text style={styles.BlockAndReportText}>Report Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.LikeAndRejectView}>
              <TouchableOpacity
                onPress={onRejectPress}
                activeOpacity={ActiveOpacity}
                style={styles.LikeAndRejectButtonView}>
                <Image
                  resizeMode="contain"
                  style={styles.DislikeButton}
                  source={CommonIcons.dislike_button}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onLikePress}
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

          <ReportUserModalView
            Visible={ShowReportModalView}
            setVisibility={setShowReportModalView}
            onReportPress={onReportProfileClick}
            SelectedReportReason={SelectedReportReason}
            setSelectedReportReason={setSelectedReportReason}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default ExploreCardDetailScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  LoaderContainer: {
    justifyContent: 'center',
  },
  ImageCarousel: {
    alignSelf: 'center',
    borderRadius: hp('4%'),
    justifyContent: 'center',
    marginVertical: hp('2%'),
  },
  UserInfoContainerView: {
    width: '90%',
    alignSelf: 'center',
  },
  ContentView: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  ScrollViewContentContainerStyle: {
    width: '100%',
    alignSelf: 'center',
    paddingBottom: hp('10%'),
  },
  ProfileImageView: {
    height: 430,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  DetailBoxContainerView: {
    borderRadius: hp('4%'),
    marginVertical: hp('1%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: hp('2%'),
    backgroundColor: COLORS.White,
  },
  TitleAndIconView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  DetailIconsView: {
    width: hp('2.4%'),
    height: hp('2.4%'),
  },
  TitleText: {
    ...GROUP_FONT.h3,
    justifyContent: 'center',
    paddingHorizontal: hp('0.7%'),
  },
  DetailText: {
    fontFamily: FONTS.Regular,
    fontSize: hp('1.8%'),
    width: '91.5%',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    paddingVertical: hp('0.8%'),
    color: 'rgba(130, 130, 130, 1)',
  },
  MultipleBoxFlexView: {
    flexDirection: 'row',
    width: '92%',
    flexWrap: 'wrap',
    alignSelf: 'flex-end',
    marginVertical: 5,
  },
  MultipleBoxView: {
    marginTop: hp('1%'),
    borderRadius: hp('2%'),
    borderWidth: hp('0.15%'),
    borderColor: COLORS.Black,
    paddingHorizontal: hp('1.5%'),
    marginRight: hp('1%'),
  },
  MultipleDetailText: {
    fontFamily: FONTS.Regular,
    fontSize: hp('1.8%'),
    alignSelf: 'flex-end',
    justifyContent: 'center',
    paddingVertical: hp('0.8%'),
    color: 'rgba(108, 108, 108, 1)',
  },
  UserProfileImages: {
    height: 350,
    width: Dimensions.get('screen').width,
  },
  BlockAndReportProfileView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BlockAndReportButtonView: {
    width: '47%',
    overflow: 'hidden',
    height: hp('7.5%'),
    marginVertical: hp('2%'),
    borderRadius: hp('5%'),
    backgroundColor: COLORS.White,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.Black,
    paddingHorizontal: hp('1%'),
    marginHorizontal: hp('0.5%'),
  },
  BlockAndReportIcon: {
    width: hp('2.4%'),
    height: hp('2.4%'),
  },
  BlockAndReportText: {
    fontFamily: FONTS.Bold,
    color: COLORS.Black,
    fontSize: hp('1.8%'),
    marginHorizontal: hp('0.5%'),
  },
  LikeAndRejectView: {
    marginTop: hp('3%'),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  LikeAndRejectButtonView: {
    justifyContent: 'center',
    alignSelf: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
  },
  DislikeButton: {
    padding: 0,
    width: hp('10%'),
    height: hp('10%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  LikeButton: {
    padding: 0,
    width: hp('13%'),
    height: hp('13%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  ImageLoaderView: {
    zIndex: 9999,
    alignSelf: 'center',
    position: 'absolute',
    justifyContent: 'center',
  },
});
