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
  LayoutChangeEvent,
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
import {ActiveOpacity, COLORS, FONTS} from '../../Common/Theme';
import OpenURL from '../../Components/OpenURL';
import {resetUserData} from '../../Redux/Action/userActions';
import UserService from '../../Services/AuthService';
import {ProfileType} from '../../Types/ProfileType';
import {useCustomToast} from '../../Utils/toastUtils';
import EditProfileBoxView from '../Profile/Components/EditProfileComponents/EditProfileBoxView';
import EditProfileTitleView from '../Profile/Components/EditProfileComponents/EditProfileTitleView';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import SettingCustomModal from './Components/SettingCustomModal';
import SettingFlexView from './Components/SettingFlexView';
import styles from './styles';
import TextString from '../../Common/TextString';

const ShowMeArray = ['Male', 'Female', 'Everyone'];

const SettingScreen = () => {
  const dispatch = useDispatch();
  const [widthSeekBar, setWidthSeekBar] = useState(0);
  const UserData = useSelector((state: any) => state?.user);
  const [LogOutModalView, setLogOutModalView] = useState(false);
  const [DeleteAccountModalView, setDeleteAccountModalView] = useState(false);
  const [RateUsModalView, setRateUsModalView] = useState(false);
  const [UserSetting, setProfileData] = useState<ProfileType | undefined>();
  const {reset} = useNavigation();
  const [RatingCount, setRatingCount] = useState(3);
  const {showToast} = useCustomToast();
  const [IsInternetConnected, setIsInternetConnected] = useState(true);
  const [IsSettingLoading, setIsSettingLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  let startAge = '';
  let endAge = '';

  const settingAgeRangeMin = UserSetting?.setting_age_range_min || '';
  if (settingAgeRangeMin) {
    [startAge, endAge] = settingAgeRangeMin?.split('-');
  }

  const [RemoteConfigLinks, setRemoteConfigLinks] = useState<object>({});

  // console.log(typeof RemoteConfigLinks);
  useEffect(() => {
    GetRemoteConfigValue();
  }, []);

  useEffect(() => {
    const Unsubscribe = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => Unsubscribe.remove();
  }, []);

  useEffect(() => {
    const CheckConnection = async () => {
      try {
        const IsNetOn = await NetInfo.fetch().then(info => info.isConnected);
        if (IsNetOn) {
          setIsInternetConnected(true);
          await GetSetting();
        } else {
          setIsInternetConnected(false);
        }
      } catch (error) {
        console.error(
          'Error fetching profile data or checking location permission:',
          error,
        );
        setIsInternetConnected(false);
        // setIsFetchDataAPILoading(false);
      }
    };

    CheckConnection();
  }, []);

  const GetRemoteConfigValue = async () => {
    await remoteConfig().fetch(100);
    const GetRemoteConfigLinks = remoteConfig().getAll();
    if (GetRemoteConfigLinks) {
      setRemoteConfigLinks(GetRemoteConfigLinks);
    }
  };

  const handleShowMeSelect = (gender: string) => {
    setProfileData(prevState => ({
      ...prevState,
      setting_show_me: gender,
    }));
  };

  const toggleSwitch = () => {
    checkNotifications().then(({status}) => {
      console.log('status', status);
      if (status === 'granted') {
        setIsEnabled(true);
      } else {
        requestNotifications(['alert', 'badge', 'sound']).then(({result}) => {
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
      console.log('authStatus', authStatus);
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

  const CheckPermission = async () => {
    checkNotifications().then(({status}) => {
      if (status === 'granted') {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
      }
    });
  };

  const handleAppStateChange = (appState: AppStateStatus) => {
    console.log('AppState', appState);
    if (appState === 'active') {
      CheckPermission();
    }
  };

  const GetSetting = async () => {
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
      const userDataForApi = {
        eventName: 'get_profile',
      };
      const APIResponse = await UserService.UserRegister(userDataForApi);
      console.log('APIResponse', APIResponse?.data?.setting_show_me);
      if (APIResponse?.code === 200) {
        setProfileData({
          ...APIResponse.data,
          setting_show_me: APIResponse?.data?.setting_show_me || 'Everyone',
        });
      } else {
        showToast(
          'Something went wrong',
          APIResponse?.message || 'Please try again later',
          'error',
        );
        setProfileData({} as ProfileType);
      }
    } catch (error) {
      console.log('Something Went Wrong With Feting API Data');
    } finally {
      setIsSettingLoading(false);
    }
  };

  const getSizeSeekBar = (event: LayoutChangeEvent) => {
    setWidthSeekBar(event.nativeEvent.layout.width);
    console.log('size', event.nativeEvent.layout);
  };

  const LogoutPress = async () => {
    const signOutFromGoogle = async () => {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        console.log('Logged out from Google');
      } catch (error) {
        console.error('Error signing out from Google:', error);
      } finally {
        dispatch(resetUserData());
        setLogOutModalView(false);
        setTimeout(() => {
          reset({
            index: 0,
            routes: [
              {
                name: 'NumberVerification',
              },
            ],
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
          routes: [
            {
              name: 'NumberVerification',
            },
          ],
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
📱 Google Play: ${
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
      console.log('userDataForApi', userDataForApi);
      const APIResponse = await UserService.UserRegister(userDataForApi);
      console.log('Delete Account Response:', APIResponse);
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
    } catch (error) {
      LogoutPress();
      setDeleteAccountModalView(false);
      console.log('onDeleteAccountError:', error);
    } finally {
      LogoutPress();
      setDeleteAccountModalView(false);
    }
  };

  //* Update Profile API Call (API CALL)
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

      console.log('DataToSend', DataToSend);

      const APIResponse = await UserService.UserRegister(DataToSend);

      if (APIResponse.code === 200) {
        GetSetting();
        showToast(
          'Setting Updated',
          'Your setting information has been successfully updated.',
          'success',
        );
      } else {
        showToast(
          'Error Updating Setting',
          'Oops! Something went wrong while trying to update your Setting. Please try again later or contact support if the issue persists',
          'error',
        );
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log('Something went wrong edit Setting :--:>', error);
    } finally {
      setIsSettingLoading(false);
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
      <ScrollView bounces={false} style={styles.ContentView}>
        <View style={styles.ListSubView}>
          {/* Phone Number */}
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

          {/* Maximum Distance */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              style={styles.TitleViewStyle}
              isIcon={false}
              Icon={CommonIcons.ProfileTab}
              Title="Maximum Distance"
            />
            <EditProfileBoxView
              IsViewLoading={IsSettingLoading}
              onLayout={getSizeSeekBar}>
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
                      console.log('V ---:>', v);
                      setProfileData(prevState => ({
                        ...prevState,
                        setting_distance_preference: v[0],
                      }));
                    }}
                    values={[
                      Number(UserSetting?.setting_distance_preference) || 20,
                    ]}
                    isMarkersSeparated={true}
                    max={100}
                    // sliderLength={310}
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
                    setProfileData(prevState => ({
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

          {/* Show me */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              style={styles.TitleViewStyle}
              isIcon={false}
              Icon={CommonIcons.ProfileTab}
              Title="Show me"
            />
            {/* <EditProfileBoxView IsViewLoading={IsSettingLoading}> */}
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
            {/* </EditProfileBoxView> */}
          </View>

          {/* Age range */}
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
                      console.log('V ---:>', v);
                      setProfileData(prevState => ({
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

          {/* Active status */}
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
                  setProfileData(prevState => ({
                    ...prevState,
                    setting_active_status: !UserSetting?.setting_active_status,
                  }));
                }}
                IsSwitch={true}
              />
            </EditProfileBoxView>
          </View>

          {/* Notifications */}
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
                    setProfileData(prevState => ({
                      ...prevState,
                      setting_notification_email:
                        !UserSetting?.setting_notification_email,
                    }));
                  }}
                />
              </View>
            </EditProfileBoxView>
          </View>

          {/* Privacy */}
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
              </View>
            </EditProfileBoxView>
          </View>

          {/* Other */}
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

          {/* Delete And Logout Button */}
          <View style={styles.DeleteAndLogoutContainerView}>
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              onPress={() => {
                // LogOutSheetRef.current?.present()
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
                // LogOutSheetRef.current?.present()
                setLogOutModalView(!LogOutModalView);
              }}
              style={styles.DeleteAndLogoutButtonView}>
              <Text style={styles.DeleteAndLogoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <View style={styles.AppVersionView}>
            <Text style={styles.AppVersionText}>Version 1.0.0</Text>
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
              onFinishRating={value => {
                console.log(value);
                setRatingCount(value);
              }}
              onSwipeRating={value => {
                console.log('NEW', value);
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
        onActionPress={() => {
          setRateUsModalView(false);
          setTimeout(() => {
            if (RatingCount >= 3) {
              if (Platform.OS === 'android') {
                Linking.openURL(
                  RemoteConfigLinks?.PlayStore?.asString() ||
                    'https://play.google.com/store/apps/details?id=com.luvr.dating',
                );
              } else {
                if (RemoteConfigLinks?.AppStore?.asString()) {
                  Linking.openURL(RemoteConfigLinks.AppStore.asString());
                }
              }
            } else {
              showToast('Success!', 'Thanks for the review ❤️', 'success');
            }
            setRatingCount(3);
          }, 0);
        }}
      />
    </View>
  );
};

export default SettingScreen;
