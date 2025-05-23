import React, { memo } from 'react';
import type { FC } from 'react';
import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CommonIcons from '../../../../Common/CommonIcons';
import { COLORS, GROUP_FONT, SIZES } from '../../../../Common/Theme';
import { useTheme } from '../../../../Contexts/ThemeContext';
import { useCustomNavigation } from '../../../../Hooks/useCustomNavigation';

interface CategoryHeaderProps {
  item: { id: number; title: string; image: any };
}

const CategoryDetailHeader: FC<CategoryHeaderProps> = ({ item }) => {
  const { colors } = useTheme();
  const navigation = useCustomNavigation();

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.ContentView}>
        <Pressable
          onPress={() => navigation?.canGoBack() && navigation.goBack()}
          style={styles.BackIconView}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            resizeMode="contain"
            tintColor={colors.TextColor}
            source={CommonIcons.TinderBack}
            style={styles.BackIcon}
          />
        </Pressable>
        <View style={styles.CategoryNameView}>
          <Text style={[styles.CategoryNameText, { color: colors.Black }]}>{item.title}</Text>
        </View>
        <View />
      </View>
    </SafeAreaView>
  );
};

export default memo(CategoryDetailHeader);

const styles = StyleSheet.create({
  BackIcon: {
    height: hp('3.5%'),
    width: hp('3.5%'),
  },
  BackIconView: {
    justifyContent: 'center',
  },
  CategoryNameText: {
    ...GROUP_FONT.h3,
  },
  CategoryNameView: {
    backgroundColor: COLORS.White,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    padding: hp('1.2%'),
    paddingHorizontal: hp('1.9%'),
    right: hp('1%'),
  },
  Container: {
    height: Platform.OS === 'ios' ? hp('12.5%') : hp('8%'),
    justifyContent: 'center',
    width: '100%',
  },
  ContentView: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
});
