/* eslint-disable react-hooks/exhaustive-deps */
import messaging from '@react-native-firebase/messaging';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, View } from 'react-native';
import { requestNotifications } from 'react-native-permissions';
import GradientView from '../../Common/GradientView';
import { COLORS } from '../../Common/Theme';
import { HomeLookingForData } from '../../Components/Data';
import { useLocationPermission } from '../../Hooks/useLocationPermission';
import { getMyLikes } from '../../Utils/getMyLikes';
import { getProfileData } from '../../Utils/profileUtils';
import { updateDeviceToken } from '../../Utils/updateDeviceToken';
import BottomTabHeader from './Components/BottomTabHeader';
import CategoryHeaderView from './Components/CategoryHeaderView';
import RenderLookingView from './Components/RenderlookingView';
import styles from './styles';
import RenderHomeNearby from './Components/RenderHomeNearby';
import CommonImages from '../../Common/CommonImages';
import RenderRecommendation from './Components/RenderRecommendation';

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
  // More profiles...
];

const HomeScreen = () => {
  const [isAPIDataLoading, setIsAPIDataLoading] = useState(false);
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
    setIsAPIDataLoading(true);

    try {
      await Promise.allSettled([getMyLikes(), getProfileData()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
      setIsAPIDataLoading(false);
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
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 20, alignSelf: 'center' }}>
            <CategoryHeaderView Title="Welcome to explore" Description="I’m looking for..." />
            <FlatList
              horizontal
              nestedScrollEnabled
              data={HomeLookingForData}
              contentContainerStyle={{ gap: 10 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return <RenderLookingView item={item} IsLoading={isAPIDataLoading} />;
              }}
            />

            <FlatList
              horizontal
              nestedScrollEnabled
              data={profiles}
              contentContainerStyle={{ gap: 10 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return <RenderHomeNearby item={item} IsLoading={isAPIDataLoading} />;
              }}
            />

            <CategoryHeaderView Title="Near by" Description="Base on your profile" />
            <FlatList
              horizontal
              nestedScrollEnabled
              data={HomeLookingForData}
              contentContainerStyle={{ gap: 10 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return <RenderRecommendation item={item} IsLoading={isAPIDataLoading} />;
              }}
            />
          </View>
        </ScrollView>
      </View>
    </GradientView>
  );
};

export default HomeScreen;
