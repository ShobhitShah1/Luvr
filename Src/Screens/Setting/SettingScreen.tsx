import React, {useLayoutEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../Common/CommonIcons';
import {ActiveOpacity, COLORS} from '../../Common/Theme';
import CustomMultiSlider from '../../Components/CustomMultiSlider';
import SwitchComponent from '../../Components/SwitchComponent';
import {ProfileType} from '../../Types/ProfileType';
import EditProfileBoxView from '../Profile/Components/EditProfileComponents/EditProfileBoxView';
import EditProfileTitleView from '../Profile/Components/EditProfileComponents/EditProfileTitleView';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import SettingFlexView from './Components/SettingFlexView';
import styles from './styles';
import UserService from '../../Services/AuthService';

const initialProfileState: ProfileType = {
  _id: '',
  birthdate: '',
  city: '',
  date: 0,
  education: {college_name: '', digree: ''},
  enable: 0,
  full_name: null,
  gender: '',
  habits: {drink: '', exercise: '', movies: '', smoke: ''},
  hoping: '',
  identity: '',
  is_block_contact: '',
  is_orientation_visible: false,
  likes_into: '',
  location: {coordinates: [0, 0], type: ''},
  login_type: '',
  magical_person: {
    communication_stry: '',
    education_level: '',
    recived_love: '',
    star_sign: '',
  },
  mobile_no: '',
  orientation: [],
  profile_image: '',
  radius: 0,
  recent_pik: [],
  user_from: '',
};

const SettingScreen = () => {
  const [profile, setProfile] = useState<ProfileType>(initialProfileState);

  const [selectedGender, setSelectedGender] = useState<string>('Man');

  const genders = ['Man', 'Woman', 'Everyone'];

  const handleGenderSelection = (gender: string) => {
    setSelectedGender(gender);
  };

  useLayoutEffect(() => {
    GetProfileData();
  }, []);

  const GetProfileData = async () => {
    try {
      const userDataForApi = {
        eventName: 'get_profile',
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        setProfile(APIResponse.data);
        console.log('GetProfileData Data:', APIResponse.data);
      } else {
        setProfile({} as ProfileType);
      }
    } catch (error) {
      console.log('Something Went Wrong With Feting API Data');
    } finally {
    }
  };

  return (
    <View style={styles.container}>
      <ProfileAndSettingHeader Title={'Settings'} />
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
                style={styles.PhoneNumberFlexStyle}
                Item={profile?.mobile_no || '+0000000000'}
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
            <EditProfileBoxView>
              <View style={styles.MaximumDistanceView}>
                <View style={{flexDirection: 'row'}}>
                  <SwitchComponent isActive={true} size={40} />
                  <CustomMultiSlider
                    RightValue={10}
                    LeftValue={90}
                    onValueChange={(value: any) => {
                      console.log(
                        'Slider Value ==:>',
                        `${value?.leftValue}-${value?.rightValue}`,
                      );
                    }}
                  />
                </View>
              </View>
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
              {genders.map((gender, index) => (
                <TouchableOpacity
                  activeOpacity={ActiveOpacity}
                  key={index}
                  onPress={() => handleGenderSelection(gender)}
                  style={[
                    styles.GenderView,
                    {
                      width: hp('12%'),
                      borderWidth: selectedGender === gender ? 2 : 0,
                      backgroundColor:
                        selectedGender === gender
                          ? COLORS.Primary
                          : COLORS.White,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.GenderText,
                      {
                        color:
                          selectedGender === gender
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
              <View>
                <Text>Hello Active Status</Text>
              </View>
            </EditProfileBoxView>
          </View>

          {/* Block contacts */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              style={styles.TitleViewStyle}
              isIcon={false}
              Icon={CommonIcons.ProfileTab}
              Title="Block contacts"
            />
            <EditProfileBoxView>
              <SettingFlexView
                style={styles.PhoneNumberFlexStyle}
                Item={'Blocked contacts : 02'}
                onPress={() => {}}
              />
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
                style={styles.PhoneNumberFlexStyle}
                Item={'Show my status'}
                onPress={() => {}}
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
                  style={styles.NotificationFlexView}
                  Item={'Push Notification'}
                  onPress={() => {}}
                  IsSwitch={true}
                />
                <SettingFlexView
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
                  Item={'Community guidelines'}
                  style={styles.ShareFlexViewStyle}
                  onPress={() => {}}
                />
                <SettingFlexView
                  style={styles.ShareFlexViewStyle}
                  Item={'Safety tips'}
                  onPress={() => {}}
                />
                <SettingFlexView
                  Item={'Privacy policy'}
                  style={styles.ShareFlexViewStyle}
                  onPress={() => {}}
                />
                <SettingFlexView
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
                  Item={'Share app'}
                  style={styles.ShareFlexViewStyle}
                  onPress={() => {}}
                />
                <SettingFlexView
                  style={styles.ShareFlexViewStyle}
                  Item={'Rate app'}
                  onPress={() => {}}
                />
              </View>
            </EditProfileBoxView>
          </View>

          {/* Delete And Logout Button */}
          <View style={styles.DeleteAndLogoutContainerView}>
            <TouchableOpacity style={[styles.DeleteAndLogoutButtonView]}>
              <Text style={styles.DeleteAndLogoutButtonText}>
                Delete Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.DeleteAndLogoutButtonView}>
              <Text style={styles.DeleteAndLogoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <View style={styles.AppVersionView}>
            <Text style={styles.AppVersionText}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingScreen;
