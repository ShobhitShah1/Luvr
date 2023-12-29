import {useRoute} from '@react-navigation/native';
import React, {FC} from 'react';
import {FlatList, StatusBar, View} from 'react-native';
import {COLORS} from '../../../Common/Theme';
import FakeUserCard from '../../../Components/Data/FakeUserCard';
import CategoryDetailHeader from './Components/CategoryDetailHeader';
import CategoryRenderCard from './Components/CategoryRenderCard';
import styles from './styles';

interface CategoryDetailCardsProps {
  params: {
    item: {
      id: number;
      title: string;
      image: any;
    };
  };
}

const CategoryDetailCardsScreen: FC = () => {
  const {params} = useRoute<CategoryDetailCardsProps>();
  return (
    <View style={styles.Container}>
      <CategoryDetailHeader item={params?.item} />
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
