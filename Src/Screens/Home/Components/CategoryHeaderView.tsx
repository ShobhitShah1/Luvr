import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { COLORS, FONTS, GROUP_FONT } from '../../../Common/Theme';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../../Contexts/ThemeContext';

interface CategoryHeaderViewProps {
  Title: string;
  Description: string;
}

const CategoryHeaderView: FC<CategoryHeaderViewProps> = ({ Title, Description }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.Container}>
      <Text style={[styles.TitleText, { color: colors.TextColor }]}>{Title}</Text>
      <Text style={[styles.DescriptionText, { color: colors.TextColor }]}>{Description}</Text>
    </View>
  );
};

export default CategoryHeaderView;

const styles = StyleSheet.create({
  Container: {
    justifyContent: 'center',
    marginBottom: hp('2%'),
    marginTop: hp('1%'),
  },
  TitleText: {
    color: COLORS.Black,
    fontSize: hp('2%'),
    fontFamily: FONTS.Bold,
  },
  DescriptionText: {
    ...GROUP_FONT.body2,
    fontSize: hp('1.8%'),
    color: COLORS.Black,
  },
});
