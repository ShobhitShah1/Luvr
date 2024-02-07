/* eslint-disable react-native/no-inline-styles */
import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {ActiveOpacity, COLORS} from '../../Common/Theme';
import UserService from '../../Services/AuthService';
import {LikeAndMatchTypes} from '../../Types/SwiperCard';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import LikesContent from './Components/LikesContent';
import TopPicksContent from './Components/TopPicksContent';
import styles from './styles';
import MatchesContent from './Components/MatchesContent';

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
  const [MatchAndLikeData, setMatchAndLikeData] = useState([]);

  let totalLikes = 0;
  let totalMatches = 0;

  const isFocus = useIsFocused();

  // console.log('totalLikes', totalLikes);

  useEffect(() => {
    if (isFocus) {
      FetchLikesAndMatchAPI();
    }
  }, [isFocus]);

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

  const onPressTab = useCallback((item: any) => {
    setSelectedTabIndex(item);
  }, []);

  const RenderContent = useCallback(
    ({item, i}) => {
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

  const FetchLikesAndMatchAPI = async () => {
    try {
      const userDataForApi = {
        eventName: 'likes_matchs',
      };

      const APIResponse = await UserService.UserRegister(userDataForApi);
      if (APIResponse?.code === 200) {
        // console.log('APIResponse.data', APIResponse.data[0]?.user_details);
        setMatchAndLikeData(APIResponse.data);

        APIResponse.data.forEach((item: LikeAndMatchTypes) => {
          if (item.status === 'like') {
            // console.log(item.status);
            totalLikes++;
            setUserLikesCount(totalLikes || 0);
            // console.log('totalLikes:totalLikes', totalLikes);
          } else if (item.status === 'match') {
            totalMatches++;
            setUserMatchesCount(totalMatches);
          }
        });
      }
    } catch (error) {
      console.log('Something Went Wrong With Feting API Data', error);
      setMatchAndLikeData([]);
    } finally {
    }
  };

  return (
    <View style={styles.container}>
      <BottomTabHeader showSetting={false} />
      <View style={styles.ContentView}>
        <View
          style={{
            height: heightPercentageToDP(9),
            paddingTop: 14,
          }}>
          <FlatList
            data={tabsData}
            numColumns={2}
            style={{}}
            contentContainerStyle={{
              alignSelf: 'center',
              justifyContent: 'center',
            }}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              width: '90%',
              alignSelf: 'center',
            }}
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
        <View
          style={{
            flex: 1,
            paddingTop: 5,
          }}>
          <FlatList
            data={MatchAndLikeData}
            renderItem={({item, index}) => {
              return <RenderContent item={item} i={index} />;
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default MyLikesScreen;
