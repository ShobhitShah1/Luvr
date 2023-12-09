import React from 'react';
import {FlatList, View} from 'react-native';
import HomeLookingForData from '../../../Components/Data/HomeData/HomeLookingForData';
import CategoryDetailHeader from './Components/CategoryDetailHeader';
import CategoryRenderCard from './Components/CategoryRenderCard';
import styles from './styles';

const CategoryDetailCardsScreen = () => {
  return (
    <View style={styles.Container}>
      <CategoryDetailHeader />

      <View>
        <FlatList
          numColumns={2}
          style={styles.FlatListStyle}
          data={HomeLookingForData}
          renderItem={({item, index}) => {
            return <CategoryRenderCard item={item} index={index} isCategory={false} isLocation={true} />;
          }}
        />
      </View>
    </View>
  );
};

export default CategoryDetailCardsScreen;
