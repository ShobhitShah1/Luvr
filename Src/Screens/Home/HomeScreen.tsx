/* eslint-disable react-hooks/exhaustive-deps */
import messaging from '@react-native-firebase/messaging';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { requestNotifications } from 'react-native-permissions';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  SlideInRight,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { COLORS, FONTS } from '../../Common/Theme';
import { HomeLookingForData } from '../../Components/Data';
import { useUserData } from '../../Contexts/UserDataContext';
import useAppStateTracker from '../../Hooks/useAppStateTracker';
import { useBoost } from '../../Hooks/useBoost';
import { useBoostModal } from '../../Hooks/useBoostModal';
import { useLocationPermission } from '../../Hooks/useLocationPermission';
import { store } from '../../Redux/Store/store';
import UserService from '../../Services/AuthService';
import { HomeListProps } from '../../Types/Interface';
import { ProfileType } from '../../Types/ProfileType';
import { getMyLikes } from '../../Utils/getMyLikes';
import { getProfileData } from '../../Utils/profileUtils';
import { useCustomToast } from '../../Utils/toastUtils';
import { updateDeviceToken } from '../../Utils/updateDeviceToken';
import BottomTabHeader from './Components/BottomTabHeader';
import CategoryHeaderView from './Components/CategoryHeaderView';
import RenderHomeNearby from './Components/RenderHomeNearby';
import RenderLookingView from './Components/RenderlookingView';
import RenderRecommendation from './Components/RenderRecommendation';
import styles from './styles';
import { useTheme } from '../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../Hooks/useCustomNavigation';

const askNotificationPermission = async () => {
  try {
    await requestNotifications(['alert', 'sound']);
    await messaging().requestPermission();
  } catch (error) {
    console.error('Notification permission error:', error);
  }
};

