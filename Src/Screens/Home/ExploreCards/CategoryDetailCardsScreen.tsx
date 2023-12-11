import React from 'react';
import {FlatList, View} from 'react-native';
import FakeUserCard from '../../../Components/Data/FakeUserCard';
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
          data={FakeUserCard}
          renderItem={({item, index}) => {
            console.log('item', item);
            return (
              <CategoryRenderCard
                item={item}
                index={index}
                // isCategory={false}
                // isLocation={true}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

export default CategoryDetailCardsScreen;
