import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import React, { FC } from 'react';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
  titleText: {
    color: COLORS.Black,
    fontSize: hp('2%'),
    fontFamily: FONTS.Bold,
  },
  descriptionText: {
    ...GROUP_FONT.body2,
    fontSize: hp('1.8%'),
    color: COLORS.Black,
  },
});