const HomeScreen = () => {
  useAppStateTracker();

  const isFocus = useIsFocused();
  const { colors } = useTheme();
  const navigation = useCustomNavigation();

  const { userData } = useUserData();
  const { isBoostActive } = useBoost();
  const { showModal } = useBoostModal();
  const { showToast } = useCustomToast();
  const { requestLocationPermission } = useLocationPermission();

  const [selectedCategory, setSelectedCategory] = useState(HomeLookingForData[0]?.title || '');
  const [categoryData, setCategoryData] = useState<ProfileType[]>([]);
  const [nearByData, setNearByData] = useState<ProfileType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isNearbyFetching, setIsNearbyFetching] = useState(false);

  const listOpacity = useSharedValue(0);

  const categoryListRef = useRef<FlatList>(null);
  const nearbyListRef = useRef<FlatList>(null);

  useEffect(() => {
    setupApp();
  }, [isBoostActive]);

  useEffect(() => {
    fetchCategoryListData();
  }, [selectedCategory, userData]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {};
    }, [])
  );

  const setupApp = async () => {
    try {
      await Promise.all([askNotificationPermission(), requestLocationPermission(), updateDeviceToken()]);

      if (isFocus && !isBoostActive) {
        setTimeout(showModal, 5000);
      }
    } catch (error) {
      console.error('App setup error:', error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(categoryData?.length === 0);
      setIsNearbyFetching(nearByData?.length === 0);

      listOpacity.value = 0;
      await Promise.all([getMyLikes(), getProfileData(), fetchCategoryListData(), fetchNearbyListData()]);
      listOpacity.value = withSpring(1, { damping: 15 });
    } catch (error) {
      console.error('Error fetching data on focus:', error);
    } finally {
      setIsLoading(false);
      setIsNearbyFetching(false);
    }
  };

  const dataToSendInAPI = useMemo(() => {
    return {
      latitude: userData.latitude,
      longitude: userData.longitude,
      radius: userData?.radius || 9000000000000000,
      unlike: store.getState().user?.swipedLeftUserIds,
      like: store.getState().user?.swipedRightUserIds,
      skip: 0,
      limit: 200,
      is_online: userData?.see_who_is_online || false,
    };
  }, [selectedCategory, userData, store]);

  const fetchCategoryListData = useCallback(async () => {
    try {
      const userDataForApi = {
        ...dataToSendInAPI,
        eventName: 'list_neighbour_home',
        hoping: selectedCategory,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);

      if (APIResponse?.code === 200) {
        setCategoryData(APIResponse?.data || []);
      } else {
        showToast(TextString.error.toUpperCase(), APIResponse?.message || 'Please try again later', 'error');
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [userData, selectedCategory, store, categoryData]);

  const fetchNearbyListData = useCallback(async () => {
    try {
      const userDataForApi = {
        ...dataToSendInAPI,
        eventName: 'near_by_me',
        is_online: userData?.see_who_is_online || false,
        habits: {
          exercise: userData?.exercise || '',
          smoke: userData?.smoke || '',
          movies: userData?.movies || '',
          drink: userData?.drink || '',
        },
        likes_into: userData?.likes_into || [],
        magical_person: {
          communication_stry: userData?.communication_stry || '',
          recived_love: userData?.recived_love || '',
          education_level: userData?.education_level || '',
          star_sign: userData?.star_sign || '',
        },
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);

      if (APIResponse?.code === 200) {
        setNearByData(APIResponse?.data || []);
      } else {
        showToast(TextString.error.toUpperCase(), APIResponse?.message || 'Please try again later', 'error');
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [userData, selectedCategory, store, categoryData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchCategoryListData]);

  const handleSeeMorePress = useCallback(() => {
    navigation.navigate('CategoryDetailCards', {
      item: { title: selectedCategory, image: '', id: 1 },
    });
  }, [selectedCategory, navigation]);

  const keyExtractor = useCallback((item: any, index: number) => `${item.id || index.toString()}`, []);

  const renderLookingItem = useCallback(
    ({ item, index }: { item: HomeListProps['item']; index: number }) => (
      <Animated.View entering={SlideInRight.delay(index * 100)} layout={LinearTransition.springify()}>
        <RenderLookingView
          item={item}
          selectedCategory={selectedCategory}
          onCategoryPress={(item) => setSelectedCategory(item.title)}
        />
      </Animated.View>
    ),
    [selectedCategory]
  );

  const renderHomeNearbyItem = useCallback(
    ({ item, index }: { item: ProfileType; index: number }) => (
      <Animated.View
        entering={FadeIn.delay(index * 50).duration(300)}
        exiting={FadeOut.duration(200)}
        layout={LinearTransition.springify()}
      >
        <RenderHomeNearby item={item} />
      </Animated.View>
    ),
    []
  );

  const renderRecommendationItem = useCallback(
    ({ item, index }: { item: ProfileType; index: number }) => (
      <Animated.View entering={FadeIn.delay(index * 100)} layout={LinearTransition.springify()}>
        <RenderRecommendation item={item} />
      </Animated.View>
    ),
    []
  );

  const NoCategoryListFound = useCallback(
    () => (
      <Animated.View style={styles.noDataFoundView} entering={FadeIn.duration(400)} exiting={FadeOut.duration(400)}>
        <Text style={[styles.noDataFoundText, { color: colors.TextColor }]}>
          No people found for <Text style={{ color: colors.Primary }}>{selectedCategory}</Text>.
        </Text>
      </Animated.View>
    ),
    [selectedCategory, colors]
  );

  const RenderNearbyHeader = useCallback(() => {
    return (
      <Pressable
        style={{ height: 40, alignSelf: 'flex-end', justifyContent: 'center' }}
        hitSlop={{ right: 10, top: 10, bottom: 10, left: 10 }}
        onPress={handleSeeMorePress}
      >
        <Text style={{ color: colors.TextColor, fontFamily: FONTS.SemiBold, fontSize: 15 }}>See more</Text>
      </Pressable>
    );
  }, [handleSeeMorePress]);

  return (
    <GradientView>
      <View style={styles.Container}>
        <BottomTabHeader showSetting={true} hideSettingAndNotification={false} />

        <ScrollView
          style={{ flexGrow: 1, width: '100%' }}
          nestedScrollEnabled
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressBackgroundColor={COLORS.White}
              colors={[COLORS.Primary]}
            />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[{ paddingHorizontal: 20, alignSelf: 'center' }]} entering={FadeIn.duration(500)}>
            <CategoryHeaderView title="Welcome to explore" description="I'm looking for..." />

            <Animated.FlatList
              ref={categoryListRef}
              horizontal
              nestedScrollEnabled
              data={HomeLookingForData}
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={keyExtractor}
              renderItem={renderLookingItem}
            />

            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.Primary} style={{ height: 190 }} />
            ) : categoryData?.length > 0 ? (
              <>
                <RenderNearbyHeader />
                <Animated.FlatList
                  horizontal
                  ref={nearbyListRef}
                  nestedScrollEnabled
                  data={categoryData}
                  contentContainerStyle={{ gap: 15 }}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={keyExtractor}
                  renderItem={renderHomeNearbyItem}
                />
              </>
            ) : (
              <NoCategoryListFound />
            )}

            <CategoryHeaderView title="Near by" description="Based on your profile" style={{ marginTop: 30 }} />

            {isNearbyFetching ? (
              <ActivityIndicator size="large" color={COLORS.Primary} style={{ height: 190 }} />
            ) : (
              <Animated.FlatList
                horizontal
                nestedScrollEnabled
                data={nearByData}
                contentContainerStyle={{ gap: 15 }}
                showsHorizontalScrollIndicator={false}
                keyExtractor={keyExtractor}
                renderItem={renderRecommendationItem}
                ListEmptyComponent={
                  <Animated.View
                    style={styles.noDataFoundView}
                    entering={FadeIn.duration(400)}
                    exiting={FadeOut.duration(400)}
                  >
                    <Text style={[styles.noDataFoundText, { color: colors.TextColor }]}>No people near you.</Text>
                  </Animated.View>
                }
              />
            )}
          </Animated.View>
        </ScrollView>
      </View>
    </GradientView>
  );
};

export default memo(HomeScreen);
