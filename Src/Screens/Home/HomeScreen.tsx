/* eslint-disable react-hooks/exhaustive-deps */
import messaging from '@react-native-firebase/messaging';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, View } from 'react-native';
import { requestNotifications } from 'react-native-permissions';
import CommonImages from '../../Common/CommonImages';
import GradientView from '../../Common/GradientView';
import { COLORS } from '../../Common/Theme';
import { HomeLookingForData } from '../../Components/Data';
import { useLocationPermission } from '../../Hooks/useLocationPermission';
import { getMyLikes } from '../../Utils/getMyLikes';
import { getProfileData } from '../../Utils/profileUtils';
import { updateDeviceToken } from '../../Utils/updateDeviceToken';
import BottomTabHeader from './Components/BottomTabHeader';
import CategoryHeaderView from './Components/CategoryHeaderView';
import RenderHomeNearby from './Components/RenderHomeNearby';
import RenderLookingView from './Components/RenderlookingView';
import RenderRecommendation from './Components/RenderRecommendation';
import styles from './styles';

const profiles = [
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
  const [refreshing, setRefreshing] = React.useState(false);
  const { requestLocationPermission } = useLocationPermission();

  useEffect(() => {
    Promise.all([
      getMyLikes(),
      getProfileData(),
      askNotificationPermission(),
      updateDeviceToken(),
      handleLocationPermissionRequest(),
    ]);
  }, []);

  const askNotificationPermission = async () => {
    requestNotifications(['alert', 'sound']);
    await messaging().requestPermission();
  };

  const handleLocationPermissionRequest = async () => {
    requestLocationPermission();
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
            <CategoryHeaderView title="Welcome to explore" description="I’m looking for..." />
            <FlatList
              horizontal
              nestedScrollEnabled
              data={HomeLookingForData}
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return <RenderLookingView item={item} />;
              }}
            />

            <FlatList
              horizontal
              nestedScrollEnabled
              data={profiles}
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return <RenderHomeNearby item={item} />;
              }}
            />

            <CategoryHeaderView title="Near by" description="Base on your profile" style={{ marginTop: 30 }} />
            <FlatList
              horizontal
              nestedScrollEnabled
              data={HomeLookingForData}
              contentContainerStyle={{ gap: 15 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return <RenderRecommendation item={item} />;
              }}
            />
          </View>
        </ScrollView>
      </View>
    </GradientView>
  );
};

export default memo(HomeScreen);
