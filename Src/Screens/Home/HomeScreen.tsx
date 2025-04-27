/* eslint-disable react-hooks/exhaustive-deps */
import messaging from '@react-native-firebase/messaging';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, View } from 'react-native';
import { requestNotifications } from 'react-native-permissions';
import CommonImages from '../../Common/CommonImages';
import GradientView from '../../Common/GradientView';
import { COLORS } from '../../Common/Theme';
import { HomeLookingForData } from '../../Components/Data';
import { useBoostModal } from '../../Hooks/useBoostModal';
import { useLocationPermission } from '../../Hooks/useLocationPermission';
import { HomeListProps } from '../../Types/Interface';
import { getMyLikes } from '../../Utils/getMyLikes';
import { getProfileData } from '../../Utils/profileUtils';
import { updateDeviceToken } from '../../Utils/updateDeviceToken';
import BottomTabHeader from './Components/BottomTabHeader';
import CategoryHeaderView from './Components/CategoryHeaderView';
import RenderHomeNearby from './Components/RenderHomeNearby';
import RenderLookingView from './Components/RenderlookingView';
import RenderRecommendation from './Components/RenderRecommendation';
import styles from './styles';

const PROFILES = [
  {
    id: 1,
    name: 'Adan Smith',
    job: 'Engineer',
    location: 'USA',
    likes: 10,
    image: CommonImages.HomeHoping,
  },
  {
    id: 2,
    name: 'Jane Doe',
    job: 'Designer',
    location: 'CAN',
    likes: 15,
    image: CommonImages.HomeHoping,
  },
];

const HomeScreen = () => {
  const { showModal } = useBoostModal();
  const isFocus = useIsFocused();

  const [refreshing, setRefreshing] = useState(false);
  const [permissionsRequested, setPermissionsRequested] = useState(false);
  const { requestLocationPermission } = useLocationPermission();

  useEffect(() => {
    if (!permissionsRequested) {
      const setupPermissions = async () => {
        await Promise.all([askNotificationPermission(), handleLocationPermissionRequest(), updateDeviceToken()]);
        setPermissionsRequested(true);
      };

      setupPermissions();
    }
  }, [permissionsRequested]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await Promise.all([getMyLikes(), getProfileData()]);
        } catch (error) {
          console.error('Error fetching data on focus:', error);
        }
      };

      fetchData();
      return () => {};
    }, [])
  );

  useEffect(() => {
    if (isFocus) {
      setTimeout(() => {
        showModal();
      }, 5000);
    }
  }, []);

  const askNotificationPermission = async () => {
    try {
      await requestNotifications(['alert', 'sound']);
      await messaging().requestPermission();
    } catch (error) {
      console.error('Notification permission error:', error);
    }
  };

  const handleLocationPermissionRequest = async () => {
    try {
      await requestLocationPermission();
    } catch (error) {
      console.error('Location permission error:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await Promise.allSettled([getMyLikes(), getProfileData()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const keyExtractor = useCallback((item: any, index: number) => `${item.id || index.toString()}`, []);

  const renderLookingItem = useCallback(({ item }: { item: HomeListProps['item'] }) => {
    return <RenderLookingView item={item} />;
  }, []);

  const renderHomeNearbyItem = useCallback(({ item }: { item: any }) => {
    return <RenderHomeNearby item={item} />;
  }, []);

  const renderRecommendationItem = useCallback(({ item }: { item: HomeListProps['item'] }) => {
    return <RenderRecommendation item={item} />;
  }, []);

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
          <View style={{ paddingHorizontal: 20, alignSelf: 'center' }}>
            <CategoryHeaderView title="Welcome to explore" description="I'm looking for..." />
            <FlatList
              horizontal
              nestedScrollEnabled
              data={HomeLookingForData}
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={keyExtractor}
              renderItem={renderLookingItem}
              initialNumToRender={4}
              maxToRenderPerBatch={4}
              windowSize={5}
              removeClippedSubviews={true}
            />

            <FlatList
              horizontal
              nestedScrollEnabled
              data={PROFILES}
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={keyExtractor}
              renderItem={renderHomeNearbyItem}
              initialNumToRender={2}
              maxToRenderPerBatch={2}
              windowSize={3}
              removeClippedSubviews={true}
            />

            <CategoryHeaderView title="Near by" description="Base on your profile" style={{ marginTop: 30 }} />
            <FlatList
              horizontal
              nestedScrollEnabled
              data={HomeLookingForData}
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={keyExtractor}
              renderItem={renderRecommendationItem}
              initialNumToRender={4}
              maxToRenderPerBatch={4}
              windowSize={5}
              removeClippedSubviews={true}
            />
          </View>
        </ScrollView>
      </View>
    </GradientView>
  );
};

export default memo(HomeScreen);
