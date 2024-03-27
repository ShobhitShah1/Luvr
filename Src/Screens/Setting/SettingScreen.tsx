/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import remoteConfig from '@react-native-firebase/remote-config';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  AppState,
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

const SettingScreen = () => {
  // console.log('parameters', parameters, GETDistancePreference);
  const RemoteConfigLinks = remoteConfig().getAll();
  useEffect(() => {
    GetRemoteConfigValue();
  }, []);

  const GetRemoteConfigValue = async () => {
    await remoteConfig().fetch(300);
  };

  // const profile = useSelector(state => state?.user);
  // const [profile, setProfile] = useState<ProfileType>();
  const dispatch = useDispatch();
  const [widthSeekBar, setWidthSeekBar] = useState(0);
  const UserData = useSelector((state: any) => state?.user);
  const [LogOutModalView, setLogOutModalView] = useState(false);
  const [DeleteAccountModalView, setDeleteAccountModalView] = useState(false);
  const [RateUsModalView, setRateUsModalView] = useState(false);
  const [UserSetting, setProfileData] = useState<ProfileType | undefined>();
  const {reset} = useNavigation<NativeStackNavigationProp<any>>();
  const [RatingCount, setRatingCount] = useState(3);
  const {showToast} = useCustomToast();
  const [IsInternetConnected, setIsInternetConnected] = useState(true);
  const settingAgeRangeMin = UserSetting?.setting_age_range_min || '';
  const [IsSettingLoading, setIsSettingLoading] = useState(false);
  let startAge = '';
  let endAge = '';

  if (settingAgeRangeMin) {
    [startAge, endAge] = settingAgeRangeMin.split('-');
  }

  const ShowMeArray = ['Male', 'Female', 'Everyone'];

  const handleShowMeSelect = (gender: string) => {
    setProfileData(prevState => ({
      ...prevState,
      setting_show_me: gender,
    }));
  };

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    checkNotifications().then(({status}) => {
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
    const permission = await requestNotifications(['alert', 'badge', 'sound']);
    // console.log('permission', permission);
    if (permission.status === 'granted') {
      toggleSwitch();
    }

    checkNotifications().then(({status}) => {
      if (status === 'granted') {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
      }
    });
  };

  const handleAppStateChange = appState => {
    // console.log('AppState', appState);
    if (appState === 'active' || appState === 'background') {
      // console.log('App State In');
      CheckPermission();
    }
  };

  useEffect(() => {
    checkNotifications().then(({status}) => {
      if (status === 'granted') {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
      }
    });
    AppState.addEventListener('change', handleAppStateChange);
  }, []);

  useEffect(() => {
    const CheckConnection = async () => {
      try {
        const IsNetOn = await NetInfo.fetch().then(info => info.isConnected);
        if (IsNetOn) {
          // setIsFetchDataAPILoading(true);
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

  const GetSetting = async () => {
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
    // Your existing logout logic
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
    }, 0);

    const signOutFromGoogle = async () => {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        console.log('Logged out from Google');
      } catch (error) {
        console.error('Error signing out from Google:', error);
      }
    };

    if (await GoogleSignin.isSignedIn()) {
      signOutFromGoogle();
    }
  };

  //* Update Profile API Call (API CALL)
  const onUpdateProfile = async () => {
    setIsSettingLoading(true);
    try {
      if (!IsInternetConnected) {
        showToast(
          'Network Issue',
          'Please check your internet connection and try again',
          'error',
        );
        return;
      }

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
        setting_active_status: UserSetting?.setting_active_status || true,
        setting_age_range_min: UserSetting?.setting_age_range_min || '18-35',
        setting_distance_preference:
          UserSetting?.setting_distance_preference || '20',
        setting_notification_email:
          UserSetting?.setting_notification_email || true,
        setting_notification_push:
          UserSetting?.setting_notification_push || true,
        setting_notification_team:
          UserSetting?.setting_notification_team || true,
        setting_people_with_range:
          UserSetting?.setting_people_with_range || true,
        setting_show_me: UserSetting?.setting_show_me || 'Everyone',
        setting_show_people_with_range:
          UserSetting?.setting_show_people_with_range || true,
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

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Unlock the door to endless possibilities 💖 Swipe, match, and let serendipity take the lead. Join our vibrant dating community today! ✨ #FindYourSpark

Download now:

  📱 [App Store](#),
  📱 [Google Play](#)

Stay connected with us:

  🌟 [Facebook](#),
  🌟 [Instagram](#),
  🌟 [Twitter](#)

Let's make every moment count together! #LoveConnects`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const onDeleteAccount = async () => {
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
            <EditProfileBoxView>
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
            <EditProfileBoxView onLayout={getSizeSeekBar}>
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
                    overflow: 'hidden',
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
            {/* <EditProfileBoxView> */}
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
            <EditProfileBoxView>
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
                    overflow: 'hidden',
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
            <EditProfileBoxView>
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
            <EditProfileBoxView>
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
                    // setProfileData(prevState => ({
                    //   ...prevState,
                    //   setting_notification_push:
                    //     !UserSetting?.setting_notification_push || true,
                    // }));
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
                        !UserSetting?.setting_notification_email || true,
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
            <EditProfileBoxView>
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
            <EditProfileBoxView>
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
        // description={
        //   'If you enjoy this app, would you mind taking a moment to rate it? It Won’t take more than a minute. Thanks for your support!'
        // }
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
            console.log('RatingCount', RatingCount);
            if (RatingCount >= 3) {
              Alert.alert('Rating Above 3');
            } else {
              Alert.alert('Success!', 'Thanks for the review ❤️');
            }
            setRatingCount(3);
          }, 0);
        }}
      />
    </View>
  );
};

export default SettingScreen;
