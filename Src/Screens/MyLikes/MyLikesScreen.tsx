/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {ActiveOpacity, COLORS} from '../../Common/Theme';
import {FakeUserCard} from '../../Components/Data';
import BottomTabHeader from '../Home/Components/BottomTabHeader';
import LikesContent from './Components/LikesContent';
import TopPicksContent from './Components/TopPicksContent';
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

  const renderContent = useCallback(() => {
    switch (selectedTabIndex.index) {
      case 0:
        return <LikesContent LikesData={[]} />;
      case 1:
        return <TopPicksContent TopPickData={FakeUserCard} />;
      default:
        return null;
    }
  }, [selectedTabIndex.index]);

  return (
    <View style={styles.container}>
      <BottomTabHeader showSetting={false} />
      <View style={styles.ContentView}>
        <FlatList
          data={tabsData}
          numColumns={2}
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
        <View style={{marginVertical: 20}}>{renderContent()}</View>
      </View>
    </View>
  );
};

export default MyLikesScreen;
