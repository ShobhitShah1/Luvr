/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import NetInfo from '@react-native-community/netinfo';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Image, Pressable, RefreshControl, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CommonIcons from '../../Common/CommonIcons';
import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { BOTTOM_TAB_HEIGHT } from '../../Common/Theme';
import SubscriptionView from '../../Components/Subscription/SubscriptionView';
import { useTheme } from '../../Contexts/ThemeContext';
import UserService from '../../Services/AuthService';
import { LikeMatchAndCrushAPIDataTypes, ListDetailProps } from '../../Types/Interface';
import { useCustomToast } from '../../Utils/toastUtils';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import LikesContent from './Components/LikesContent';
import MatchesContent from './Components/MatchesContent';
import styles from './styles';
import { useUserData } from '../../Contexts/UserDataContext';
import { cancelSubscription } from '../../Services/SubscriptionService';

type TabData = { title: string; index?: number };

type RenderTopBarViewProps = {
  item: TabData;
  onPress: () => void;
  isSelected: boolean;
};

interface LikeStateProps {
  like: number;
  match: number;
  crush: number;
}

const MyLikesScreen = () => {
  const { colors, isDark } = useTheme();
  const { showToast } = useCustomToast();
  const { subscription } = useUserData();

  const [selectedTabIndex, setSelectedTabIndex] = useState<TabData>({
    title: '',
    index: 0,
  });

  const [matchAndLikeCount, setMatchAndLikeCount] = useState<LikeStateProps>({
    like: 0,
    match: 0,
    crush: 0,
  });

  const [matchLikeAndCrushData, setMatchLikeAndCrushData] = useState<LikeMatchAndCrushAPIDataTypes>({
    crush: [],
    like: [],
    match: [],
  });

  const [refreshing, setRefreshing] = useState(false);
  const [isAPILoading, setIsAPILoading] = useState(true);

  const [selectedPlan, setSelectedPlan] = useState('com.luvr.gold.monthly');

  const RenderTopBarView = React.memo(({ item, onPress, isSelected }: RenderTopBarViewProps) => {
    return (
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={
          isSelected ? colors.ButtonGradient : !isDark ? [colors.White, colors.White] : ['transparent', 'transparent']
        }
        style={[
          styles.TabBarButtonView,
          {
            width: `${100 / tabsData?.length - 2}%`,
            borderColor: isSelected ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
            borderWidth: isSelected ? 0 : 0.5,
          },
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
      title: matchAndLikeCount?.like > 0 ? `Likes: ${matchAndLikeCount?.like}` : 'Likes',
      index: 0,
    },
    {
      title: matchAndLikeCount?.match > 0 ? `Matches: ${matchAndLikeCount?.match}` : 'Matches',
      index: 1,
    },
    {
      title: matchAndLikeCount?.crush > 0 ? `Crush: ${matchAndLikeCount?.crush}` : 'Crush',
      index: 2,
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
    // setIsAPILoading(matchAndLikeData?.length === 0);
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

        setMatchAndLikeCount({
          like: data.like.length,
          match: data.match.length,
          crush: data.crush.length,
        });

        setMatchLikeAndCrushData({
          crush: data.crush,
          like: data.like,
          match: data.match,
        });
      }
    } catch (error: any) {
      showToast('Error', String(error?.message || error), 'error');
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
    ({ item }: { item: ListDetailProps }) => {
      switch (selectedTabIndex.index) {
        case 0:
          return <LikesContent LikesData={item} />;
        case 1:
          return <MatchesContent MatchData={item} />;
        case 2:
          return <LikesContent LikesData={item} />;

        default:
          return;
      }
    },
    [selectedTabIndex, selectedPlan, setSelectedPlan]
  );

  console.log('subscription:', subscription?.data?._id, subscription?.isActive);

  return (
    <GradientView>
      <View style={styles.container}>
        {subscription.isActive && (
          <Button
            title="Cancel"
            onPress={() => subscription?.data?._id && cancelSubscription(subscription?.data?._id)}
          />
        )}

        <BottomTabHeader showSetting={false} />
        <View style={styles.TopTabContainerView}>
          <View style={styles.FlatListContentContainerStyle}>
            {tabsData.map((item, index) => (
              <RenderTopBarView
                key={index}
                item={item}
                onPress={() => onPressTab(item)}
                isSelected={item.index === selectedTabIndex.index}
              />
            ))}
          </View>
        </View>

        <View style={styles.ContentContainer}>
          {isAPILoading ? (
            <View style={styles.LoadingView}>
              <ActivityIndicator size={35} color={colors.Primary} />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {selectedTabIndex.index === 2 && !subscription.isActive ? (
                <View style={{ flex: 1, marginTop: 30 }}>
                  <SubscriptionView selectedPlan={selectedPlan} handlePlanSelection={setSelectedPlan} />
                </View>
              ) : (
                <FlatList
                  data={
                    matchLikeAndCrushData[
                      selectedTabIndex.index === 0 ? 'like' : selectedTabIndex.index === 1 ? 'match' : 'crush'
                    ]
                  }
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
                  initialNumToRender={50}
                  maxToRenderPerBatch={50}
                  ListEmptyComponent={<ListEmptyLikeView />}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <RenderContent item={item} />}
                />
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
