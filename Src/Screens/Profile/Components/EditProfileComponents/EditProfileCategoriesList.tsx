import React, { FC, memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import CommonIcons from '../../../../Common/CommonIcons';
import { COLORS, FONTS, GROUP_FONT } from '../../../../Common/Theme';
import { useTheme } from '../../../../Contexts/ThemeContext';
import { GradientBorderView } from '../../../../Components/GradientBorder';

interface CategoriesListProps {
  Item: any[];
  onPress: () => void;
  EmptyTitleText: string;
}

const EditProfileCategoriesList: FC<CategoriesListProps> = ({ Item, onPress, EmptyTitleText }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.categoryContainerView}>
      <View style={styles.categoryView}>
        {Item && Item.length !== 0 ? (
          Item?.map?.((res, index) => {
            return (
              <GradientBorderView key={index} style={styles.singleCategoryView}>
                <Text style={[styles.categoryTextStyle, { color: colors.TextColor }]}>{res}</Text>
              </GradientBorderView>
            );
          })
        ) : (
          <View style={[styles.emptyCategoryView]}>
            <Text style={[styles.categoryTextStyle, { color: colors.Placeholder }]}>{EmptyTitleText}</Text>
          </View>
        )}
      </View>
      <Pressable
        onPress={onPress}
        style={[
          styles.rightIconView,
          { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(234, 234, 234, 1)' },
        ]}
        hitSlop={10}
      >
        <Image
          tintColor={colors.TextColor}
          resizeMode="contain"
          source={CommonIcons.RightArrow}
          style={styles.rightIcon}
        />
      </Pressable>
    </View>
  );
};
export default memo(EditProfileCategoriesList);

const styles = StyleSheet.create({
  categoryContainerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryTextStyle: {
    ...GROUP_FONT.body4,
    fontSize: 14,
    fontFamily: FONTS.Medium,
  },
  categoryView: {
    width: '85%',
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'row',
  },
  singleCategoryView: {
    padding: 8,
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  emptyCategoryView: {
    padding: 5,
    marginRight: 10,
    marginBottom: 10,
    paddingHorizontal: 13,
  },
  rightIconView: {
    width: 30,
    height: 30,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  rightIcon: {
    width: 13,
    height: 13,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
