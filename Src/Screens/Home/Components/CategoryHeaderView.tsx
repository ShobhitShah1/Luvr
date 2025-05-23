import React from 'react';
import type { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import { useTheme } from '../../../Contexts/ThemeContext';

interface CategoryHeaderViewProps {
  title: string;
  description: string;
  style?: ViewStyle | ViewStyle[];
}

const CategoryHeaderView: FC<CategoryHeaderViewProps> = ({ title, description, style }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style && style]}>
      <Text style={[styles.titleText, { color: colors.TextColor }]}>{title}</Text>
      <Text style={[styles.descriptionText, { color: colors.TextColor }]}>{description}</Text>
    </View>
  );
};

export default CategoryHeaderView;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginBottom: hp('1%'),
    marginTop: hp('1.5%'),
  },
  descriptionText: {
    ...GROUP_FONT.body2,
    color: COLORS.Black,
    fontSize: hp('1.8%'),
  },
  titleText: {
    color: COLORS.Black,
    fontFamily: FONTS.Bold,
    fontSize: hp('2%'),
  },
});
