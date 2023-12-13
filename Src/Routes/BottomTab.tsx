import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS} from '../Common/Theme';
import CommonIcons from '../Common/CommonIcons';
import {
  ChatRoomScreen,
  ExploreCard,
  HomeScreen,
  ProfileScreen,
} from '../Screens/Home/index';

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
      component: ExploreCard,
      icon: CommonIcons.FindMatchTab,
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
    resizeMode: 'contain',
    width: hp('3.2%'),
    height: hp('3.2%'),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  TabBarStyle: {
    height: hp(7),
    marginLeft: hp('-1.5%'),
    marginRight: hp('-1.5%'),
  },
});
