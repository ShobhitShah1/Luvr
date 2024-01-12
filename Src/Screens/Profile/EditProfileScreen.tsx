import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../Common/Theme';
import ProfileAndSettingHeader from './Components/ProfileAndSettingHeader';
import EditProfileTitleView from './Components/EditProfileComponents/EditProfileTitleView';
import CommonIcons from '../../Common/CommonIcons';

const EditProfileScreen = () => {
  return (
    <View style={styles.Container}>
      <ProfileAndSettingHeader Title={'Edit Profile'} />
      <ScrollView bounces={false} style={styles.ContentView}>
        <View style={styles.ListSubView}>
          {/* Name View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView Icon={CommonIcons.ProfileTab} Title="Name" />
          </View>

          {/* Age View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.birthday_icon}
              Title="Birthday"
            />
          </View>

          {/* Media View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.birthday_icon}
              Title="Media"
            />
          </View>

          {/* About me View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.about_me_icon}
              Title="About me"
            />
          </View>

          {/* Gender View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.about_me_icon}
              Title="Gender"
            />
          </View>

          {/* I’m from View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.location_icon}
              Title="I’m from"
            />
          </View>

          {/* I like View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.i_like_icon}
              Title="I like"
            />
          </View>

          {/* Looking for View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.looking_for_icon}
              Title="Looking for"
            />
          </View>

          {/* Interested in View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.interested_in_icon}
              Title="Interested in"
            />
          </View>

          {/* Zodiac sign View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.interested_in_icon}
              Title="Zodiac sign"
            />
          </View>

          {/* Education View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.education_icon}
              Title="Education"
            />
          </View>

          {/* Communication style View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.education_icon}
              Title="Communication style"
            />
          </View>

          {/* Smoke & drinks style View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.education_icon}
              Title="Smoke & drinks"
            />
          </View>

          {/* Movies View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.education_icon}
              Title="Movies"
            />
          </View>

          {/* Drink View */}
          <View style={styles.DetailContainerView}>
            <EditProfileTitleView
              Icon={CommonIcons.education_icon}
              Title="Drink"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  LoaderContainer: {
    justifyContent: 'center',
  },
  ContentView: {
    flex: 1,
  },
  ListSubView: {
    width: '90%',
    alignSelf: 'center',
  },
  DetailContainerView: {},
});
