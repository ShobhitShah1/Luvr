/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
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
import {ActiveOpacity, COLORS, FONTS} from '../../Common/Theme';
import UserService from '../../Services/AuthService';
import {LikeAndMatchTypes} from '../../Types/SwiperCard';
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
  const [matchAndLikeData, setMatchAndLikeData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isAPILoading, setIsAPILoading] = useState(false);

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
    // if (isFocus) {
    setIsAPILoading(true);
    fetchLikesAndMatchAPI();
    // }
  }, []);

  const fetchLikesAndMatchAPI = useCallback(async () => {
    try {
      const userDataForApi = {eventName: 'likes_matchs'};
      const APIResponse = await UserService.UserRegister(userDataForApi);

      if (APIResponse?.code === 200) {
        console.log('APIResponse.data', APIResponse.data);
        const data = APIResponse.data;
        let likesCount = 0;
        let matchesCount = 0;

        data.forEach((item: LikeAndMatchTypes) => {
          if (item.status === 'like') {
            likesCount++;
          } else if (item.status === 'match') {
            matchesCount++;
          }
        });

        setUserLikesCount(likesCount);
        setUserMatchesCount(matchesCount);
        setMatchAndLikeData(data);
      }
    } catch (error) {
      console.log('Error fetching API data:', error);
      setMatchAndLikeData([]);
    } finally {
      setRefreshing(false);
      setIsAPILoading(false);
    }
  }, []);

  const onPressTab = useCallback((item: TabData) => {
    setSelectedTabIndex(item);
    console.log(item.index, selectedTabIndex.index);
    // if (item.index !== selectedTabIndex.index) {
    //   fetchLikesAndMatchAPI();
    // }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLikesAndMatchAPI();
  }, []);

  const RenderContent = useCallback(
    ({item, index}) => {
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
      {/* <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{flex: 1}}
        removeClippedSubviews
        nestedScrollEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.ContentView}> */}
      <View style={styles.TopTabContainerView}>
        <FlatList
          data={tabsData}
          numColumns={2}
          contentContainerStyle={styles.FlatListContentContainerStyle}
          columnWrapperStyle={styles.FlatListColumnWrapperStyle}
          renderItem={({item}) => (
            <RenderTopBarView
              item={item}
              onPress={() => onPressTab(item)}
              isSelected={item.index === selectedTabIndex.index}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
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
                  />
                }
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                removeClippedSubviews
                renderItem={({item, index}) => (
                  <RenderContent item={item} index={index} />
                )}
              />
            ) : (
              <ListEmptyLikeView />
            )}
          </View>
        )}
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

export default MyLikesScreen;
