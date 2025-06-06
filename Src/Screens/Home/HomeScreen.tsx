/* eslint-disable react-hooks/exhaustive-deps */
import messaging from '@react-native-firebase/messaging';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { requestNotifications } from 'react-native-permissions';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { COLORS, FONTS } from '../../Common/Theme';
import { HomeLookingForData } from '../../Components/Data';
import { MAX_RADIUS } from '../../Config/Setting';
import { useTheme } from '../../Contexts/ThemeContext';
import { useUserData } from '../../Contexts/UserDataContext';
import { useBoost } from '../../Hooks/useBoost';
import { useCustomNavigation } from '../../Hooks/useCustomNavigation';
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
import RenderRecommendation from './Components/RenderRecommendation';
import RenderLookingView from './Components/RenderlookingView';
import styles from './styles';

const askNotificationPermission = async () => {
  try {
    await requestNotifications(['alert', 'sound']);
    await messaging().requestPermission();
  } catch (error) {
    console.error('Notification permission error:', error);
  }
};

const HomeScreen = () => {
  const isFocus = useIsFocused();
  const { colors } = useTheme();
  const navigation = useCustomNavigation();

  const { userData } = useUserData();
  const { isBoostActive } = useBoost();
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
      radius: userData?.radius || MAX_RADIUS,
      unlike: store.getState().user?.swipedLeftUserIds,
      like: store.getState().user?.swipedRightUserIds,
      skip: 0,
      limit: 200,
      is_online: userData?.see_who_is_online || false,
    };
  }, [selectedCategory, userData, store]);

  const fetchCategoryListData = useCallback(async () => {
    try {
      setIsLoading(categoryData?.length === 0);

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
  }, [userData, selectedCategory, store, categoryData, dataToSendInAPI, isLoading]);

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
  }, [userData, selectedCategory, store, categoryData, dataToSendInAPI]);

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

  const renderLookingItem = useCallback(
    ({ item, index }: { item: HomeListProps['item']; index: number }) => (
      <View>
        <RenderLookingView
          item={item}
          selectedCategory={selectedCategory}
          onCategoryPress={(item) => setSelectedCategory(item.title)}
        />
      </View>
    ),
    [selectedCategory]
  );

  const renderHomeNearbyItem = useCallback(
    ({ item, index }: { item: ProfileType; index: number }) => (
      <View>
        <RenderHomeNearby item={item} />
      </View>
    ),
    []
  );

  const renderRecommendationItem = useCallback(
    ({ item, index }: { item: ProfileType; index: number }) => (
      <View>
        <RenderRecommendation item={item} />
      </View>
    ),
    []
  );

  const NoCategoryListFound = useCallback(
    () => (
      <View style={styles.noDataFoundView}>
        <Text style={[styles.noDataFoundText, { color: colors.TextColor }]}>
          No people found for <Text style={{ color: colors.Primary }}>{selectedCategory}</Text>.
        </Text>
      </View>
    ),
    [selectedCategory, colors]
  );

  const RenderNearbyHeader = useCallback(() => {
    return (
      <Pressable
        hitSlop={10}
        onPress={handleSeeMorePress}
        style={{ height: 40, alignSelf: 'flex-end', justifyContent: 'center' }}
      >
        <Text style={{ color: colors.TextColor, fontFamily: FONTS.SemiBold, fontSize: 14 }}>See more</Text>
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
          <View style={[{ paddingHorizontal: 20, alignSelf: 'center' }]}>
            <CategoryHeaderView title="Welcome to explore" description="I'm looking for..." />

            <FlatList
              ref={categoryListRef}
              horizontal
              nestedScrollEnabled
              data={HomeLookingForData}
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `${item.title}-${index}`}
              renderItem={renderLookingItem}
            />

            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.Primary} style={{ height: 180 }} />
            ) : categoryData?.length > 0 ? (
              <>
                <RenderNearbyHeader />
                <FlatList
                  horizontal
                  ref={nearbyListRef}
                  nestedScrollEnabled
                  data={categoryData}
                  contentContainerStyle={{ gap: 15 }}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `${item._id}-${index}`}
                  renderItem={renderHomeNearbyItem}
                />
              </>
            ) : (
              <NoCategoryListFound />
            )}

            <CategoryHeaderView title="Near by" description="Based on your profile" style={{ marginTop: 30 }} />

            {isNearbyFetching ? (
              <ActivityIndicator size="large" color={COLORS.Primary} style={{ height: 180 }} />
            ) : (
              <FlatList
                horizontal
                nestedScrollEnabled
                data={nearByData}
                contentContainerStyle={{ gap: 15 }}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${item._id}-${index}`}
                renderItem={renderRecommendationItem}
                ListEmptyComponent={
                  <View style={styles.noDataFoundView}>
                    <Text style={[styles.noDataFoundText, { color: colors.TextColor }]}>No people near you.</Text>
                  </View>
                }
              />
            )}
          </View>
        </ScrollView>
      </View>
    </GradientView>
  );
};

export default memo(HomeScreen);
