import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import styles from './styles';
import ProfileAndSettingHeader from '../Profile/Components/ProfileAndSettingHeader';
import CommonIcons from '../../Common/CommonIcons';
import EditProfileTitleView from '../Profile/Components/EditProfileComponents/EditProfileTitleView';
import EditProfileBoxView from '../Profile/Components/EditProfileComponents/EditProfileBoxView';
import UserService from '../../Services/AuthService';
import {ProfileType} from '../../Types/ProfileType';
import SettingFlexView from './Components/SettingFlexView';
import RNSwitch from '../../Components/SwitchComponent';
import SwitchComponent from '../../Components/SwitchComponent';
import {COLORS} from '../../Common/Theme';

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
                Item={profile?.mobile_no}
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
              <View style={styles.MaximumDistanceView}></View>
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
            <EditProfileBoxView>
              <SwitchComponent
                backgroundColor={COLORS.Secondary}
                onChange={console.log}
              />
              {/* <RNSwitch value={true} /> */}
            </EditProfileBoxView>
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
              <View></View>
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
              <View></View>
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
              <View></View>
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
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingScreen;
