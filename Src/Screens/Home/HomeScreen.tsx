/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect} from 'react';
import {FlatList, ImageBackground, ScrollView, Text, View} from 'react-native';
import HomeLookingForData from '../../Components/Data/HomeData/HomeLookingForData';
import BottomTabHeader from './Components/BottomTabHeader';
import CategoryHeaderView from './Components/CategoryHeaderView';
import RenderlookingView from './Components/RenderlookingView';
import styles from './styles';
import UserService from '../../Services/AuthService';
import {store} from '../../Redux/Store/store';
import {onSwipeRight} from '../../Redux/Action/userActions';

const HomeScreen = () => {
  useEffect(() => {
    GetMyLikes();
  }, []);

  const GetMyLikes = async () => {
    try {
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
        } else {
          // Handle error
        }
      } else {
      }
    } catch (error) {
      console.log('Something Went Wrong With Feting API Data', error);
    } finally {
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
      <BottomTabHeader />

      <ScrollView bounces={false}>
        <FlatList
          numColumns={2}
          style={styles.FlatListStyle}
          data={HomeLookingForData}
          renderItem={({item, index}) => {
            return <RenderlookingView item={item} index={index} />;
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
