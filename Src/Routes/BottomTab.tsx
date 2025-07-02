import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CommonIcons from '../Common/CommonIcons';
import { FONTS } from '../Common/Theme';
import { GradientBorderView } from '../Components/GradientBorder';
import { useTheme } from '../Contexts/ThemeContext';
import ChatRoomScreen from '../Screens/Chat/ChatRoomScreen';
import ExploreCardScreen from '../Screens/Explore/ExploreCardScreen';
import { HomeScreen } from '../Screens/Home/index';
import MyLikesScreen from '../Screens/MyLikes/MyLikesScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';
import { getSubscription } from '../Services/SubscriptionService';

interface TabScreen {
  name: string;
  component: React.ComponentType<any>;
  icon: any;
  label: string;
}

interface TabItemProps {
  label: string;
  icon: any;
  isFocused: boolean;
  onPress: () => void;
}

interface FloatingTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const labels = ['Home', 'Match', 'Likes', 'Chat', 'Profile'];

const springConfig = {
  damping: 20,
  stiffness: 300,
  mass: 0.3,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const TabItem: React.FC<TabItemProps> = ({ label, icon, isFocused, onPress }) => {
  const { isDark, colors } = useTheme();

  const bubbleScale = useSharedValue(0);
  const bubbleOpacity = useSharedValue(0);
  const iconScale = useSharedValue(1);
  const iconTranslateY = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      bubbleOpacity.value = withTiming(1, { duration: 50 });
      bubbleScale.value = withSpring(1, springConfig);
      iconScale.value = withSpring(1.1, springConfig);
      iconTranslateY.value = withSpring(-26, springConfig);
      textOpacity.value = withTiming(1, { duration: 50 });
    } else {
      textOpacity.value = withTiming(0, { duration: 30 });
      iconTranslateY.value = withSpring(0, springConfig);
      iconScale.value = withSpring(1, springConfig);
      bubbleScale.value = withSpring(0, springConfig);
      bubbleOpacity.value = withTiming(0, { duration: 50 });
    }
  }, [isFocused]);

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }, { translateY: -3 }],
    opacity: bubbleOpacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }, { translateY: iconTranslateY.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <Pressable accessibilityLabel="Tab" onPress={onPress} style={styles.tabItemContainer}>
      <Animated.View style={[styles.bubbleBackground, bubbleStyle]}>
        <LinearGradient
          colors={isDark ? colors.ButtonGradient : [colors.White, colors.White]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBubble}
        />
      </Animated.View>

      <Animated.View style={[styles.iconContainer, iconStyle]}>
        <Image
          source={icon}
          style={[styles.tabIcon, { width: isFocused ? 22 : 25, height: isFocused ? 22 : 25 }, isFocused && { top: 2 }]}
          tintColor={isDark ? (isFocused ? colors.White : undefined) : isFocused ? colors.Background : colors.White}
        />
      </Animated.View>

      <Animated.Text style={[styles.tabLabel, textStyle, { color: colors.White }]}>{label}</Animated.Text>
    </Pressable>
  );
};

const FloatingTabBar: React.FC<FloatingTabBarProps> = ({ state, descriptors, navigation }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.tabBarContainer}>
      <GradientBorderView
        gradientProps={{ colors: colors.ButtonGradient }}
        style={[
          styles.floatingBar,
          {
            backgroundColor: isDark ? 'rgba(26, 2, 54, 1)' : colors.Background,
            width: wp('88%'),
            height: hp('6.6%'),
            marginBottom: hp('1.5%'),
          },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = (state.index || 0) === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              requestAnimationFrame(() => {
                navigation.navigate(route.name);
              });
              getSubscription();
            }
          };

          return (
            <TabItem
              key={index}
              label={labels[index]}
              icon={options.tabBarIcon({ focused: isFocused })}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </GradientBorderView>
    </View>
  );
};

const BottomTab: React.FC = () => {
  const { isDark } = useTheme();

  const tabScreens: TabScreen[] = [
    {
      name: 'Home',
      component: HomeScreen,
      icon: isDark ? CommonIcons.DarkHomeTab : CommonIcons.LightHomeTab,
      label: 'Home',
    },
    {
      name: 'ExploreCard',
      component: ExploreCardScreen,
      icon: isDark ? CommonIcons.DarkLikeTab : CommonIcons.LightLikeTab,
      label: 'Match',
    },
    {
      name: 'MyLikes',
      component: MyLikesScreen,
      icon: isDark ? CommonIcons.DarkFindMatchTab : CommonIcons.LightFindMatchTab,
      label: 'Likes',
    },
    {
      name: 'ChatRoom',
      component: ChatRoomScreen,
      icon: isDark ? CommonIcons.DarkMessageTab : CommonIcons.LightMessageTab,
      label: 'Messages',
    },
    {
      name: 'Profile',
      component: ProfileScreen,
      icon: isDark ? CommonIcons.DarkProfileTab : CommonIcons.LightProfileTab,
      label: 'Profile',
    },
  ];

  const getTabBarIcon =
    (tab: TabScreen) =>
    ({ focused }: { focused: boolean }) => {
      return tab.icon;
    };

  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        lazy: false,
      }}
    >
      {tabScreens.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: getTabBarIcon(tab),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  floatingBar: {
    flexDirection: 'row',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,

    elevation: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 10,

    borderWidth: 1,
  },
  tabItemContainer: {
    height: 60,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    width: (SCREEN_WIDTH * 0.8) / 4.8,
  },
  bubbleBackground: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    top: -18,
    zIndex: 0,

    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  iconContainer: {
    zIndex: 999999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  tabLabel: {
    zIndex: 1,
    bottom: 8,
    marginTop: 1.5,
    fontSize: wp(3),
    position: 'absolute',
    fontFamily: FONTS.Bold,
  },
  gradientBubble: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
});
