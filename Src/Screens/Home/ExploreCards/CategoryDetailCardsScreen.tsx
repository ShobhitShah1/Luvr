import React, {FC} from 'react';
import {FlatList, StatusBar, View} from 'react-native';
import FakeUserCard from '../../../Components/Data/FakeUserCard';
import CategoryDetailHeader from './Components/CategoryDetailHeader';
import CategoryRenderCard from './Components/CategoryRenderCard';
import styles from './styles';
import { COLORS } from '../../../Common/Theme';

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
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.Secondary} />

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
