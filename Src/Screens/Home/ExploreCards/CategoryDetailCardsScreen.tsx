/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import NetInfo from '@react-native-community/netinfo';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import GradientView from '../../../Common/GradientView';
import TextString from '../../../Common/TextString';
import { useTheme } from '../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../Hooks/useCustomNavigation';
import { store } from '../../../Redux/Store/store';
import UserService from '../../../Services/AuthService';
import { ProfileType } from '../../../Types/ProfileType';
import { useCustomToast } from '../../../Utils/toastUtils';
import ItsAMatch from '../../Explore/Components/ItsAMatch';
import CategoryDetailHeader from './Components/CategoryDetailHeader';
import CategoryRenderCard from './Components/CategoryRenderCard';
import styles from './styles';

type RootStackParamList = {
  CategoryDetailCards: { item: { id: number; title: string; image: any } };
};

interface CategoryDetailCardsInterface extends RouteProp<RootStackParamList, 'CategoryDetailCards'> {}

const CategoryDetailCardsScreen: FC = () => {
  const { colors } = useTheme();
  const { showToast } = useCustomToast();
  const navigation = useCustomNavigation();

  const { params } = useRoute<CategoryDetailCardsInterface>();
  const userData = useSelector((state: any) => state?.user);

  const [categoryData, setCategoryData] = useState<ProfileType[]>([]);
  const [isAPILoading, setIsAPILoading] = useState(false);
  const [ItsMatchModalView, setItsMatchModalView] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(-1);

  useEffect(() => {
    checkConnectionAndFetchAPI();
  }, [userData, userData?.swipedLeftUserIds, userData?.swipedRightUserIds]);

  const checkConnectionAndFetchAPI = async () => {
    setIsAPILoading(categoryData?.length === 0);
    setItsMatchModalView(false);

    const isConnected = (await NetInfo.fetch()).isConnected;

    if (!isConnected) {
      setIsAPILoading(false);
      setItsMatchModalView(false);
      showToast(TextString.error.toUpperCase(), TextString.PleaseCheckYourInternetConnection, TextString.error);
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
        is_online: false,
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);

      if (APIResponse?.code === 200) {
        setCategoryData(APIResponse?.data || []);
      } else {
        showToast(TextString.error.toUpperCase(), APIResponse?.message || 'Please try again letter', 'error');
      }
    } catch (error: any) {
      showToast(TextString.error.toUpperCase(), String(error?.message || error), 'error');
    } finally {
      setIsAPILoading(false);
    }
  }, [userData, params?.item?.title]);

  if (isAPILoading) {
    return (
      <GradientView>
        <View style={styles.container}>
          <CategoryDetailHeader item={params?.item} />
          <View style={[styles.container, styles.LoaderContainer]}>
            <ActivityIndicator size={'large'} color={colors.Primary} />
          </View>
        </View>
      </GradientView>
    );
  }

  return (
    <GradientView>
      <View style={styles.container}>
        <CategoryDetailHeader item={params?.item} />

        <View style={{ flex: 1 }}>
          <FlatList
            numColumns={2}
            data={categoryData}
            style={styles.FlatListStyle}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item, index }) => {
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
              <View style={styles.EmptyListView}>
                <Text style={[styles.EmptyListText, { color: colors.TextColor }]}>
                  Sorry! Unable to Find Card for{' '}
                  <Text style={{ color: colors.Primary }}>"{params?.item?.title || ''}"</Text>
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ flex: categoryData.length === 0 ? 1 : 0 }}
          />
        </View>

        <ItsAMatch
          isVisible={ItsMatchModalView}
          onClose={() => {
            setItsMatchModalView(false);
          }}
          user={categoryData && categoryData[currentCardIndex]}
          onSayHiClick={() => {
            if (categoryData[currentCardIndex]?._id) {
              setItsMatchModalView(false);
              navigation?.navigate('Chat', {
                id: categoryData[currentCardIndex]?._id?.toString() || '',
              });
            } else {
              showToast('Error', "Sorry! Can't find user", 'error');
            }
          }}
          onCloseModalClick={() => setItsMatchModalView(false)}
          setItsMatch={setItsMatchModalView}
        />
      </View>
    </GradientView>
  );
};

export default memo(CategoryDetailCardsScreen);
