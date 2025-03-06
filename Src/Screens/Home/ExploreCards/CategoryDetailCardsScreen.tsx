/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import NetInfo from '@react-native-community/netinfo';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {FC, memo, useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StatusBar, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import TextString from '../../../Common/TextString';
import {COLORS} from '../../../Common/Theme';
import UserService from '../../../Services/AuthService';
import {ProfileType} from '../../../Types/ProfileType';
import {useCustomToast} from '../../../Utils/toastUtils';
import ItsAMatch from '../../Explore/Components/ItsAMatch';
import CategoryDetailHeader from './Components/CategoryDetailHeader';
import CategoryRenderCard from './Components/CategoryRenderCard';
import styles from './styles';
import {store} from '../../../Redux/Store/store';

type RootStackParamList = {
  CategoryDetailCards: {
    item: {
      id: number;
      title: string;
      image: any;
    };
  };
};

interface CategoryDetailCardsInterface
  extends RouteProp<RootStackParamList, 'CategoryDetailCards'> {}

const ListEmptyView = ({categoryName}: {categoryName: string}) => {
  return (
    <View style={styles.EmptyListView}>
      <Text style={styles.EmptyListText}>
        Sorry! Unable to Find Card for <Text>"{categoryName}"</Text>
      </Text>
    </View>
  );
};

const CategoryDetailCardsScreen: FC = () => {
  const {params} = useRoute<CategoryDetailCardsInterface>();
  const userData = useSelector((state: any) => state?.user);
  const {showToast} = useCustomToast();
  const navigation = useNavigation() as any;

  const [CategoryData, setCategoryData] = useState<ProfileType[]>([]);
  const [IsAPILoading, setIsAPILoading] = useState(true);
  const [ItsMatchModalView, setItsMatchModalView] = useState(false);
  const [CurrentCardIndex, setCurrentCardIndex] = useState<number>(-1);

  useEffect(() => {
    checkConnectionAndFetchAPI();
  }, []);

  useEffect(() => {
    fetchAPIData();
  }, [userData, userData?.swipedLeftUserIds, userData?.swipedRightUserIds]);

  const checkConnectionAndFetchAPI = async () => {
    setIsAPILoading(true);
    setItsMatchModalView(false);

    const isConnected = (await NetInfo.fetch()).isConnected;

    if (!isConnected) {
      setIsAPILoading(false);
      setItsMatchModalView(false);
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );
      return;
    }

    await fetchAPIData();
  };

  const fetchAPIData = useCallback(async () => {
    try {
      const userDataForApi = {
        eventName: 'list_neighbour_home',
        latitude: userData.latitude,
        longitude: userData.longitude,
        radius: userData?.userData?.radius || 9000000000000000,
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
          TextString.error.toUpperCase(),
          APIResponse?.message || 'Please try again letter',
          'error',
        );
      }
    } catch (error: any) {
      showToast(
        TextString.error.toUpperCase(),
        String(error?.message || error),
        'error',
      );
    } finally {
      setIsAPILoading(false);
    }
  }, [userData, params?.item?.title]);

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
          columnWrapperStyle={{justifyContent: 'space-between'}}
          renderItem={({item, index}) => {
            return (
              <CategoryRenderCard
                item={item}
                index={index}
                FetchAPIData={fetchAPIData}
                setIsAPILoading={setIsAPILoading}
                setCurrentCardIndex={setCurrentCardIndex}
                setItsMatchModalView={setItsMatchModalView}
              />
            );
          }}
          ListEmptyComponent={
            <ListEmptyView categoryName={params?.item?.title} />
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{flex: CategoryData.length === 0 ? 1 : 0}}
        />
      </View>

      <ItsAMatch
        isVisible={ItsMatchModalView}
        onClose={() => {
          setItsMatchModalView(false);
        }}
        user={CategoryData && CategoryData[CurrentCardIndex]}
        onSayHiClick={() => {
          if (CategoryData[CurrentCardIndex]?._id) {
            setItsMatchModalView(false);
            navigation?.navigate('Chat', {
              id: CategoryData[CurrentCardIndex]?._id,
            });
          } else {
            showToast('Error', "Sorry! Can't find user", 'error');
          }
        }}
        onCloseModalClick={() => setItsMatchModalView(false)}
        setItsMatch={setItsMatchModalView}
      />
    </View>
  );
};

export default memo(CategoryDetailCardsScreen);
