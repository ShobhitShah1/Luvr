/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React, {useLayoutEffect, useState} from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import CommonIcons from '../../Common/CommonIcons';
import {ActiveOpacity, COLORS, FONTS} from '../../Common/Theme';
import {SettingType} from '../../Types/ProfileType';
import EditProfileBoxView from '../Profile/Components/EditProfileComponents/EditProfileBoxView';
import EditProfileTitleView from '../Profile/Components/EditProfileComponents/EditProfileTitleView';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import SettingFlexView from './Components/SettingFlexView';
import styles from './styles';
import LogOutModalRenderView from './Components/LogOutModalRenderView';
import Modal from 'react-native-modal';
import SettingCustomModal from './Components/SettingCustomModal';
import { Rating } from 'react-native-ratings';

const SettingScreen = () => {
  const profile = useSelector(state => state?.user);
  // const [profile, setProfile] = useState<ProfileType>();
  const [widthSeekBar, setWidthSeekBar] = useState(0);
  const UserData = useSelector((state: any) => state?.user);
  const [LogOutModalView, setLogOutModalView] = useState(false);
  const [DeleteAccountModalView, setDeleteAccountModalView] = useState(false);
  const [RateUsModalView, setRateUsModalView] = useState(false);
  const [UserSetting, setUserSetting] = useState<SettingType>({
    is_direction_on: true,
    direction: 50,
    show_me: 'Everyone',
    age_to: 10,
    age_from: 50,
    active_status: true,
    latitude: UserData?.latitude,
    longitude: UserData?.longitude,
    Location: '',
  });

  // const {showToast} = useCustomToast();
  // const [SelectedShowMe, setSelectedShowMe] = useState<string>(
  //   UserSetting?.show_me || 'Female',
  // );

  const ShowMeArray = ['Male', 'Female', 'Everyone'];

  const handleShowMeSelect = (gender: string) => {
    // setSelectedShowMe(gender);
    setUserSetting(prevState => ({
      ...prevState,
      show_me: gender,
    }));
  };

  useLayoutEffect(() => {
    GetSetting();
  }, []);

  const GetSetting = async () => {
    try {
      // const APIResponse = await ProfileService.GetUserSetting();
      // if (APIResponse?.status) {
      //   console.log('UserSetting', APIResponse.data);
      //   setUserSetting(APIResponse.data);
      //   console.log('GetSetting Data:', APIResponse.data);
      // } else {
      //   setUserSetting({} as SettingType);
      // }
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

  return (
    <View style={styles.container}>
      <ProfileAndSettingHeader
        Title={'Settings'}
        onUpdatePress={() => {
          UpdateSetting();
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
                Item={profile?.mobileNo || profile?.mobile_no || '+0000000000'}
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
                    {UserSetting.direction}
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
                      setUserSetting(prevState => ({
                        ...prevState,
                        direction: v[0],
                      }));
                    }}
                    values={[UserSetting.direction || 0]}
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
                  isActive={UserSetting.is_direction_on}
                  style={styles.PhoneNumberFlexStyle}
                  Item={'Show between this distance'}
                  onSwitchPress={() => {
                    setUserSetting(prevState => ({
                      ...prevState,
                      is_direction_on: !UserSetting.is_direction_on,
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
                        UserSetting?.show_me === gender
                          ? COLORS.Primary
                          : COLORS.White,
                      borderWidth: UserSetting?.show_me === gender ? 2 : 0,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.GenderText,
                      {
                        color:
                          UserSetting?.show_me === gender
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
                  <Text style={styles.UserAgeText}>{`${
                    UserSetting.age_from || 0
                  } - ${UserSetting.age_to || 0}`}</Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    overflow: 'hidden',
                  }}>
                  <MultiSlider
                    onValuesChange={v => {
                      console.log('V ---:>', v);
                      setUserSetting(prevState => ({
                        ...prevState,
                        age_from: v[0],
                        age_to: v[1],
                      }));
                    }}
                    values={[UserSetting.age_from, UserSetting.age_to]}
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
                isActive={UserSetting?.active_status}
                style={styles.PhoneNumberFlexStyle}
                Item={'Show my status'}
                onPress={() => {}}
                onSwitchPress={() => {
                  setUserSetting(prevState => ({
                    ...prevState,
                    active_status: !UserSetting.active_status,
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
                  isActive={true}
                  style={styles.NotificationFlexView}
                  Item={'Push Notification'}
                  onPress={() => {}}
                  IsSwitch={true}
                />
                <SettingFlexView
                  isActive={true}
                  style={styles.NotificationFlexView}
                  Item={'Email Notification'}
                  onPress={() => {}}
                  IsSwitch={true}
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
      />
    </View>
  );
};

export default SettingScreen;
