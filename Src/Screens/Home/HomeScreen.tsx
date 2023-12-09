import React from 'react';
import styles from './styles';
import {FlatList, ScrollView, View} from 'react-native';
import BottomTabHeader from './Components/BottomTabHeader';
import RenderlookingView from './Components/RenderlookingView';
import HomeLookingForData from '../../Components/Data/HomeData/HomeLookingForData';
import CategoryHeaderView from './Components/CategoryHeaderView';
import RenderForYou from './Components/RenderForYou';

const HomeScreen = () => {
  return (
    <View style={styles.Container}>
      <BottomTabHeader />

      <ScrollView bounces={false}>
        <FlatList
          numColumns={2}
          style={styles.FlatListStyle}
          data={HomeLookingForData}
          renderItem={({item, index}) => {
            return <RenderlookingView item={item} index={index} />;
          }}
          ListHeaderComponent={
            <CategoryHeaderView
              Title="Welcome to explore"
              Description="I’m looking for..."
            />
          }
        />
        <FlatList
          numColumns={2}
          style={styles.FlatListStyle}
          data={HomeLookingForData}
          keyExtractor={item => item.id.toString()}
          renderItem={({item, index}) => {
            return <RenderForYou item={item} index={index} />;
          }}
          ListHeaderComponent={
            <CategoryHeaderView
              Title="For you"
              Description="Based on your profile"
            />
          }
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
