/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import NetInfo from '@react-native-community/netinfo';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StatusBar, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import {COLORS} from '../../../Common/Theme';
import {store} from '../../../Redux/Store/store';
import UserService from '../../../Services/AuthService';
import {useCustomToast} from '../../../Utils/toastUtils';
import ItsAMatch from '../../Explore/Components/ItsAMatch';
import CategoryDetailHeader from './Components/CategoryDetailHeader';
import CategoryRenderCard from './Components/CategoryRenderCard';
import styles from './styles';

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
  const {showToast} = useCustomToast();
  const {navigate} = useNavigation();

  const LeftSwipedUserIds = useSelector(
    state => state?.user?.swipedLeftUserIds || [],
  );
  const RightSwipedUserIds = useSelector(
    state => state?.user?.swipedRightUserIds || [],
  );
  const [CategoryData, setCategoryData] = useState([]);
  const [IsAPILoading, setIsAPILoading] = useState(true);
  const [ItsMatchModalView, setItsMatchModalView] = useState(false);
  const [CurrentCardIndex, setCurrentCardIndex] = useState<number>(-1);

  useEffect(() => {
    CheckConnectionAndFetchAPI();
  }, []);

  const CheckConnectionAndFetchAPI = async () => {
    setIsAPILoading(true);
    const isConnected = (await NetInfo.fetch()).isConnected;

    if (isConnected) {
      FetchAPIData();
      setItsMatchModalView(false);
    } else {
      setIsAPILoading(false);
      showToast(
        'No Internet Connection',
        'Please check your internet connection',
        'error',
      );
      setItsMatchModalView(false);
    }
  };

  const FetchAPIData = useCallback(async () => {
    try {
      const userDataForApi = {
        eventName: 'list_neighbour_home',
        latitude: userData.latitude,
        longitude: userData.longitude,
        radius: userData?.userData?.radius
          ? userData?.userData?.radius
          : 9000000000000000,
        unlike: store.getState().user?.swipedLeftUserIds,
        like: store.getState().user?.swipedRightUserIds,
        hoping: params?.item?.title,
        skip: 0,
        limit: 200,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);

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
  }, [LeftSwipedUserIds, RightSwipedUserIds, userData, params?.item?.title]);

  useEffect(() => {
    FetchAPIData();
  }, [LeftSwipedUserIds, RightSwipedUserIds]);

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
          data={CategoryData}
          style={styles.FlatListStyle}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          renderItem={({item, index}) => {
            return (
              <CategoryRenderCard
                item={item}
                index={index}
                FetchAPIData={FetchAPIData}
                setIsAPILoading={setIsAPILoading}
                setCurrentCardIndex={setCurrentCardIndex}
                setItsMatchModalView={setItsMatchModalView}
              />
            );
          }}
          ListEmptyComponent={<ListEmptyView />}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{flex: CategoryData.length === 0 ? 1 : 0}}
        />
      </View>

      {ItsMatchModalView && (
        <Modal
          isVisible={ItsMatchModalView}
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          useNativeDriver
          useNativeDriverForBackdrop
          hasBackdrop
          onBackdropPress={() => {
            setItsMatchModalView(false);
          }}
          onBackButtonPress={() => {
            setItsMatchModalView(false);
          }}
          style={{
            flex: 1,
            margin: 0,
          }}>
          <ItsAMatch
            user={CategoryData && CategoryData[CurrentCardIndex]}
            onSayHiClick={() => {
              if (CategoryData[CurrentCardIndex]?._id) {
                setItsMatchModalView(false);
                navigate('Chat', {
                  id: CategoryData[CurrentCardIndex]?._id,
                });
              } else {
                showToast('Error', "Sorry! Can't find user", 'error');
              }
            }}
            onCloseModalClick={() => setItsMatchModalView(false)}
            setItsMatch={setItsMatchModalView}
          />
        </Modal>
      )}
    </View>
  );
};

export default CategoryDetailCardsScreen;
