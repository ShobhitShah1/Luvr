/* eslint-disable react-hooks/exhaustive-deps */

import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useReducer, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import GradientView from '../../Common/GradientView';
import TextString from '../../Common/TextString';
import { BOTTOM_TAB_HEIGHT, FONTS } from '../../Common/Theme';
import SubscriptionView from '../../Components/Subscription/SubscriptionView';
import { useTheme } from '../../Contexts/ThemeContext';
import { useUserData } from '../../Contexts/UserDataContext';
import UserService from '../../Services/AuthService';
import { getDetailedSubscriptionStatus } from '../../Services/SubscriptionService';
import type { ListDetailProps, MyLikeScreenListProps } from '../../Types/Interface';
import { useCustomToast } from '../../Utils/toastUtils';
import BottomTabHeader from '../Home/Components/BottomTabHeader';

import LikesContent from './Components/LikesContent';
import ListEmptyView from './Components/ListEmptyView';
import MatchesContent from './Components/MatchesContent';
import { RenderLikeScreenTopBar } from './Components/RenderLikeScreenTopBar';
import styles from './styles';

export type TabData = { title: string; index?: number; count?: number };

interface LikeStateProps {
  like: number;
  match: number;
  crush: number;
}

interface State {
  selectedTab: TabData;
  likesCount: LikeStateProps;
  likesData: MyLikeScreenListProps;
  refreshing: boolean;
  isLoading: boolean;
  selectedPlan: string;
}

type Action =
  | { type: 'SET_SELECTED_TAB'; payload: TabData }
  | { type: 'SET_LIKES_COUNT'; payload: LikeStateProps }
  | { type: 'SET_LIKES_DATA'; payload: MyLikeScreenListProps }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SELECTED_PLAN'; payload: string }
  | { type: 'RESET_STATE' };

