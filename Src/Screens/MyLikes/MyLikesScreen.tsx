/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import NetInfo from '@react-native-community/netinfo';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonIcons from '../../Common/CommonIcons';
import TextString from '../../Common/TextString';
import {ActiveOpacity, COLORS} from '../../Common/Theme';
import UserService from '../../Services/AuthService';
import {LikeInterface} from '../../Types/Interface';
import {useCustomToast} from '../../Utils/toastUtils';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import LikesContent from './Components/LikesContent';
import MatchesContent from './Components/MatchesContent';
import styles from './styles';

type TabData = {title: string; index?: number};

const RenderTopBarView = React.memo(({item, onPress, isSelected}: any) => {
  return (
    <TouchableOpacity
      key={item.index}
      activeOpacity={ActiveOpacity}
      onPress={onPress}
      style={[
        styles.TabBarButtonView,
        {
          backgroundColor: isSelected ? COLORS.Primary : COLORS.White,
          borderColor: isSelected ? COLORS.White : 'transparent',
        },
      ]}>
      <Text
        style={[
          styles.TabBarButtonText,
          {
            color: isSelected ? COLORS.White : 'rgba(130, 130, 130, 1)',
          },
        ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
});

const MyLikesScreen = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<TabData>({
    title: '',
    index: 0,
  });
  const [userLikesCount, setUserLikesCount] = useState<number>(0);
  const [userMatchesCount, setUserMatchesCount] = useState<number>(0);
  const [matchAndLikeData, setMatchAndLikeData] = useState<LikeInterface[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isAPILoading, setIsAPILoading] = useState(true);
  const {showToast} = useCustomToast();

  const tabsData: TabData[] = [
    {
      title: userLikesCount > 0 ? `Likes: ${userLikesCount}` : 'Likes',
      index: 0,
    },
    {
      title: userMatchesCount > 0 ? `Matches: ${userMatchesCount}` : 'Matches',
      index: 1,
    },
  ];

  const ListEmptyLikeView = () => {
    return (
      <View style={styles.ListEmptyComponentView}>
        <View style={styles.NoLikeImageView}>
          <Image source={CommonIcons.NoLikes} style={styles.NoLikeImage} />
        </View>
        <View style={styles.EmptyTextView}>
          <Text style={styles.NoLikeTitle}>
            No {selectedTabIndex.index === 0 ? 'Likes' : 'Matches'}
          </Text>
          <Text style={styles.NoLikeDescription}>
            You have no {selectedTabIndex.index === 0 ? 'Likes' : 'Matches'}{' '}
            right now, when someone{' '}
            {selectedTabIndex.index === 0 ? 'Likes' : 'Matches'} you they will
            appear here.
          </Text>
          <TouchableOpacity
            activeOpacity={ActiveOpacity}
            onPress={onRefresh}
            style={styles.RefreshButtonContainer}>
            <Image
              source={CommonIcons.sync}
              tintColor={COLORS.Primary}
              style={styles.RefreshButtonIcon}
            />
            <Text style={styles.RefreshButtonText}>Refresh Page</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  useEffect(() => {
    setIsAPILoading(true);
    fetchLikesAndMatchAPI();
  }, []);

  const fetchLikesAndMatchAPI = useCallback(async () => {
    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );
      setIsAPILoading(false);
      return;
    }

    try {
      const userDataForApi = {eventName: 'likes_matchs'};
      const APIResponse = await UserService.UserRegister(userDataForApi);

      if (APIResponse?.code === 200) {
        const data = APIResponse.data;
        let combinedData = [...data.like, ...data.match];
        setUserLikesCount(data.like.length);
        setUserMatchesCount(data.match.length);
        setMatchAndLikeData(combinedData);
      }
    } catch (error: any) {
      showToast('Error', String(error?.message || error), 'error');
      setMatchAndLikeData([]);
    } finally {
      setRefreshing(false);
      setIsAPILoading(false);
    }
  }, []);

  const onPressTab = useCallback((item: TabData) => {
    setSelectedTabIndex(item);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLikesAndMatchAPI();
  }, []);

  const RenderContent = useCallback(
    ({item}: {item: LikeInterface}) => {
      switch (selectedTabIndex.index) {
        case 0:
          return <LikesContent LikesData={item} />;
        case 1:
          return <MatchesContent LikesData={item} />;
        default:
          return null;
      }
    },
    [selectedTabIndex],
  );

  return (
    <View style={styles.container}>
      <BottomTabHeader showSetting={false} />
      <View style={styles.TopTabContainerView}>
        <FlatList
          numColumns={2}
          data={tabsData}
          keyExtractor={(item, index) => index.toString()}
          columnWrapperStyle={styles.FlatListColumnWrapperStyle}
          contentContainerStyle={styles.FlatListContentContainerStyle}
          renderItem={({item}) => (
            <RenderTopBarView
              item={item}
              onPress={() => onPressTab(item)}
              isSelected={item.index === selectedTabIndex.index}
            />
          )}
        />
      </View>
      <View style={styles.ContentContainer}>
        {isAPILoading ? (
          <View style={styles.LoadingView}>
            <ActivityIndicator size={35} color={COLORS.Primary} />
          </View>
        ) : (
          <View style={{flex: 1}}>
            {(selectedTabIndex.index === 0 && userLikesCount > 0) ||
            (selectedTabIndex.index === 1 && userMatchesCount > 0) ? (
              <FlatList
                data={matchAndLikeData}
                nestedScrollEnabled
                style={{zIndex: 9999}}
                scrollEnabled
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    progressBackgroundColor={COLORS.White}
                    colors={[COLORS.Primary]}
                  />
                }
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => <RenderContent item={item} />}
              />
            ) : (
              <ListEmptyLikeView />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default MyLikesScreen;
