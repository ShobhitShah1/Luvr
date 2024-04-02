import React from 'react';
import {Image, Platform, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS} from '../Common/Theme';
import CommonIcons from '../Common/CommonIcons';
import {HomeScreen} from '../Screens/Home/index';
import ChatRoomScreen from '../Screens/Chat/ChatRoomScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';
import ExploreCardScreen from '../Screens/Explore/ExploreCardScreen';
import MyLikesScreen from '../Screens/MyLikes/MyLikesScreen';

const BottomTab: React.FC = () => {
  const Tab = createBottomTabNavigator();

  interface TabScreen {
    name: string;
    component: React.ComponentType<any>;
    icon: any;
  }

  const getTabBarIcon = (icon: any, focused: boolean) => (
    <Image
      source={icon}
      style={[
        styles.TabBarIcon,
        {
          tintColor: focused ? COLORS.Primary : COLORS.TabBarUnFocused,
        },
      ]}
    />
  );

  const tabScreens: TabScreen[] = [
    {name: 'Home', component: HomeScreen, icon: CommonIcons.HomeTab},
    {
      name: 'ExploreCard',
      component: ExploreCardScreen,
      icon: CommonIcons.FindMatchTab,
    },
    {
      name: 'MyLikes',
      component: MyLikesScreen,
      icon: CommonIcons.bottom_likes_icon,
    },
    {name: 'ChatRoom', component: ChatRoomScreen, icon: CommonIcons.MessageTab},
    {name: 'Profile', component: ProfileScreen, icon: CommonIcons.ProfileTab},
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.TabBarStyle,
        headerShown: false,
      }}>
      {tabScreens.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => getTabBarIcon(tab.icon, focused),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  TabBarIcon: {
    top: Platform.OS === 'ios' ? 5 : 0,
    resizeMode: 'contain',
    width: hp('3.2%'),
    height: hp('3.2%'),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  TabBarStyle: {
    height: Platform.OS === 'ios' ? hp(8.7) : hp(7),
    marginLeft: hp('-0.5%'),
    marginRight: hp('-0.5%'),
  },
});
