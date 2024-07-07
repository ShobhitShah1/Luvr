import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, ScrollView, View} from 'react-native';
import {requestNotifications} from 'react-native-permissions';
import TextString from '../../Common/TextString';
import {COLORS} from '../../Common/Theme';
import {HomeLookingForData} from '../../Components/Data';
import {useLocationPermission} from '../../Hooks/useLocationPermission';
import {
  onSwipeRight,
  setUserData,
  updateField,
} from '../../Redux/Action/userActions';
import {store} from '../../Redux/Store/store';
import UserService from '../../Services/AuthService';
import {LocalStorageFields} from '../../Types/LocalStorageFields';
import {useCustomToast} from '../../Utils/toastUtils';
import BottomTabHeader from './Components/BottomTabHeader';
import CategoryHeaderView from './Components/CategoryHeaderView';
import RenderLookingView from './Components/RenderlookingView';
import styles from './styles';

const HomeScreen = () => {
  const [IsAPIDataLoading, setIsAPIDataLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const {requestLocationPermission} = useLocationPermission();
  const {showToast} = useCustomToast();

  useEffect(() => {
    Promise.all([
      GetMyLikes(),
      GetProfileData(),
      AskNotificationPermission(),
      UpdateDeviceToken(),
    ]);
  }, []);

  useEffect(() => {
    handleLocationPermissionRequest();
  }, []);

  const AskNotificationPermission = async () => {
    requestNotifications(['alert', 'sound']);
    await messaging().requestPermission();
  };

  const handleLocationPermissionRequest = async () => {
    requestLocationPermission();
  };

  const UpdateDeviceToken = async () => {
    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      return;
    }
    const Token = await messaging().getToken();

    if (Token) {
      const userDataForApi = {
        eventName: 'update_notification_token',
        notification_token: Token,
      };

      await UserService.UserRegister(userDataForApi);
    }
  };

  function flattenObject(obj: any): Record<string, any> {
    if (!obj || typeof obj !== 'object') {
      return {};
    }

    return Object.entries(obj).reduce(
      (acc: Record<string, any>, [key, value]) => {
        const prefixedKey = key;
        if (typeof value === 'object' && !Array.isArray(value)) {
          const flattened = flattenObject(value);
          Object.assign(acc, flattened);
        } else {
          acc[prefixedKey] = value;
        }
        return acc;
      },
      {},
    );
  }

  const GetProfileData = async () => {
    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );
      return;
    }

    try {
      const userDataForApi = {
        eventName: 'get_profile',
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        const flattenedData = flattenObject(APIResponse.data);
        Object.entries(flattenedData).forEach(([field, value]) => {
          if (field in LocalStorageFields) {
            const validField = field as keyof typeof LocalStorageFields;
            store.dispatch(updateField(validField, value));
          }
        });
        store.dispatch(setUserData(APIResponse.data));
      }
    } catch (error) {
      showToast('Error', String(error), 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setIsAPIDataLoading(true);

    try {
      await Promise.allSettled([GetMyLikes(), GetProfileData()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
      setIsAPIDataLoading(false);
    }
  }, []);

  const GetMyLikes = async () => {
    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      return;
    }

    setIsAPIDataLoading(true);
    try {
      setTimeout(async () => {
        const userDataForApi = {
          eventName: 'my_likes',
        };

        const APIResponse = await UserService.UserRegister(userDataForApi);
        if (APIResponse?.code === 200) {
          if (APIResponse?.code === 200 && APIResponse?.data) {
            const userIds = Array.isArray(APIResponse.data)
              ? APIResponse.data
              : [APIResponse.data];
            store.dispatch(onSwipeRight(userIds));
          }
        }
      }, 2000);
    } catch (error) {
      showToast('Error', String(error), 'error');
    } finally {
      setIsAPIDataLoading(false);
      setRefreshing(false);
    }
  };

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
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <RenderLookingView
                item={item}
                index={index}
                IsLoading={IsAPIDataLoading}
              />
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
