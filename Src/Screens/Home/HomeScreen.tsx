/* eslint-disable react-hooks/exhaustive-deps */
import messaging from '@react-native-firebase/messaging';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';
import { requestNotifications } from 'react-native-permissions';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  SlideInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { COLORS } from '../../Common/Theme';
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
  const { requestLocationPermission } = useLocationPermission();

  const isFocus = useIsFocused();
  const { isBoostActive } = useBoost();
  const { showToast } = useCustomToast();
  const { userData } = useUserData();
  const { showModal } = useBoostModal();

  const [selectedCategory, setSelectedCategory] = useState(HomeLookingForData[0]?.title || '');
  const [categoryData, setCategoryData] = useState<ProfileType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const listOpacity = useSharedValue(0);

  const categoryListRef = useRef<FlatList>(null);
  const nearbyListRef = useRef<FlatList>(null);

  useEffect(() => {
    const setupApp = async () => {
      try {
        await Promise.all([askNotificationPermission(), requestLocationPermission(), updateDeviceToken()]);

        // if (isFocus && !isBoostActive) {
        //   setTimeout(showModal, 5000);
        // }
      } catch (error) {
        console.error('App setup error:', error);
      }
    };

    setupApp();
  }, []);

  useEffect(() => {
    fetchCategoryListData();
  }, [selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {};
    }, [])
  );

  // Data fetching methods
  const fetchData = async () => {
    try {
      listOpacity.value = 0;
      await Promise.all([getMyLikes(), getProfileData()]);
      listOpacity.value = withSpring(1, { damping: 15 });
    } catch (error) {
      console.error('Error fetching data on focus:', error);
    }
  };

  const fetchCategoryListData = useCallback(async () => {
    try {
      const userDataForApi = {
        eventName: 'list_neighbour_home',
        latitude: userData.latitude,
        longitude: userData.longitude,
        radius: userData?.radius || 9000000000000000,
        unlike: store.getState().user?.swipedLeftUserIds,
        like: store.getState().user?.swipedRightUserIds,
        hoping: selectedCategory,
        skip: 0,
        limit: 200,
        is_online: true,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);

      if (APIResponse?.code === 200) {
        setCategoryData(APIResponse?.data || []);
      } else {
        showToast(TextString.error.toUpperCase(), APIResponse?.message || 'Please try again later', 'error');
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
    }
  }, [userData, selectedCategory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchData(), fetchCategoryListData()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchCategoryListData]);

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
    ({ item, index }: { item: HomeListProps['item']; index: number }) => (
      <Animated.View entering={FadeIn.delay(index * 100)} layout={LinearTransition.springify()}>
        <RenderRecommendation item={item} onCategoryPress={() => {}} />
      </Animated.View>
    ),
    []
  );

  const NoDataView = useCallback(
    () => (
      <Animated.View style={styles.noDataFoundView} entering={FadeIn.duration(400)}>
        <Text style={styles.noDataFoundText}>No data found</Text>
      </Animated.View>
    ),
    []
  );

  return (
    <GradientView>
      <View style={styles.Container}>
        <BottomTabHeader showSetting={true} hideSettingAndNotification={false} />

        <ScrollView
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
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={true}
            />

            {categoryData?.length > 0 ? (
              <Animated.FlatList
                ref={nearbyListRef}
                horizontal
                nestedScrollEnabled
                data={categoryData}
                contentContainerStyle={{ gap: 15 }}
                showsHorizontalScrollIndicator={false}
                keyExtractor={keyExtractor}
                renderItem={renderHomeNearbyItem}
                initialNumToRender={3}
                maxToRenderPerBatch={5}
                windowSize={3}
                removeClippedSubviews={true}
              />
            ) : (
              <NoDataView />
            )}

            <CategoryHeaderView title="Near by" description="Base on your profile" style={{ marginTop: 30 }} />

            <Animated.FlatList
              horizontal
              nestedScrollEnabled
              data={HomeLookingForData}
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={keyExtractor}
              renderItem={renderRecommendationItem}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={true}
            />
          </Animated.View>
        </ScrollView>
      </View>
    </GradientView>
  );
};

export default memo(HomeScreen);
