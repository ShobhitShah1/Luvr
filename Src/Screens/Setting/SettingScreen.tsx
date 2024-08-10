/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import remoteConfig from '@react-native-firebase/remote-config';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  AppState,
  AppStateStatus,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import {Rating} from 'react-native-ratings';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import CommonIcons from '../../Common/CommonIcons';
import TextString from '../../Common/TextString';
import {ActiveOpacity, COLORS, FONTS} from '../../Common/Theme';
import OpenURL from '../../Components/OpenURL';
import {resetUserData} from '../../Redux/Action/actions';
import UserService from '../../Services/AuthService';
import {ProfileType} from '../../Types/ProfileType';
import {useCustomToast} from '../../Utils/toastUtils';
import EditProfileBoxView from '../Profile/Components/EditProfileComponents/EditProfileBoxView';
import EditProfileTitleView from '../Profile/Components/EditProfileComponents/EditProfileTitleView';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import SettingCustomModal from './Components/SettingCustomModal';
import SettingFlexView from './Components/SettingFlexView';
import styles from './styles';
import {
  ANDROID_APP_VERSION,
  IOS_APP_VERSION,
  PLAYSTORE,
} from '../../Config/Setting';
import {RefreshControl} from 'react-native';
import {getProfileData} from '../../Utils/profileUtils';

const ShowMeArray = ['Male', 'Female', 'Everyone'];
const SOMETHING_WENT_WRONG =
  'Oops! Something went wrong while trying to update your Setting. Please try again later or contact support if the issue persists';

