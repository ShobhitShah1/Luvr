/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {HomeLookingForData} from '../../Components/Data';
import BottomTabHeader from './Components/BottomTabHeader';
import CategoryHeaderView from './Components/CategoryHeaderView';
import styles from './styles';
import UserService from '../../Services/AuthService';
import {store} from '../../Redux/Store/store';
import {
  onSwipeRight,
  setUserData,
  updateField,
} from '../../Redux/Action/userActions';
import RenderLookingView from './Components/RenderLookingView';

const HomeScreen = () => {
  const [IsAPIDataLoading, setIsAPIDataLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    GetMyLikes();
    GetProfileData();
  }, []);

  const GetProfileData = async () => {
    try {
      const userDataForApi = {
        eventName: 'get_profile',
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        store.dispatch(setUserData(APIResponse.data));
        console.log('GetProfileData Data:', APIResponse.data);
      }
    } catch (error) {
      console.log('Something Went Wrong With Feting API Data');
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsAPIDataLoading(true);
    setTimeout(() => {
      GetMyLikes();
    }, 2000);
  }, []);

  const GetMyLikes = async () => {
    setIsAPIDataLoading(true);
    try {
      setTimeout(async () => {
        const userDataForApi = {
          eventName: 'my_likes',
        };

        const APIResponse = await UserService.UserRegister(userDataForApi);
        if (APIResponse?.code === 200) {
          // console.log('Get My Like Data:', APIResponse.data);
          if (APIResponse?.code === 200 && APIResponse?.data) {
            const userIds = Array.isArray(APIResponse.data)
              ? APIResponse.data
              : [APIResponse.data];
            console.log('userIds', userIds);
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

  const modifyData = (arr: any) => {
    let finalData = [];
    let type1 = true;

    let i = 0;
    while (i < arr.length) {
      let data = [];

      for (let j = 0; j < (type1 ? 2 : 1) && i < arr.length; j++) {
        data.push(arr[i]);
        i += 1;
      }

      finalData.push({
        id: Math.random().toString(),
        data,
        type: type1 ? 1 : 2,
      });

      type1 = !type1;
    }

    return finalData;
  };

  const DataToRenderForYou = modifyData(HomeLookingForData);

  const renderForYouView = ({item, index}: any) => {
    console.log('item', item?.type);
    if (item.type === 1) {
      return <HorizontalViewForYou item={item} index={index} />;
    }
    if (item.type === 2 && item.data.length === 1) {
      return <VerticalViewForYou item={item} />;
    }
  };

  const HorizontalViewForYou = ({item, index}: any) => (
    <View style={styles.row}>
      <RenderlookingView item={item.data[0]} index={index} />
      <View style={styles.LeftMargin} />
      <RenderlookingView item={item.data[1]} index={index} />
    </View>
  );

  const VerticalViewForYou = ({item}: any) => (
    <View key={item.data[0].id} style={styles.item2}>
      <VerticalImageView data={item.data[0]} />
    </View>
  );

  const VerticalImageView = ({data}: any) => {
    console.log('data?.image', data?.image);
    return (
      <ImageBackground
        source={data?.image}
        resizeMode="cover"
        style={styles.item1Inner}>
        <Text style={styles.VerticalImageViewText}>{data?.title}</Text>
      </ImageBackground>
    );
  };

  return (
    <View style={styles.Container}>
      <BottomTabHeader showSetting={true} hideSettingAndNotification={false} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        bounces={false}>
        <FlatList
          numColumns={2}
          style={styles.FlatListStyle}
          data={HomeLookingForData}
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
