import React, { memo } from 'react';
import type { FC } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import CommonIcons from '../../../../Common/CommonIcons';
import { COLORS, FONTS, GROUP_FONT } from '../../../../Common/Theme';
import { GradientBorderView } from '../../../../Components/GradientBorder';
import { useTheme } from '../../../../Contexts/ThemeContext';

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
          <View style={styles.emptyCategoryView}>
            <Text style={[styles.categoryTextStyle, { color: colors.Placeholder }]}>
              {EmptyTitleText}
            </Text>
          </View>
        )}
      </View>
      <Pressable
        onPress={onPress}
        style={[
          styles.rightIconView,
          { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(234, 234, 234, 1)' },
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
    fontFamily: FONTS.Medium,
    fontSize: 14,
  },
  categoryView: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '85%',
  },
  emptyCategoryView: {
    marginBottom: 10,
    marginRight: 10,
    padding: 5,
    paddingHorizontal: 13,
  },
  rightIcon: {
    alignSelf: 'center',
    height: 13,
    justifyContent: 'center',
    width: 13,
  },
  rightIconView: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 100,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  singleCategoryView: {
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 10,
    marginRight: 10,
    padding: 8,
  },
});
