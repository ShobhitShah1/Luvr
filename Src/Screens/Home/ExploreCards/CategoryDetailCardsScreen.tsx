import React, {FC} from 'react';
import {FlatList, View} from 'react-native';
import FakeUserCard from '../../../Components/Data/FakeUserCard';
import CategoryDetailHeader from './Components/CategoryDetailHeader';
import CategoryRenderCard from './Components/CategoryRenderCard';
import styles from './styles';

interface CategoryDetailCardsProps {
  route: {
    params: {
      item: {
        id: number;
        title: string;
        image: any;
      };
    };
  };
}

const CategoryDetailCardsScreen: FC<CategoryDetailCardsProps> = ({route}) => {
  const {item} = route.params;
  return (
    <View style={styles.Container}>
      <CategoryDetailHeader item={item} />

      <View>
        <FlatList
          numColumns={2}
          style={styles.FlatListStyle}
          data={FakeUserCard}
          renderItem={({item, index}) => {
            return <CategoryRenderCard item={item} index={index} />;
          }}
        />
      </View>
    </View>
  );
};

export default CategoryDetailCardsScreen;
