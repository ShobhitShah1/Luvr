/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Rating} from 'react-native-ratings';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import CommonIcons from '../../Common/CommonIcons';
import {ActiveOpacity, COLORS, FONTS} from '../../Common/Theme';
import {resetUserData} from '../../Redux/Action/userActions';
import {ProfileType, SettingType} from '../../Types/ProfileType';
import EditProfileBoxView from '../Profile/Components/EditProfileComponents/EditProfileBoxView';
import EditProfileTitleView from '../Profile/Components/EditProfileComponents/EditProfileTitleView';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import SettingCustomModal from './Components/SettingCustomModal';
import SettingFlexView from './Components/SettingFlexView';
import styles from './styles';
import UserService from '../../Services/AuthService';
import {useCustomToast} from '../../Utils/toastUtils';
import NetInfo from '@react-native-community/netinfo';

const SettingScreen = () => {
  const profile = useSelector(state => state?.user);
  // const [profile, setProfile] = useState<ProfileType>();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [widthSeekBar, setWidthSeekBar] = useState(0);
  const UserData = useSelector((state: any) => state?.user);
  const [LogOutModalView, setLogOutModalView] = useState(false);
  const [DeleteAccountModalView, setDeleteAccountModalView] = useState(false);
  const [RateUsModalView, setRateUsModalView] = useState(false);
  const [UserSetting, setProfileData] = useState<ProfileType | undefined>();
  const {replace, reset} = useNavigation<NativeStackNavigationProp<any>>();
  const {showToast} = useCustomToast();
  const [IsInternetConnected, setIsInternetConnected] = useState(true);
  const settingAgeRangeMin = UserSetting?.setting_age_range_min || ''; // Use an empty string if setting_age_range_min is null
  // console.log('UserSetting', UserSetting);

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

  useEffect(() => {
    const CheckConnection = async () => {
      try {
        const IsNetOn = await NetInfo.fetch().then(info => info.isConnected);
        if (IsNetOn) {
          // setIsFetchDataAPILoading(true);
          await GetSetting();
          setIsInternetConnected(true);
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
    try {
      const userDataForApi = {
        eventName: 'get_profile',
      };
      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        setProfileData(APIResponse.data);
        console.log('APIResponse.data', APIResponse.data);
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
    }
  };

  const UpdateSetting = async () => {
    try {
      // const APIResponse = await ProfileService.UpdateUserSetting(UserSetting);
      // if (APIResponse?.status) {
      //   console.log('GetSetting Data:', APIResponse.data);
      //   showToast('All Set', 'User Setting Updated Successfully', 'success');
      // } else {
      //   showToast(
      //     'Error!',
      //     APIResponse.message || 'Something went wrong',
      //     'error',
      //   );
      // }
    } catch (error) {
      console.log('Something Went Wrong With Feting API Data');
    } finally {
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
    // setIsFetchDataAPILoading(true);
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
        mobile_no: profile?.mobile_no,
        identity: profile?.identity,
        profile_image: profile?.profile_image,
        full_name: profile?.full_name,
        birthdate: profile?.birthdate,
        gender: profile?.gender,
        city: profile?.city,
        orientation: profile?.orientation,
        is_orientation_visible: profile?.is_orientation_visible,
        hoping: profile?.hoping,
        education: {
          digree: profile?.education?.digree,
          college_name: profile?.education?.college_name,
        },
        habits: {
          exercise: profile?.habits?.exercise,
          smoke: profile?.habits?.smoke,
          movies: profile?.habits?.movies,
          drink: profile?.habits?.drink,
        },
        magical_person: {
          communication_stry: profile?.magical_person?.communication_stry,
          recived_love: profile?.magical_person?.recived_love,
          education_level: profile?.magical_person?.education_level,
          star_sign: profile?.magical_person?.star_sign,
        },
        likes_into: profile?.likes_into,
        is_block_contact: profile?.is_block_contact,
        latitude: UserData?.latitude,
        longitude: UserData?.longitude,
        radius: profile?.radius,
        setting_active_status: UserSetting?.setting_active_status || true,
        setting_age_range_min: UserSetting?.setting_age_range_min || '18-30',
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

      const APIResponse = await UserService.UserRegister(DataToSend);

      if (APIResponse.code === 200) {
        GetSetting();
        showToast(
          'Profile Updated',
          'Your profile information has been successfully updated.',
          'success',
        );
      } else {
        showToast(
          'Error Updating Profile',
          'Oops! Something went wrong while trying to update your profile. Please try again later or contact support if the issue persists',
          'error',
        );
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log('Something went wrong edit profile :--:>', error);
    } finally {
      // setIsFetchDataAPILoading(false);
    }
  };

  console.log(startAge || 18, endAge || 30);

  return (
    <View style={styles.container}>
      <ProfileAndSettingHeader
        Title={'Settings'}
        onUpdatePress={() => {
          onUpdateProfile();
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
                isActive={false}
                style={styles.PhoneNumberFlexStyle}
                Item={
                  profile?.mobile_no || profile?.mobile_no || 'Not Added Yet!'
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
                  isActive={UserSetting?.setting_show_people_with_range || true}
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
                        UserSetting?.setting_show_me === gender
                          ? COLORS.Primary
                          : COLORS.White,
                      borderWidth:
                        UserSetting?.setting_show_me === gender ? 2 : 0,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.GenderText,
                      {
                        color:
                          UserSetting?.setting_show_me === gender
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
                    Distance Preference
                  </Text>
                  <Text style={styles.UserAgeText}>{`${startAge || 18} - ${
                    endAge || 30
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
                    values={[Number(startAge), Number(endAge)]}
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
                isActive={UserSetting?.setting_active_status || true}
                style={styles.PhoneNumberFlexStyle}
                Item={'Show my status'}
                onPress={() => {}}
                onSwitchPress={() => {
                  setProfileData(prevState => ({
                    ...prevState,
                    setting_active_status:
                      !UserSetting?.setting_active_status,
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
                  isActive={UserSetting?.setting_notification_push || true}
                  style={styles.NotificationFlexView}
                  Item={'Push Notification'}
                  onPress={() => {}}
                  IsSwitch={true}
                  onSwitchPress={() => {
                    setProfileData(prevState => ({
                      ...prevState,
                      setting_notification_push:
                        !UserSetting?.setting_notification_push || true,
                    }));
                  }}
                />
                <SettingFlexView
                  isActive={UserSetting?.setting_notification_email || true}
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
                  onPress={() => {}}
                />
                <SettingFlexView
                  isActive={false}
                  style={styles.ShareFlexViewStyle}
                  Item={'Safety tips'}
                  onPress={() => {}}
                />
                <SettingFlexView
                  isActive={false}
                  Item={'Privacy policy'}
                  style={styles.ShareFlexViewStyle}
                  onPress={() => {}}
                />
                <SettingFlexView
                  isActive={false}
                  style={styles.ShareFlexViewStyle}
                  Item={'Terms of use'}
                  onPress={() => {}}
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
                  onPress={() => {}}
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
        onActionPress={() => {}}
      />
      <SettingCustomModal
        isVisible={RateUsModalView}
        setState={setRateUsModalView}
        title="Rate app"
        // description={
        //   'If you enjoy this app, would you mind taking a moment to rate it? It Won’t take more than a minute. Thanks for your support!'
        // }
        description={
          <>
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
              // showRating={false}
              onFinishRating={() => {}}
              // showReadOnlyText
              style={{paddingVertical: 10, marginHorizontal: 10}}
            />
          </>
        }
        ButtonTitle="Rate now"
        ButtonCloseText="Maybe later"
        onActionPress={() => {}}
      />
    </View>
  );
};

export default SettingScreen;
