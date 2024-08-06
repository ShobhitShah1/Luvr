import React, {FC, memo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CommonIcons from '../../../../Common/CommonIcons';
import {
  ActiveOpacity,
  COLORS,
  FONTS,
  GROUP_FONT,
} from '../../../../Common/Theme';

interface CategoriesListProps {
  Item: any[];
  onPress: () => void;
  EmptyTitleText: string;
}

const EditProfileCategoriesList: FC<CategoriesListProps> = ({
  Item,
  onPress,
  EmptyTitleText,
}) => {
  return (
    <View style={styles.CategoryContainerView}>
      <View style={styles.CategoryView}>
        {Item.length !== 0 ? (
          Item?.map((res, index) => {
            return (
              <View key={index} style={styles.SingleCategoryView}>
                <Text style={styles.CategoryTextStyle}>{res}</Text>
              </View>
            );
          })
        ) : (
          <View style={[styles.EmptyCategoryView]}>
            <Text style={styles.CategoryTextStyle}>{EmptyTitleText}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={onPress}
        style={styles.RightIconView}>
        <Image
          resizeMode="contain"
          source={CommonIcons.RightArrow}
          style={styles.RightIcon}
        />
      </TouchableOpacity>
    </View>
  );
};
export default memo(EditProfileCategoriesList);

const styles = StyleSheet.create({
  CategoryContainerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  CategoryTextStyle: {
    ...GROUP_FONT.body4,
    fontSize: 14,
    color: COLORS.Black,
    fontFamily: FONTS.Medium,
  },
  CategoryView: {
    width: '85%',
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'row',
  },
  SingleCategoryView: {
    padding: 5,
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 15,
    marginBottom: 10,
    paddingHorizontal: 13,
    borderColor: COLORS.Black,
  },
  EmptyCategoryView: {
    padding: 5,
    // borderWidth: 1,
    marginRight: 10,
    // borderRadius: 15,
    marginBottom: 10,
    paddingHorizontal: 13,
    // borderColor: COLORS.Black,
  },
  RightIconView: {
    width: 35,
    height: 35,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(234, 234, 234, 1)',
  },
  RightIcon: {
    width: 15,
    height: 15,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
