import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {
  ChatRoomScreen,
  ExploreCard,
  HomeScreen,
  ProfileScreen,
} from '../Screens/Home/index';
import CommonIcons from '../Common/CommonIcons';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS} from '../Common/Theme';

const BottomTab = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: hp(7),
        },
      }}>
      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color, size, focused}) => {
            console.log(focused);
            return (
              <Image
                source={CommonIcons.HomeTab}
                style={[
                  styles.TabBarIcon,
                  {
                    tintColor: focused
                      ? COLORS.Primary
                      : COLORS.TabBarUnFocused,
                  },
                ]}
              />
            );
          },
        }}
        component={HomeScreen}
        name="Home"
      />
      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color, size, focused}) => {
            console.log(focused);
            return (
              <Image
                source={CommonIcons.FindMatchTab}
                style={[
                  styles.TabBarIcon,
                  {
                    tintColor: focused
                      ? COLORS.Primary
                      : COLORS.TabBarUnFocused,
                  },
                ]}
              />
            );
          },
        }}
        component={ExploreCard}
        name="ExploreCard"
      />
      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color, size, focused}) => {
            console.log(focused);
            return (
              <Image
                source={CommonIcons.MessageTab}
                style={[
                  styles.TabBarIcon,
                  {
                    tintColor: focused
                      ? COLORS.Primary
                      : COLORS.TabBarUnFocused,
                  },
                ]}
              />
            );
          },
        }}
        component={ChatRoomScreen}
        name="ChatRoom"
      />
      <Tab.Screen
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color, size, focused}) => {
            console.log(focused);
            return (
              <Image
                source={CommonIcons.ProfileTab}
                style={[
                  styles.TabBarIcon,
                  {
                    tintColor: focused
                      ? COLORS.Primary
                      : COLORS.TabBarUnFocused,
                  },
                ]}
              />
            );
          },
        }}
        component={ProfileScreen}
        name="Profile"
      />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  TabBarIcon: {
    resizeMode: 'contain',
    width: hp('3.2%'),
    height: hp('3.2%'),
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
