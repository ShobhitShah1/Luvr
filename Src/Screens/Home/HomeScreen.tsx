import messaging from '@react-native-firebase/messaging';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, ScrollView, View} from 'react-native';
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
import BottomTabHeader from './Components/BottomTabHeader';
import CategoryHeaderView from './Components/CategoryHeaderView';
import RenderLookingView from './Components/RenderlookingView';
import styles from './styles';
import TextString from '../../Common/TextString';
import NetInfo from '@react-native-community/netinfo';
import {useCustomToast} from '../../Utils/toastUtils';
import {COLORS} from '../../Common/Theme';

const HomeScreen = () => {
  const [IsAPIDataLoading, setIsAPIDataLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const {requestLocationPermission} = useLocationPermission();
  const {showToast} = useCustomToast();

  useEffect(() => {
    Promise.all([GetMyLikes(), GetProfileData(), requestUserPermission()]);
  }, []);

  useEffect(() => {
    handleLocationPermissionRequest();
  }, []);

  const handleLocationPermissionRequest = async () => {
    requestLocationPermission();
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    const Token = await messaging().getToken();
    if (enabled) {
      console.log('Token', Token);
      console.log('Authorization status:', authStatus);
    }
  }

  function flattenObject(obj: any, prefix: string = ''): Record<string, any> {
    if (!obj || typeof obj !== 'object') {
      return {};
    }

    return Object.entries(obj).reduce(
      (acc: Record<string, any>, [key, value]) => {
        const prefixedKey = key;
        // const prefixedKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && !Array.isArray(value)) {
          const flattened = flattenObject(value, prefixedKey);
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
      console.log('Something Went Wrong With Feting API Data', error);
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
      console.log('Something Went Wrong With Feting API Data', error);
    } finally {
      setIsAPIDataLoading(false);
      setRefreshing(false);
    }
  };

  // const modifyData = (arr: any) => {
  //   let finalData = [];
  //   let type1 = true;

  //   let i = 0;
  //   while (i < arr.length) {
  //     let data = [];

  //     for (let j = 0; j < (type1 ? 2 : 1) && i < arr.length; j++) {
  //       data.push(arr[i]);
  //       i += 1;
  //     }

  //     finalData.push({
  //       id: Math.random().toString(),
  //       data,
  //       type: type1 ? 1 : 2,
  //     });

  //     type1 = !type1;
  //   }

  //   return finalData;
  // };

  // const DataToRenderForYou = modifyData(HomeLookingForData);

  // const renderForYouView = ({item, index}: any) => {
  //   console.log('item', item?.type);
  //   if (item.type === 1) {
  //     return <HorizontalViewForYou item={item} index={index} />;
  //   }
  //   if (item.type === 2 && item.data.length === 1) {
  //     return <VerticalViewForYou item={item} />;
  //   }
  // };

  // const HorizontalViewForYou = ({item, index}: any) => (
  //   <View style={styles.row}>
  //     <RenderlookingView item={item.data[0]} index={index} />
  //     <View style={styles.LeftMargin} />
  //     <RenderlookingView item={item.data[1]} index={index} />
  //   </View>
  // );

  // const VerticalViewForYou = ({item}: any) => (
  //   <View key={item.data[0].id} style={styles.item2}>
  //     <VerticalImageView data={item.data[0]} />
  //   </View>
  // );

  // const VerticalImageView = ({data}: any) => {
  //   // console.log('data?.image', data?.image);
  //   return (
  //     <ImageBackground
  //       source={data?.image}
  //       resizeMode="cover"
  //       style={styles.item1Inner}>
  //       <Text style={styles.VerticalImageViewText}>{data?.title}</Text>
  //     </ImageBackground>
  //   );
  // };

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
          style={styles.FlatListStyle}
          bounces={false}
          data={HomeLookingForData}
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
        {/* <FlatList
          style={[styles.FlatListStyle]}
          data={DataToRenderForYou}
          renderItem={renderForYouView}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={
            <CategoryHeaderView
              Title="For you"
              Description="Based on your profile"
            />
          }
        /> */}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
