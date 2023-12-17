/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {FlatList, ImageBackground, ScrollView, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../Common/Theme';
import HomeLookingForData from '../../Components/Data/HomeData/HomeLookingForData';
import BottomTabHeader from './Components/BottomTabHeader';
import CategoryHeaderView from './Components/CategoryHeaderView';
import RenderlookingView from './Components/RenderlookingView';
import styles from './styles';

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
          style={[styles.FlatListStyle]}
          data={HomeLookingForData}
          keyExtractor={item => item.id.toString()}
          renderItem={({item, index}) => {
            const numColumns = index % 3 === 0 ? 1 : 2;

            return (
              <View
                style={[
                  styles.container,
                  {width: numColumns === 1 ? '100%' : '47%'},
                ]}>
                <ImageBackground
                  source={item.image}
                  resizeMode="cover"
                  style={styles.imageView}
                  imageStyle={styles.imageStyle}>
                  <LinearGradient
                    colors={COLORS.GradientViewForCards}
                    locations={[0, 1]}
                    style={styles.gradient}>
                    <Text style={styles.TitleText}>{item.title}</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
            );
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
