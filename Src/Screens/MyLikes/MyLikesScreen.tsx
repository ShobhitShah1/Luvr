/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {ActiveOpacity, COLORS} from '../../Common/Theme';
import {FakeUserCard} from '../../Components/Data';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import LikesContent from './Components/LikesContent';
import TopPicksContent from './Components/TopPicksContent';
import styles from './styles';
import UserService from '../../Services/AuthService';

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
  const [MatchAndLikeData, setMatchAndLikeData] = useState([]);

  useEffect(() => {
    FetchLikesAndMatchAPI();
  }, []);

  const tabsData: TabData[] = [
    {
      title: userLikesCount > 0 ? `Likes: ${userLikesCount}` : 'Likes',
      index: 0,
    },
    {title: 'Top Picks', index: 1},
  ];

  const onPressTab = useCallback((item: any) => {
    setSelectedTabIndex(item);
  }, []);

  const RenderContent = useCallback(
    ({item, i}) => {
      // console.log('item', item);
      switch (selectedTabIndex.index) {
        case 0:
          return <LikesContent LikesData={item} />;
        case 1:
          return <TopPicksContent TopPickData={item} />;
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
        setMatchAndLikeData(APIResponse.data);
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
        <View style={{flex: 0.1, top: 10}}>
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
              width: '85%',
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
        <View style={{flex: 0.9}}>
          <FlatList
            data={MatchAndLikeData}
            renderItem={({item, index}) => {
              return <RenderContent item={item} i={index} />;
            }}
          />
        </View>
        {/* <View style={{marginVertical: 20}}>{RenderContent()}</View> */}
      </View>
    </View>
  );
};

export default MyLikesScreen;
