import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import { COLORS, GROUP_FONT, SIZES } from '../../../../Common/Theme';
import { useTheme } from '../../../../Contexts/ThemeContext';

interface CategoryHeaderProps {
  item: {
    id: number;
    title: string;
    image: any;
  };
}

const CategoryDetailHeader: FC<CategoryHeaderProps> = ({ item }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.ContentView}>
        <Pressable onPress={() => navigation?.canGoBack() && navigation.goBack()} style={styles.BackIconView}>
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

export default CategoryDetailHeader;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    height: Platform.OS === 'ios' ? hp('12.5%') : hp('8%'),
    justifyContent: 'center',
  },
  ContentView: {
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  BackIconView: {
    justifyContent: 'center',
  },
  BackIcon: {
    width: hp('3.5%'),
    height: hp('3.5%'),
  },
  CategoryNameView: {
    justifyContent: 'center',
    padding: hp('1.2%'),
    right: hp('1%'),
    paddingHorizontal: hp('1.9%'),
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.White,
  },
  CategoryNameText: {
    ...GROUP_FONT.h3,
  },
});
