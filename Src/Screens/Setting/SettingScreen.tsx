/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import remoteConfig from '@react-native-firebase/remote-config';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  AppStateStatus,
  Dimensions,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { checkNotifications, requestNotifications } from 'react-native-permissions';
import { Rating } from 'react-native-ratings';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { COLORS, FONTS } from '../../Common/Theme';
import { GradientBorderView } from '../../Components/GradientBorder';
import OpenURL from '../../Components/OpenURL';
import { ANDROID_APP_VERSION, IOS_APP_VERSION, PLAYSTORE } from '../../Config/Setting';
import { useTheme } from '../../Contexts/ThemeContext';
import { resetUserData } from '../../Redux/Action/actions';
import UserService from '../../Services/AuthService';
import { ProfileType } from '../../Types/ProfileType';
import { getProfileData } from '../../Utils/profileUtils';
import { useCustomToast } from '../../Utils/toastUtils';
import EditProfileBoxView from '../Profile/Components/EditProfileComponents/EditProfileBoxView';
import EditProfileTitleView from '../Profile/Components/EditProfileComponents/EditProfileTitleView';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import SettingCustomModal from './Components/SettingCustomModal';
import SettingFlexView from './Components/SettingFlexView';
import styles from './styles';
import InAppReview from 'react-native-in-app-review';

const ShowMeArray = ['Male', 'Female', 'Everyone'];
const SOMETHING_WENT_WRONG =
  'Oops! Something went wrong while trying to update your Setting. Please try again later or contact support if the issue persists';

