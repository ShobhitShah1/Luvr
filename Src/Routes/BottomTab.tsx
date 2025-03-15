import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonIcons from '../Common/CommonIcons';
import { useTheme } from '../Contexts/ThemeContext';
import ChatRoomScreen from '../Screens/Chat/ChatRoomScreen';
import ExploreCardScreen from '../Screens/Explore/ExploreCardScreen';
import { HomeScreen } from '../Screens/Home/index';
import MyLikesScreen from '../Screens/MyLikes/MyLikesScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';

const BottomTab = () => {
  const { colors, isDark } = useTheme();
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
          tintColor: focused ? (isDark ? colors.White : colors.Primary) : isDark ? undefined : colors.White,
        },
      ]}
    />
  );

  const tabScreens: TabScreen[] = [
    { name: 'Home', component: HomeScreen, icon: isDark ? CommonIcons.DarkHomeTab : CommonIcons.LightHomeTab },
    {
      name: 'ExploreCard',
      component: ExploreCardScreen,
      icon: isDark ? CommonIcons.DarkFindMatchTab : CommonIcons.LightFindMatchTab,
    },
    {
      name: 'MyLikes',
      component: MyLikesScreen,
      icon: isDark ? CommonIcons.DarkLikeTab : CommonIcons.LightLikeTab,
    },
    {
      name: 'ChatRoom',
      component: ChatRoomScreen,
      icon: isDark ? CommonIcons.DarkMessageTab : CommonIcons.LightMessageTab,
    },
    {
      name: 'Profile',
      component: ProfileScreen,
      icon: isDark ? CommonIcons.DarkProfileTab : CommonIcons.LightProfileTab,
    },
  ];

  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: styles.TabBarStyle, headerShown: false }}>
      {tabScreens.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => getTabBarIcon(tab.icon, focused),
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
    borderTopWidth: 0,
    backgroundColor: 'rgba(74, 20, 140, 1)',
  },
});