const SettingScreen = () => {
  const dispatch = useDispatch();
  const UserData = useSelector((state: any) => state?.user);
  const [LogOutModalView, setLogOutModalView] = useState(false);
  const [DeleteAccountModalView, setDeleteAccountModalView] = useState(false);
  const [RateUsModalView, setRateUsModalView] = useState(false);
  const [UserSetting, setUserSettingData] = useState<ProfileType>(
    UserData?.userData,
  );
  const {reset} = useNavigation();
  const [RatingCount, setRatingCount] = useState(3);
  const {showToast} = useCustomToast();
  const [IsSettingLoading, setIsSettingLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  let startAge = '';
  let endAge = '';

  const settingAgeRangeMin = UserSetting?.setting_age_range_min || '';

  if (settingAgeRangeMin) {
    [startAge, endAge] = settingAgeRangeMin?.split('-');
  }

  const [RemoteConfigLinks, setRemoteConfigLinks] = useState<any>();

  useEffect(() => {
    Promise.all([getRemoteConfigValue(), checkPermission()]);
  }, []);

  useEffect(() => {
    const Unsubscribe = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => Unsubscribe.remove();
  }, []);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const isInternetConnected = (await NetInfo.fetch()).isConnected;
      const localData = UserData?.userData;

      if (isInternetConnected) {
        if (
          !localData ||
          !localData?.mobile_no ||
          !localData?.setting_age_range_min ||
          !localData?.setting_show_me
        ) {
          setIsSettingLoading(true);
          await getSetting();
        }
      } else {
        showToast('Error', "Please check you'r internet connection", 'error');
      }
    } catch (error: any) {
      showToast('Error', String(error?.message || error), 'error');
    }
  };

  const getRemoteConfigValue = async () => {
    await remoteConfig().fetch(100);
    const GetRemoteConfigLinks = remoteConfig().getAll();
    if (GetRemoteConfigLinks) {
      setRemoteConfigLinks(GetRemoteConfigLinks);
    }
  };

  const handleShowMeSelect = (gender: string) => {
    setUserSettingData(prevState => ({
      ...prevState,
      setting_show_me: gender,
    }));
  };

  const toggleSwitch = () => {
    checkNotifications().then(({status}) => {
      if (status === 'granted') {
        setIsEnabled(true);
      } else {
        requestNotifications(['alert', 'badge', 'sound']).then(
          ({result}: any) => {
            if (result === 'granted') {
              setIsEnabled(true);
            } else {
              setIsEnabled(false);
            }
          },
        );
      }
    });
  };

  const toggleNotification = async () => {
    if (Platform.OS === 'android') {
      const authStatus = await messaging().hasPermission();
      if (authStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
        const authorizationStatus = await messaging().requestPermission();
        if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
          setIsEnabled(true);
        }
      } else {
        Linking.openSettings();
      }
    } else {
      Linking.openURL('app-settings://');
    }
  };

  const checkPermission = async () => {
    checkNotifications().then(({status}) => {
      if (status === 'granted') {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
      }
    });
  };

  const handleAppStateChange = (appState: AppStateStatus) => {
    if (appState === 'active') {
      checkPermission();
    }
  };

  const getSetting = async () => {
    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );
      setIsSettingLoading(false);
      return;
    }

    try {
      const userDataForApi = {
        eventName: 'get_profile',
      };
      const APIResponse = await UserService.UserRegister(userDataForApi);

      if (APIResponse?.code === 200) {
        setUserSettingData({
          ...APIResponse.data,
          setting_show_me: APIResponse?.data?.setting_show_me || 'Everyone',
        });
        await getProfileData();
      } else {
        showToast(
          'Something went wrong',
          APIResponse?.message || 'Please try again later',
          'error',
        );
        setUserSettingData({} as ProfileType);
      }
    } catch (error: any) {
      showToast('Error', String(error?.message || error), 'error');
    } finally {
      setIsSettingLoading(false);
      setRefreshing(false);
    }
  };

  const LogoutPress = async () => {
    const signOutFromGoogle = async () => {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (error: any) {
      } finally {
        dispatch(resetUserData());
        setLogOutModalView(false);
        setTimeout(() => {
          reset({
            index: 0,
            routes: [{name: 'NumberVerification'}],
          });
        }, 2000);
      }
    };
    if (await GoogleSignin.isSignedIn()) {
      signOutFromGoogle();
    } else {
      dispatch(resetUserData());
      setLogOutModalView(false);
      setTimeout(() => {
        reset({
          index: 0,
          routes: [{name: 'NumberVerification'}],
        });
      }, 2000);
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Unlock the door to endless possibilities 💖 Swipe, match, and let serendipity take the lead. Join our vibrant dating community today! ✨ #FindYourSpark

Download now:

${
  RemoteConfigLinks?.AppStore?.asString() &&
  `📱 App Store: ${RemoteConfigLinks?.AppStore?.asString()}`
}

📱 Play Store: ${
          RemoteConfigLinks?.PlayStore?.asString() ||
          'https://play.google.com/store/apps/details?id=com.luvr.dating'
        }

Let's make every moment count together! #LoveConnects`,
      });
      if (result.action === Share.sharedAction) {
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const onDeleteAccount = async () => {
    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );
      setIsSettingLoading(false);
      return;
    }

    try {
      const userDataForApi = {
        eventName: 'delete_profile',
      };
      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        setDeleteAccountModalView(false);
        LogoutPress();
      } else {
        showToast(
          'Something went wrong',
          APIResponse?.message || 'Please try again later',
          'error',
        );
      }
    } catch (error: any) {
      LogoutPress();
      setDeleteAccountModalView(false);
      showToast('Error', String(error?.message || error), 'error');
    } finally {
      LogoutPress();
      setDeleteAccountModalView(false);
    }
  };

  const onUpdateProfile = async () => {
    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );
      setIsSettingLoading(false);
      return;
    }

    setIsSettingLoading(true);

    try {
      const DataToSend = {
        eventName: 'update_profile',
        mobile_no: UserSetting?.mobile_no || '',
        about: UserSetting?.about || '',
        identity: UserSetting?.identity || '',
        profile_image: UserSetting?.profile_image || '',
        full_name: UserSetting?.full_name || '',
        birthdate: UserSetting?.birthdate || '00/00/0000',
        gender: UserSetting?.gender || '',
        city: UserSetting?.city || '',
        orientation: UserSetting?.orientation || [],
        is_orientation_visible: UserSetting?.is_orientation_visible || false,
        hoping: UserSetting?.hoping || '',
        education: {
          digree: UserSetting?.education?.digree || '',
          college_name: UserSetting?.education?.college_name || '',
        },
        habits: {
          exercise: UserSetting?.habits?.exercise || '',
          smoke: UserSetting?.habits?.smoke || '',
          movies: UserSetting?.habits?.movies || '',
          drink: UserSetting?.habits?.drink || '',
        },
        magical_person: {
          communication_stry:
            UserSetting?.magical_person?.communication_stry || '',
          recived_love: UserSetting?.magical_person?.recived_love || '',
          education_level: UserSetting?.magical_person?.education_level || '',
          star_sign: UserSetting?.magical_person?.star_sign || '',
        },
        likes_into: UserSetting?.likes_into || [],
        is_block_contact: UserSetting?.is_block_contact || false,
        latitude: UserData?.latitude || '',
        longitude: UserData?.longitude || '',
        radius: UserSetting?.radius || 0,
        setting_active_status: UserSetting?.setting_active_status,
        setting_age_range_min: UserSetting?.setting_age_range_min || '18-35',
        setting_distance_preference:
          UserSetting?.setting_distance_preference || '20',
        setting_notification_email: UserSetting?.setting_notification_email,
        setting_notification_push: UserSetting?.setting_notification_push,
        setting_notification_team: UserSetting?.setting_notification_team,
        setting_people_with_range: UserSetting?.setting_people_with_range,
        setting_show_me: UserSetting?.setting_show_me || 'Everyone',
        setting_show_people_with_range:
          UserSetting?.setting_show_people_with_range,
      };
      const APIResponse = await UserService.UserRegister(DataToSend);

      if (APIResponse.code === 200) {
        await getSetting();
        showToast(
          'Setting Updated',
          'Your setting information has been successfully updated.',
          'success',
        );
      } else {
        showToast(
          'Error Updating Setting',
          String(APIResponse?.error) || SOMETHING_WENT_WRONG,
          'error',
        );
      }
    } catch (error: any) {
      showToast(
        'Error Updating Setting',
        String(error?.message || error) || SOMETHING_WENT_WRONG,
        'error',
      );
    } finally {
      setIsSettingLoading(false);
    }
  };

  const onRatingButtonPress = async () => {
    try {
      setRateUsModalView(false);
      if (RatingCount <= 3) {
        showToast('Success!', 'Thanks for the review ❤️', 'success');
        return;
      }

      if (Platform.OS === 'android') {
        Linking.openURL(RemoteConfigLinks?.PlayStore?.asString() || PLAYSTORE);
      } else {
        if (RemoteConfigLinks?.AppStore?.asString()) {
          Linking.openURL(RemoteConfigLinks.AppStore.asString());
        }
      }
    } catch (error: any) {
      showToast('Error', String(error?.message || error), 'error');
    } finally {
      setRatingCount(3);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileAndSettingHeader
        Title={'Settings'}
        onUpdatePress={() => {
          if (!IsSettingLoading) {
            onUpdateProfile();
          }
        }}
      />
      <ScrollView
        bounces={false}
        style={styles.ContentView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              getSetting();
            }}
            progressBackgroundColor={COLORS.White}
            colors={[COLORS.Primary]}
          />
        }>
        <View style={styles.ListSubView}>
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              style={styles.TitleViewStyle}
              isIcon={false}
              Icon={CommonIcons.ProfileTab}
              Title="Phone Number"
            />
            <EditProfileBoxView IsViewLoading={IsSettingLoading}>
              <SettingFlexView
                hideRightIcon={true}
                isActive={false}
                style={styles.PhoneNumberFlexStyle}
                Item={
                  UserSetting?.mobile_no ||
                  UserSetting?.mobile_no ||
                  'Not Added Yet!'
                }
                onPress={() => {}}
              />
            </EditProfileBoxView>
          </View>

          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              style={styles.TitleViewStyle}
              isIcon={false}
              Icon={CommonIcons.ProfileTab}
              Title="Maximum Distance"
            />
            <EditProfileBoxView IsViewLoading={IsSettingLoading}>
              <React.Fragment>
                <View style={styles.DistanceAndAgeView}>
                  <Text style={styles.DistanceAndAgeRangeTitleText}>
                    Distance Preference
                  </Text>
                  <Text style={styles.UserAgeText}>
                    {`${UserSetting?.setting_distance_preference || 20}KM`}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    overflow: 'visible',
                  }}>
                  <MultiSlider
                    onValuesChange={v => {
                      setUserSettingData(prevState => ({
                        ...prevState,
                        setting_distance_preference: v[0]?.toString() || '',
                      }));
                    }}
                    values={[
                      Number(UserSetting?.setting_distance_preference) || 20,
                    ]}
                    isMarkersSeparated={true}
                    max={100}
                    sliderLength={Dimensions.get('window').width - 85}
                    customMarkerLeft={() => {
                      return <View style={styles.CustomMarkerStyle} />;
                    }}
                    customMarkerRight={() => {
                      return <View style={styles.CustomMarkerStyle} />;
                    }}
                    containerStyle={styles.SliderContainerStyle}
                    trackStyle={styles.SliderContainer}
                    selectedStyle={{backgroundColor: COLORS.Primary}}
                  />
                </View>
                <SettingFlexView
                  isActive={UserSetting?.setting_show_people_with_range}
                  style={styles.PhoneNumberFlexStyle}
                  Item={'Show between this distance'}
                  onSwitchPress={() => {
                    setUserSettingData(prevState => ({
                      ...prevState,
                      setting_show_people_with_range:
                        !UserSetting?.setting_show_people_with_range,
                    }));
                  }}
                  IsSwitch={true}
                />
              </React.Fragment>
            </EditProfileBoxView>
          </View>

          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              style={styles.TitleViewStyle}
              isIcon={false}
              Icon={CommonIcons.ProfileTab}
              Title="Show me"
            />
            <View style={styles.GenderContainer}>
              {ShowMeArray.map((gender, index) => (
                <TouchableOpacity
                  activeOpacity={ActiveOpacity}
                  key={index}
                  onPress={() => handleShowMeSelect(gender)}
                  style={[
                    styles.GenderView,
                    {
                      width: hp('12%'),
                      backgroundColor:
                        (UserSetting?.setting_show_me?.toLowerCase() ||
                          'everyone') === gender.toLowerCase()
                          ? COLORS.Primary
                          : COLORS.White,
                      borderWidth:
                        (UserSetting?.setting_show_me?.toLowerCase() ||
                          'everyone') === gender.toLowerCase()
                          ? 2
                          : 0,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.GenderText,
                      {
                        color:
                          (UserSetting?.setting_show_me?.toLowerCase() ||
                            'everyone') === gender.toLowerCase()
                            ? COLORS.White
                            : COLORS.Gray,
                      },
                    ]}>
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              style={styles.TitleViewStyle}
              isIcon={false}
              Icon={CommonIcons.ProfileTab}
              Title="Age range"
            />
            <EditProfileBoxView IsViewLoading={IsSettingLoading}>
              <React.Fragment>
                <View style={styles.DistanceAndAgeView}>
                  <Text style={styles.DistanceAndAgeRangeTitleText}>
                    Age Range Preference
                  </Text>
                  <Text style={styles.UserAgeText}>{`${startAge || 18} - ${
                    endAge || 35
                  }`}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    overflow: 'visible',
                  }}>
                  <MultiSlider
                    onValuesChange={v => {
                      setUserSettingData(prevState => ({
                        ...prevState,
                        setting_age_range_min: `${v[0]}-${v[1]}`,
                      }));
                    }}
                    values={[Number(startAge || 18), Number(endAge || 35)]}
                    isMarkersSeparated={true}
                    max={100}
                    sliderLength={Dimensions.get('window').width - 85}
                    customMarkerLeft={() => {
                      return <View style={styles.CustomMarkerStyle} />;
                    }}
                    customMarkerRight={() => {
                      return <View style={styles.CustomMarkerStyle} />;
                    }}
                    containerStyle={styles.SliderContainerStyle}
                    trackStyle={styles.SliderContainer}
                    selectedStyle={{backgroundColor: COLORS.Primary}}
                  />
                </View>
              </React.Fragment>
            </EditProfileBoxView>
          </View>

          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              style={styles.TitleViewStyle}
              isIcon={false}
              Icon={CommonIcons.ProfileTab}
              Title="Active status"
            />
            <EditProfileBoxView IsViewLoading={IsSettingLoading}>
              <SettingFlexView
                isActive={UserSetting?.setting_active_status}
                style={styles.PhoneNumberFlexStyle}
                Item={'Show my status'}
                onPress={() => {}}
                onSwitchPress={() => {
                  setUserSettingData(prevState => ({
                    ...prevState,
                    setting_active_status: !UserSetting?.setting_active_status,
                  }));
                }}
                IsSwitch={true}
              />
            </EditProfileBoxView>
          </View>

          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              style={styles.TitleViewStyle}
              isIcon={false}
              Icon={CommonIcons.ProfileTab}
              Title="Notifications"
            />
            <EditProfileBoxView IsViewLoading={IsSettingLoading}>
              <View>
                <SettingFlexView
                  isActive={isEnabled}
                  style={styles.NotificationFlexView}
                  Item={'Push Notification'}
                  onPress={() => {}}
                  IsSwitch={true}
                  onSwitchPress={() => {
                    toggleSwitch();
                    toggleNotification();
                  }}
                />
                <SettingFlexView
                  isActive={UserSetting?.setting_notification_email}
                  style={styles.NotificationFlexView}
                  Item={'Email Notification'}
                  onPress={() => {}}
                  IsSwitch={true}
                  onSwitchPress={() => {
                    setUserSettingData(prevState => ({
                      ...prevState,
                      setting_notification_email:
                        !UserSetting?.setting_notification_email,
                    }));
                  }}
                />
              </View>
            </EditProfileBoxView>
          </View>

          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              style={styles.TitleViewStyle}
              isIcon={false}
              Icon={CommonIcons.ProfileTab}
              Title="Privacy"
            />
            <EditProfileBoxView IsViewLoading={IsSettingLoading}>
              <View>
                <SettingFlexView
                  isActive={false}
                  Item={'Community guidelines'}
                  style={styles.ShareFlexViewStyle}
                  onPress={() => {
                    OpenURL({
                      URL: RemoteConfigLinks?.CommunityGuidelines?.asString(),
                    });
                  }}
                />
                <SettingFlexView
                  isActive={false}
                  style={styles.ShareFlexViewStyle}
                  Item={'Safety tips'}
                  onPress={() => {
                    OpenURL({
                      URL: RemoteConfigLinks?.SafetyTips?.asString(),
                    });
                  }}
                />
                <SettingFlexView
                  isActive={false}
                  Item={'Privacy policy'}
                  style={styles.ShareFlexViewStyle}
                  onPress={() => {
                    OpenURL({
                      URL: RemoteConfigLinks?.PrivacyPolicy?.asString(),
                    });
                  }}
                />
                <SettingFlexView
                  isActive={false}
                  style={styles.ShareFlexViewStyle}
                  Item={'Terms of use'}
                  onPress={() => {
                    OpenURL({
                      URL: RemoteConfigLinks?.TermsOfService?.asString(),
                    });
                  }}
                />
                <SettingFlexView
                  isActive={false}
                  style={styles.ShareFlexViewStyle}
                  Item={'EULA'}
                  onPress={() => {
                    OpenURL({
                      URL: RemoteConfigLinks?.EULA?.asString(),
                    });
                  }}
                />
              </View>
            </EditProfileBoxView>
          </View>

          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              style={styles.TitleViewStyle}
              isIcon={false}
              Icon={CommonIcons.ProfileTab}
              Title="Other"
            />
            <EditProfileBoxView IsViewLoading={IsSettingLoading}>
              <View>
                <SettingFlexView
                  isActive={false}
                  Item={'Share app'}
                  style={styles.ShareFlexViewStyle}
                  onPress={() => onShare()}
                />
                <SettingFlexView
                  isActive={false}
                  style={styles.ShareFlexViewStyle}
                  Item={'Rate app'}
                  onPress={() => setRateUsModalView(!RateUsModalView)}
                />
              </View>
            </EditProfileBoxView>
          </View>

          <View style={styles.DeleteAndLogoutContainerView}>
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              onPress={() => {
                setDeleteAccountModalView(!DeleteAccountModalView);
              }}
              style={[styles.DeleteAndLogoutButtonView]}>
              <Text style={styles.DeleteAndLogoutButtonText}>
                Delete Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              onPress={() => {
                setLogOutModalView(!LogOutModalView);
              }}
              style={styles.DeleteAndLogoutButtonView}>
              <Text style={styles.DeleteAndLogoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.AppVersionView}>
            <Text style={styles.AppVersionText}>
              Version{' '}
              {Platform.OS === 'android'
                ? ANDROID_APP_VERSION
                : IOS_APP_VERSION}
            </Text>
          </View>
        </View>
      </ScrollView>

      <SettingCustomModal
        isVisible={LogOutModalView}
        onActionPress={LogoutPress}
        setState={setLogOutModalView}
        title="Logout"
        description="Are you sure you want to logout?"
        ButtonCloseText="No"
        ButtonTitle="Yes, Logout"
      />
      <SettingCustomModal
        isVisible={DeleteAccountModalView}
        setState={setDeleteAccountModalView}
        title="Delete account"
        description={
          'Are you sure you want to delete account? If you delete your account, you will permanently lose your :\n\n' +
          '- Profile\n' +
          '- Messages\n' +
          '- Photos'
        }
        ButtonTitle="Delete account"
        ButtonCloseText="Cancel"
        onActionPress={() => onDeleteAccount()}
      />
      <SettingCustomModal
        isVisible={RateUsModalView}
        setState={setRateUsModalView}
        title="Rate app"
        description={
          <React.Fragment>
            <Text
              style={{
                fontSize: 14.5,
                marginVertical: 5,
                textAlign: 'center',
                color: 'rgba(108, 108, 108, 1)',
                fontFamily: FONTS.Medium,
              }}>
              If you enjoy this app, would you mind taking a moment to rate it?
              It Won’t take more than a minute. Thanks for your support!
            </Text>
            <Rating
              onFinishRating={(value: any) => {
                setRatingCount(value);
              }}
              onSwipeRating={value => {
                setRatingCount(value);
              }}
              startingValue={RatingCount}
              ratingColor="rgba(255, 184, 0, 1)"
              ratingBackgroundColor="rgba(255, 184, 0, 1)"
              ratingImage={CommonIcons.rating_star_icon_unselect}
              style={{paddingVertical: 10, marginHorizontal: 15}}
            />
          </React.Fragment>
        }
        ButtonTitle="Rate now"
        ButtonCloseText="Maybe later"
        onActionPress={onRatingButtonPress}
      />
    </View>
  );
};

export default SettingScreen;
