/* eslint-disable react-hooks/exhaustive-deps */
import messaging from '@react-native-firebase/messaging';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, ScrollView, View} from 'react-native';
import {requestNotifications} from 'react-native-permissions';
import {COLORS} from '../../Common/Theme';
import {HomeLookingForData} from '../../Components/Data';
import {useLocationPermission} from '../../Hooks/useLocationPermission';
import {getMyLikes} from '../../Utils/getMyLikes';
import {getProfileData} from '../../Utils/profileUtils';
import {updateDeviceToken} from '../../Utils/updateDeviceToken';
import BottomTabHeader from './Components/BottomTabHeader';
import CategoryHeaderView from './Components/CategoryHeaderView';
import RenderLookingView from './Components/RenderlookingView';
import styles from './styles';

const HomeScreen = () => {
  const [IsAPIDataLoading, setIsAPIDataLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const {requestLocationPermission} = useLocationPermission();

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
    <View style={styles.Container}>
      <BottomTabHeader showSetting={true} hideSettingAndNotification={false} />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor={COLORS.White}
            colors={[COLORS.Primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <FlatList
          numColumns={2}
          bounces={false}
          data={HomeLookingForData}
          style={styles.FlatListStyle}
          columnWrapperStyle={styles.columWrapper}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <RenderLookingView item={item} IsLoading={IsAPIDataLoading} />
            );
          }}
          ListHeaderComponent={
            <CategoryHeaderView
              Title="Welcome to explore"
              Description="I’m looking for..."
            />
          }
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
