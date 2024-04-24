/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {useRoute} from '@react-navigation/native';
import React, {FC, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StatusBar, Text, View} from 'react-native';
import {COLORS} from '../../../Common/Theme';
import styles from './styles';
import {useSelector} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {useCustomToast} from '../../../Utils/toastUtils';
import UserService from '../../../Services/AuthService';
import CategoryDetailHeader from './Components/CategoryDetailHeader';
import CategoryRenderCard from './Components/CategoryRenderCard';

interface CategoryDetailCardsProps {
  params: {
    item: {
      id: number;
      title: string;
      image: any;
    };
  };
}

const CategoryDetailCardsScreen: FC = () => {
  const {params} = useRoute<CategoryDetailCardsProps>();
  const userData = useSelector((state: any) => state?.user);
  // console.log('userData', userData);
  const {showToast} = useCustomToast();
  const LeftSwipedUserIds = useSelector(
    state => state?.user?.swipedLeftUserIds || [],
  );
  const RightSwipedUserIds = useSelector(
    state => state?.user?.swipedRightUserIds || [],
  );
  const [CategoryData, setCategoryData] = useState([]);
  const [IsAPILoading, setIsAPILoading] = useState(false);
  const [IsNetConnected, setIsNetConnected] = useState(false);

  useEffect(() => {
    CheckConnectionAndFetchAPI();
  }, []);

  const CheckConnectionAndFetchAPI = async () => {
    setIsAPILoading(true);
    const isConnected = (await NetInfo.fetch()).isConnected;

    if (isConnected) {
      setIsNetConnected(true);
      FetchAPIData();
    } else {
      setIsNetConnected(false);
      setIsAPILoading(false);
      showToast(
        'No Internet Connection',
        'Please check your internet connection',
        'error',
      );
    }
  };

  const FetchAPIData = async () => {
    try {
      const userDataForApi = {
        eventName: 'list_neighbour_home',
        latitude: userData.latitude,
        longitude: userData.longitude,
        radius: 500,
        unlike: LeftSwipedUserIds,
        like: RightSwipedUserIds,
        hoping: params?.item?.title,
        skip: 0,
        limit: 200,
      };
      const APIResponse = await UserService.UserRegister(userDataForApi);

      console.log('APIResponse', APIResponse);

      if (APIResponse?.code === 200) {
        setCategoryData(APIResponse?.data || []);
      } else {
        showToast(
          'Something went wrong',
          APIResponse?.message || 'Please try again letter',
          'error',
        );
      }
      setIsAPILoading(false);
    } catch (error) {
      console.log('Something Went Wrong With Feting API Data');
    } finally {
      setIsAPILoading(false);
    }
  };

  const ListEmptyView = () => {
    return (
      <View style={styles.EmptyListView}>
        <Text style={styles.EmptyListText}>
          Sorry! Unable to Find Card for{' '}
          <Text style={{}}>"{params?.item?.title}"</Text>
        </Text>
      </View>
    );
  };

  if (IsAPILoading) {
    return (
      <View style={styles.Container}>
        <CategoryDetailHeader item={params?.item} />
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={COLORS.Secondary}
        />
        <View style={[styles.container, styles.LoaderContainer]}>
          <ActivityIndicator size={'large'} color={COLORS.Primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.Container}>
      <CategoryDetailHeader item={params?.item} />
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.Secondary} />

      <View style={{flex: 1}}>
        <FlatList
          numColumns={2}
          contentContainerStyle={{flex: CategoryData.length === 0 ? 1 : 0}}
          data={CategoryData}
          style={styles.FlatListStyle}
          renderItem={({item, index}) => {
            return <CategoryRenderCard item={item} index={index} />;
          }}
          ListEmptyComponent={<ListEmptyView />}
        />
      </View>
    </View>
  );
};

export default CategoryDetailCardsScreen;
