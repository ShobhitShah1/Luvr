/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import NetInfo from '@react-native-community/netinfo';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { useTheme } from '../../Contexts/ThemeContext';
import UserService from '../../Services/AuthService';
import { LikeInterface } from '../../Types/Interface';
import { useCustomToast } from '../../Utils/toastUtils';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import LikesContent from './Components/LikesContent';
import MatchesContent from './Components/MatchesContent';
import styles from './styles';
import { BOTTOM_TAB_HEIGHT } from '../../Common/Theme';

type TabData = { title: string; index?: number };

const MyLikesScreen = () => {
  const { colors, isDark } = useTheme();
  const { showToast } = useCustomToast();

  const [selectedTabIndex, setSelectedTabIndex] = useState<TabData>({
    title: '',
    index: 0,
  });
  const [userLikesCount, setUserLikesCount] = useState<number>(0);
  const [userMatchesCount, setUserMatchesCount] = useState<number>(0);
  const [matchAndLikeData, setMatchAndLikeData] = useState<LikeInterface[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isAPILoading, setIsAPILoading] = useState(true);

  const RenderTopBarView = React.memo(({ item, onPress, isSelected }: any) => {
    return (
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={
          isSelected ? colors.ButtonGradient : !isDark ? [colors.White, colors.White] : ['transparent', 'transparent']
        }
        style={[
          styles.TabBarButtonView,
          { borderColor: isSelected ? 'transparent' : 'rgba(255, 255, 255, 0.2)', borderWidth: isSelected ? 0 : 0.5 },
        ]}
      >
        <Pressable key={item.index} onPress={onPress} style={{ flex: 1, justifyContent: 'center' }}>
          <Text
            style={[
              styles.TabBarButtonText,
              {
                color: isSelected ? (isDark ? colors.TextColor : colors.White) : 'rgba(130, 130, 130, 1)',
              },
            ]}
          >
            {item.title}
          </Text>
        </Pressable>
      </LinearGradient>
    );
  });

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
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={isDark ? colors.ButtonGradient : [colors.White, colors.White]}
          style={styles.NoLikeImageView}
        >
          <Image
            tintColor={isDark ? colors.White : colors.Primary}
            source={CommonIcons.NoLikes}
            style={styles.NoLikeImage}
          />
        </LinearGradient>
        <View style={styles.EmptyTextView}>
          <Text style={[styles.NoLikeTitle, { color: colors.TitleText }]}>
            No {selectedTabIndex.index === 0 ? 'Likes' : 'Matches'}
          </Text>
          <Text style={[styles.NoLikeDescription, { color: isDark ? 'rgba(255, 255, 255, 0.5)' : colors.TextColor }]}>
            You have no {selectedTabIndex.index === 0 ? 'Likes' : 'Matches'} right now, when someone{' '}
            {selectedTabIndex.index === 0 ? 'Likes' : 'Matches'} you they will appear here.
          </Text>
          <Pressable onPress={onRefresh} style={styles.RefreshButtonContainer}>
            <Image source={CommonIcons.sync} tintColor={colors.TextColor} style={styles.RefreshButtonIcon} />
            <Text style={[styles.RefreshButtonText, { color: colors.TextColor }]}>Refresh Page</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  useEffect(() => {
    setIsAPILoading(matchAndLikeData?.length === 0);
    fetchLikesAndMatchAPI();
  }, []);

  const fetchLikesAndMatchAPI = useCallback(async () => {
    const InInternetConnected = (await NetInfo.fetch()).isConnected;

    if (!InInternetConnected) {
      showToast(TextString.error.toUpperCase(), TextString.PleaseCheckYourInternetConnection, TextString.error);
      setIsAPILoading(false);
      return;
    }

    try {
      const userDataForApi = { eventName: 'likes_matchs' };
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
    ({ item }: { item: LikeInterface }) => {
      switch (selectedTabIndex.index) {
        case 0:
          return <LikesContent LikesData={item} />;
        case 1:
          return <MatchesContent LikesData={item} />;
        default:
          return null;
      }
    },
    [selectedTabIndex]
  );

  return (
    <GradientView>
      <View style={styles.container}>
        <BottomTabHeader showSetting={false} />
        <View style={styles.TopTabContainerView}>
          <FlatList
            numColumns={2}
            data={tabsData}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={styles.FlatListColumnWrapperStyle}
            contentContainerStyle={styles.FlatListContentContainerStyle}
            renderItem={({ item }) => (
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
              <ActivityIndicator size={35} color={colors.Primary} />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {(selectedTabIndex.index === 0 && userLikesCount > 0) ||
              (selectedTabIndex.index === 1 && userMatchesCount > 0) ? (
                <FlatList
                  data={matchAndLikeData}
                  nestedScrollEnabled
                  style={{ zIndex: 9999 }}
                  scrollEnabled
                  contentContainerStyle={{ paddingBottom: BOTTOM_TAB_HEIGHT }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      progressBackgroundColor={colors.White}
                      colors={[colors.Primary]}
                    />
                  }
                  initialNumToRender={20}
                  maxToRenderPerBatch={20}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <RenderContent item={item} />}
                />
              ) : (
                <ListEmptyLikeView />
              )}
            </View>
          )}
        </View>
      </View>

      {isDark && (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={
            isDark
              ? [
                  'rgba(13, 1, 38, 0)',
                  'rgba(13, 1, 38, 0.5)',
                  'rgba(13, 1, 38, 0.7)',
                  'rgba(13, 1, 38, 0.8)',
                  'rgba(13, 1, 38, 1)',
                ]
              : ['transparent', 'transparent']
          }
          style={styles.bottomShadow}
        />
      )}
    </GradientView>
  );
};

export default MyLikesScreen;