const initialState: State = {
  selectedTab: { title: '', index: 0 },
  likesCount: { like: 0, match: 0, crush: 0 },
  likesData: { crush: [], like: [], match: [] },
  refreshing: false,
  isLoading: true,
  selectedPlan: 'com.luvr.gold.monthly',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SELECTED_TAB':
      return { ...state, selectedTab: action.payload };
    case 'SET_LIKES_COUNT':
      return { ...state, likesCount: action.payload };
    case 'SET_LIKES_DATA':
      return { ...state, likesData: action.payload };
    case 'SET_REFRESHING':
      return { ...state, refreshing: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SELECTED_PLAN':
      return { ...state, selectedPlan: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

function MyLikesScreen() {
  // const [sub, setSub] = useState<any>(null);
  const { colors, isDark } = useTheme();
  const { showToast } = useCustomToast();
  const { subscription } = useUserData();
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [showSubModal, setShowSubModal] = useState(false);

  const { selectedTab, likesCount, likesData, refreshing, isLoading, selectedPlan } = state;

  // useEffect(() => {
  //   let isMounted = true;
  //   getDetailedSubscriptionStatus().then((result) => {
  //     if (isMounted) setSub(result);
  //   });
  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      const selectedTabData =
        selectedTab.index === 0
          ? likesData.like
          : selectedTab.index === 1
          ? likesData.match
          : likesData.crush;

      const shouldShowLoader = selectedTabData.length === 0;

      dispatch({ type: 'SET_LOADING', payload: shouldShowLoader });
      fetchLikesAndMatchAPI();
    }, [selectedTab.index]),
  );

  const tabsData: TabData[] = [
    { title: 'Likes', index: 0, count: likesCount?.like },
    { title: 'Matches', index: 1, count: likesCount?.match },
    { title: 'Crush', index: 2, count: likesCount?.crush },
  ];

  const fetchLikesAndMatchAPI = useCallback(async () => {
    const inInternet = (await NetInfo.fetch()).isConnected;

    if (!inInternet) {
      showToast(
        TextString.error.toUpperCase(),
        TextString.PleaseCheckYourInternetConnection,
        TextString.error,
      );

      dispatch({ type: 'SET_LOADING', payload: false });

      return;
    }

    try {
      const APIResponse = await UserService.UserRegister({ eventName: 'likes_matchs' });

      if (APIResponse?.code === 200) {
        const { data } = APIResponse;
        const { like = [], match = [], crush = [] } = data;

        const filteredLike = like?.filter((item: any) => item?.user_details?.length > 0) || [];
        const filteredMatch = match?.filter((item: any) => item?.user_details?.length > 0) || [];
        const filteredCrush = crush?.filter((item: any) => item?.user_details?.length > 0) || [];

        dispatch({
          type: 'SET_LIKES_COUNT',
          payload: {
            like: filteredLike.length,
            match: filteredMatch.length,
            crush: filteredCrush.length,
          },
        });

        dispatch({
          type: 'SET_LIKES_DATA',
          payload: { crush: filteredCrush, like: filteredLike, match: filteredMatch },
        });
      }
    } catch (error: any) {
      showToast('Error', String(error?.message || error), 'error');
    } finally {
      dispatch({ type: 'SET_REFRESHING', payload: false });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const onPressTab = useCallback((item: TabData) => {
    dispatch({ type: 'SET_SELECTED_TAB', payload: item });
  }, []);

  const onRefresh = useCallback(() => {
    dispatch({ type: 'SET_REFRESHING', payload: true });
    fetchLikesAndMatchAPI();
  }, []);

  const RenderContent = useCallback(
    ({ item }: { item: ListDetailProps }) => {
      switch (selectedTab.index) {
        case 0:
          return <LikesContent LikesData={item} />;
        case 1:
          return <MatchesContent MatchData={item} />;
        case 2:
          return <LikesContent LikesData={item} />;
        default:
          return null;
      }
    },
    [selectedTab.index],
  );

  return (
    <GradientView>
      <View style={styles.container}>
        <BottomTabHeader showSetting={false} />
        <View style={styles.TopTabContainerView}>
          <View style={styles.FlatListContentContainerStyle}>
            {tabsData.map((item, index) => (
              <RenderLikeScreenTopBar
                key={index}
                item={item}
                onPress={() => onPressTab(item)}
                isSelected={item.index === selectedTab.index}
                tabsData={tabsData}
              />
            ))}
          </View>
        </View>

        <View style={styles.ContentContainer}>
          {isLoading ? (
            <View style={styles.LoadingView}>
              <ActivityIndicator size={35} color={colors.Primary} />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {selectedTab.index === 2 && !subscription.isActive ? (
                <View style={{ flex: 1, marginTop: 35 }}>
                  <SubscriptionView
                    selectedPlan={selectedPlan}
                    handlePlanSelection={plan =>
                      dispatch({ type: 'SET_SELECTED_PLAN', payload: plan })
                    }
                  />
                </View>
              ) : (
                <FlatList
                  data={
                    likesData[
                      selectedTab.index === 0 ? 'like' : selectedTab.index === 1 ? 'match' : 'crush'
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
                  initialNumToRender={80}
                  maxToRenderPerBatch={80}
                  ListEmptyComponent={
                    <ListEmptyView
                      selectedTabIndex={selectedTab.index || 0}
                      onRefresh={onRefresh}
                    />
                  }
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <RenderContent item={item} />}
                />
              )}
            </View>
          )}
        </View>
      </View>

      {/* {sub && (
        <Pressable
          style={{
            position: 'absolute',
            bottom: 100,
            right: 20,
            backgroundColor: colors.Primary,
            padding: 10,
            borderRadius: 8,
          }}
          onPress={() => setShowSubModal(true)}
        >
          <Text style={{ color: '#fff', fontFamily: FONTS.SemiBold }}>Show Subscription Debug</Text>
        </Pressable>
      )}

      <Modal visible={showSubModal} transparent animationType="slide" onRequestClose={() => setShowSubModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.Primary, borderRadius: 12, padding: 24, width: '85%' }}>
            <Text style={{ fontSize: 18, fontFamily: FONTS.Bold, marginBottom: 12, color: colors.TitleText }}>
              Subscription Details
            </Text>
            {sub &&
              Object.entries(sub).map(([key, value]) => (
                <Text key={key} style={{ fontSize: 15, marginBottom: 6, color: colors.TitleText }}>
                  <Text style={{ fontFamily: FONTS.SemiBold }}>{key}:</Text> {String(value)}
                </Text>
              ))}
            <Pressable style={{ marginTop: 18, alignSelf: 'flex-end' }} onPress={() => setShowSubModal(false)}>
              <Text style={{ color: colors.TextColor, fontFamily: FONTS.Bold }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}

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
}

export default memo(MyLikesScreen);