const SettingScreen = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { showToast } = useCustomToast();
  const UserData = useSelector((state: any) => state?.user);

  const [LogOutModalView, setLogOutModalView] = useState(false);
  const [DeleteAccountModalView, setDeleteAccountModalView] = useState(false);
  const [RateUsModalView, setRateUsModalView] = useState(false);
  const [UserSetting, setUserSettingData] = useState<ProfileType>(UserData?.userData);
  const [RatingCount, setRatingCount] = useState(3);
  const [IsSettingLoading, setIsSettingLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const settingAgeRangeMin = UserSetting?.setting_age_range_min || '';

  let startAge = settingAgeRangeMin?.[0] || '';
  let endAge = settingAgeRangeMin?.[1] || '';

  if (settingAgeRangeMin) {
    [startAge, endAge] = settingAgeRangeMin?.split('-');
  }

  const [RemoteConfigLinks, setRemoteConfigLinks] = useState<any>();

  useEffect(() => {
    Promise.all([getRemoteConfigValue(), checkPermission()]);
  }, []);

  useEffect(() => {
    const Unsubscribe = AppState.addEventListener('change', handleAppStateChange);

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
        if (!localData || !localData?.mobile_no || !localData?.setting_age_range_min || !localData?.setting_show_me) {
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
    setUserSettingData((prevState) => ({
      ...prevState,
      setting_show_me: gender,
    }));
  };

  const toggleSwitch = () => {
    checkNotifications().then(({ status }) => {
      if (status === 'granted') {
        setIsEnabled(true);
      } else {
        requestNotifications(['alert', 'badge', 'sound']).then(({ result }: any) => {
          if (result === 'granted') {
            setIsEnabled(true);
          } else {
            setIsEnabled(false);
          }
        });
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
    checkNotifications().then(({ status }) => {
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
      showToast(TextString.error.toUpperCase(), TextString.PleaseCheckYourInternetConnection, TextString.error);
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
        showToast('Something went wrong', APIResponse?.message || 'Please try again later', 'error');
        setUserSettingData({} as ProfileType);
      }
    } catch (error: any) {
      showToast('Error', String(error?.message || error), 'error');
    } finally {
      setIsSettingLoading(false);
      setRefreshing(false);
    }
  };

  const logoutPress = async () => {
    try {
      if (await GoogleSignin.isSignedIn()) {
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        } catch (error) {}
      }
      await navigation.reset({
        index: 0,
        routes: [{ name: 'NumberVerification' }],
      });
      setLogOutModalView(false);

      setTimeout(() => {
        dispatch(resetUserData());
      }, 2000);
    } catch (error) {}
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Unlock the door to endless possibilities 💖 Swipe, match, and let serendipity take the lead. Join our vibrant dating community today! ✨ #FindYourSpark

Download now:

${RemoteConfigLinks?.AppStore?.asString() && `📱 App Store: ${RemoteConfigLinks?.AppStore?.asString()}`}

📱 Play Store: ${
          RemoteConfigLinks?.PlayStore?.asString() || 'https://play.google.com/store/apps/details?id=com.luvr.dating'
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
      showToast(TextString.error.toUpperCase(), TextString.PleaseCheckYourInternetConnection, TextString.error);
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
      } else {
        showToast('Something went wrong', APIResponse?.message || 'Please try again later', 'error');
      }
    } catch (error: any) {
      setDeleteAccountModalView(false);
      showToast('Error', String(error?.message || error), 'error');
    } finally {
      logoutPress();
      setDeleteAccountModalView(false);
    }
  };

  const onUpdateProfile = async () => {
    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      showToast(TextString.error.toUpperCase(), TextString.PleaseCheckYourInternetConnection, TextString.error);
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
          communication_stry: UserSetting?.magical_person?.communication_stry || '',
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
        setting_distance_preference: UserSetting?.setting_distance_preference || '20',
        setting_notification_email: UserSetting?.setting_notification_email,
        setting_notification_push: UserSetting?.setting_notification_push,
        setting_notification_team: UserSetting?.setting_notification_team,
        setting_people_with_range: UserSetting?.setting_people_with_range,
        setting_show_me: UserSetting?.setting_show_me || 'Everyone',
        setting_show_people_with_range: UserSetting?.setting_show_people_with_range,
      };

      const APIResponse = await UserService.UserRegister(DataToSend);

      if (APIResponse.code === 200) {
        await getSetting();
        showToast('Setting Updated', 'Your setting information has been successfully updated.', 'success');
      } else {
        showToast('Error Updating Setting', String(APIResponse?.error) || SOMETHING_WENT_WRONG, 'error');
      }
    } catch (error: any) {
      showToast('Error Updating Setting', String(error?.message || error) || SOMETHING_WENT_WRONG, 'error');
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
    <GradientView>
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
              colors={[colors.Primary]}
            />
          }
        >
          <View style={styles.ListSubView}>
            <View style={styles.DetailContainerView}>
              <EditProfileTitleView
                style={styles.TitleViewStyle}
                isIcon={false}
                Icon={CommonIcons.LightProfileTab}
                Title="Phone Number"
              />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={{
                  marginTop: 10,
                  borderWidth: 1,
                  borderRadius: 15,
                  backgroundColor: isDark ? 'transparent' : 'rgba(255, 255, 255, 1)',
                }}
              >
                <EditProfileBoxView IsViewLoading={IsSettingLoading}>
                  <SettingFlexView
                    hideRightIcon={true}
                    isActive={false}
                    style={styles.PhoneNumberFlexStyle}
                    Item={UserSetting?.mobile_no || UserSetting?.mobile_no || 'Not Added Yet!'}
                    onPress={() => {}}
                  />
                </EditProfileBoxView>
              </GradientBorderView>
            </View>

            <View style={styles.DetailContainerView}>
              <EditProfileTitleView
                style={styles.TitleViewStyle}
                isIcon={false}
                Icon={CommonIcons.LightProfileTab}
                Title="Maximum Distance"
              />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={{
                  backgroundColor: isDark ? 'transparent' : 'rgba(255, 255, 255, 1)',
                  borderWidth: 1,
                  borderRadius: 15,
                  marginTop: 10,
                }}
              >
                <EditProfileBoxView IsViewLoading={IsSettingLoading}>
                  <React.Fragment>
                    <View style={styles.DistanceAndAgeView}>
                      <Text style={[styles.DistanceAndAgeRangeTitleText, { color: colors.TextColor }]}>
                        Distance Preference
                      </Text>
                      <Text
                        style={[styles.UserAgeText, { color: colors.TextColor }]}
                      >{`${UserSetting?.setting_distance_preference || 20}KM`}</Text>
                    </View>
                    <View style={{ width: '100%', overflow: 'visible' }}>
                      <MultiSlider
                        onValuesChange={(v) => {
                          setUserSettingData((prevState) => ({
                            ...prevState,
                            setting_distance_preference: v[0]?.toString() || '',
                          }));
                        }}
                        values={[Number(UserSetting?.setting_distance_preference) || 20]}
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
                        selectedStyle={{ backgroundColor: colors.Primary }}
                      />
                    </View>
                    <SettingFlexView
                      isActive={UserSetting?.setting_show_people_with_range}
                      style={styles.PhoneNumberFlexStyle}
                      Item={'Show between this distance'}
                      onSwitchPress={() => {
                        setUserSettingData((prevState) => ({
                          ...prevState,
                          setting_show_people_with_range: !UserSetting?.setting_show_people_with_range,
                        }));
                      }}
                      IsSwitch={true}
                    />
                  </React.Fragment>
                </EditProfileBoxView>
              </GradientBorderView>
            </View>

            <View style={styles.DetailContainerView}>
              <EditProfileTitleView
                style={styles.TitleViewStyle}
                isIcon={false}
                Icon={CommonIcons.LightProfileTab}
                Title="Show me"
              />
              <View style={styles.GenderContainer}>
                {ShowMeArray.map((gender, index) => {
                  const isSelected =
                    (UserSetting?.setting_show_me?.toLowerCase() || 'everyone') === gender.toLowerCase();
                  return (
                    <LinearGradient
                      key={index}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 0 }}
                      colors={
                        isSelected
                          ? colors.ButtonGradient
                          : isDark
                            ? ['transparent', 'transparent']
                            : [colors.White, colors.White]
                      }
                      style={[
                        styles.GenderView,
                        {
                          width: hp('12%'),
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                      ]}
                    >
                      <Pressable style={styles.GenderButton} onPress={() => handleShowMeSelect(gender)}>
                        <Text
                          style={[
                            styles.GenderText,
                            { color: isDark ? colors.TextColor : isSelected ? colors.White : colors.TextColor },
                          ]}
                        >
                          {gender}
                        </Text>
                      </Pressable>
                    </LinearGradient>
                  );
                })}
              </View>
            </View>

            <View style={styles.DetailContainerView}>
              <EditProfileTitleView
                style={styles.TitleViewStyle}
                isIcon={false}
                Icon={CommonIcons.LightProfileTab}
                Title="Age range"
              />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={{
                  backgroundColor: isDark ? 'transparent' : 'rgba(255, 255, 255, 1)',
                  borderWidth: 1,
                  borderRadius: 15,
                  marginTop: 10,
                }}
              >
                <EditProfileBoxView IsViewLoading={IsSettingLoading}>
                  <>
                    <View style={styles.DistanceAndAgeView}>
                      <Text style={[styles.DistanceAndAgeRangeTitleText, { color: colors.TextColor }]}>
                        Age Range Preference
                      </Text>
                      <Text
                        style={[styles.UserAgeText, { color: colors.TextColor }]}
                      >{`${startAge || 18} - ${endAge || 35}`}</Text>
                    </View>
                    <View style={{ width: '100%', overflow: 'visible' }}>
                      <MultiSlider
                        onValuesChange={(v) => {
                          setUserSettingData((prevState) => ({
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
                        selectedStyle={{ backgroundColor: colors.Primary }}
                      />
                    </View>
                  </>
                </EditProfileBoxView>
              </GradientBorderView>
            </View>

            <View style={styles.DetailContainerView}>
              <EditProfileTitleView
                style={styles.TitleViewStyle}
                isIcon={false}
                Icon={CommonIcons.LightProfileTab}
                Title="Active status"
              />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={{
                  backgroundColor: isDark ? 'transparent' : 'rgba(255, 255, 255, 1)',
                  borderWidth: 1,
                  borderRadius: 15,
                  marginTop: 10,
                }}
              >
                <EditProfileBoxView IsViewLoading={IsSettingLoading}>
                  <SettingFlexView
                    isActive={UserSetting?.setting_active_status}
                    style={styles.PhoneNumberFlexStyle}
                    Item={'Show my status'}
                    onPress={() => {}}
                    onSwitchPress={() => {
                      setUserSettingData((prevState) => ({
                        ...prevState,
                        setting_active_status: !UserSetting?.setting_active_status,
                      }));
                    }}
                    IsSwitch={true}
                  />
                </EditProfileBoxView>
              </GradientBorderView>
            </View>

            <View style={styles.DetailContainerView}>
              <EditProfileTitleView
                style={styles.TitleViewStyle}
                isIcon={false}
                Icon={CommonIcons.LightProfileTab}
                Title="Notifications"
              />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={{
                  backgroundColor: isDark ? 'transparent' : 'rgba(255, 255, 255, 1)',
                  borderWidth: 1,
                  borderRadius: 15,
                  marginTop: 10,
                }}
              >
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
                        setUserSettingData((prevState) => ({
                          ...prevState,
                          setting_notification_email: !UserSetting?.setting_notification_email,
                        }));
                      }}
                    />
                  </View>
                </EditProfileBoxView>
              </GradientBorderView>
            </View>

            <View style={styles.DetailContainerView}>
              <EditProfileTitleView
                style={styles.TitleViewStyle}
                isIcon={false}
                Icon={CommonIcons.LightProfileTab}
                Title="Privacy"
              />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={{
                  backgroundColor: isDark ? 'transparent' : 'rgba(255, 255, 255, 1)',
                  borderWidth: 1,
                  borderRadius: 15,
                  marginTop: 10,
                }}
              >
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
              </GradientBorderView>
            </View>

            <View style={styles.DetailContainerView}>
              <EditProfileTitleView
                style={styles.TitleViewStyle}
                isIcon={false}
                Icon={CommonIcons.LightProfileTab}
                Title="Other"
              />
              <GradientBorderView
                gradientProps={{ colors: colors.editFiledBackground }}
                style={{
                  backgroundColor: isDark ? 'transparent' : 'rgba(255, 255, 255, 1)',
                  borderWidth: 1,
                  borderRadius: 15,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
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
                      onPress={() => {
                        if (InAppReview.isAvailable()) {
                          InAppReview.RequestInAppReview()
                            .then((hasFlowFinishedSuccessfully) => {
                              Alert.alert('Review', 'Thank you for your review! It has been recorded.');
                            })
                            .catch((error) => {});
                        } else {
                          setRateUsModalView(!RateUsModalView);
                        }
                      }}
                    />
                    <SettingFlexView
                      isActive={false}
                      style={styles.ShareFlexViewStyle}
                      Item={'Have a referral code?'}
                      onPress={() => navigation.navigate('RedeemReferralCode')}
                    />
                  </View>
                </EditProfileBoxView>
              </GradientBorderView>
            </View>

            <View style={styles.DeleteAndLogoutContainerView}>
              <Pressable
                onPress={() => {
                  setDeleteAccountModalView(!DeleteAccountModalView);
                }}
                style={[
                  styles.DeleteAndLogoutButtonView,
                  { backgroundColor: isDark ? 'rgba(255,255,255,.3)' : colors.White },
                ]}
              >
                <Text style={[styles.DeleteAndLogoutButtonText, { color: colors.TextColor }]}>Delete Account</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setLogOutModalView(!LogOutModalView);
                }}
                style={[
                  styles.DeleteAndLogoutButtonView,
                  { backgroundColor: isDark ? 'rgba(255,255,255,.3)' : colors.White },
                ]}
              >
                <Text style={[styles.DeleteAndLogoutButtonText, { color: colors.TextColor }]}>Logout</Text>
              </Pressable>
            </View>

            <View style={styles.AppVersionView}>
              <Text style={[styles.AppVersionText, { color: colors.TextColor }]}>
                Version {Platform.OS === 'android' ? ANDROID_APP_VERSION : IOS_APP_VERSION}
              </Text>
            </View>
          </View>
        </ScrollView>

        <SettingCustomModal
          isVisible={LogOutModalView}
          onActionPress={logoutPress}
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
                  color: isDark ? 'rgba(198, 198, 198, 1)' : 'rgba(108, 108, 108, 1)',
                  fontFamily: FONTS.Medium,
                }}
              >
                If you enjoy this app, would you mind taking a moment to rate it? It Won’t take more than a minute.
                Thanks for your support!
              </Text>
              <Rating
                onFinishRating={(value: any) => {
                  setRatingCount(value);
                }}
                onSwipeRating={(value) => {
                  setRatingCount(value);
                }}
                startingValue={RatingCount}
                tintColor={!isDark ? undefined : 'rgba(0, 0, 0, 1)'}
                ratingColor="rgba(255, 184, 0, 1)"
                ratingBackgroundColor="rgba(255, 184, 0, 1)"
                ratingImage={CommonIcons.rating_star_icon_unselect}
                style={{ paddingVertical: 10, marginHorizontal: 15 }}
              />
            </React.Fragment>
          }
          ButtonTitle="Rate now"
          ButtonCloseText="Maybe later"
          onActionPress={onRatingButtonPress}
        />
      </View>
    </GradientView>
  );
};

export default memo(SettingScreen);
