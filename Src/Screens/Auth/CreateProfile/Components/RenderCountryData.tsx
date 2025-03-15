import React, { FC, memo } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS, FONTS, GROUP_FONT } from '../../../../Common/Theme';
import { useTheme } from '../../../../Contexts/ThemeContext';

interface RenderCountryDataProps {
  data: any;
  index: number;
  onPress: (item: any, index: number) => void;
}

const RenderCountryData: FC<RenderCountryDataProps> = ({ data, index, onPress }) => {
  const { colors } = useTheme();
  return (
    <Pressable onPress={() => onPress(data, index)} style={styles.countryCodeContainerView} key={index}>
      <Text style={[styles.contactListNameText, { color: colors.TextColor }]}>{data?.name}</Text>
      <Text style={[styles.contactListCodeText, { color: colors.TextColor }]}>{data?.dialling_code}</Text>
    </Pressable>
  );
};

export default memo(RenderCountryData);

const styles = StyleSheet.create({
  countryCodeContainerView: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: hp('0.8%'),
    justifyContent: 'space-between',
  },
  contactListNameText: {
    width: '75%',
    // ...GROUP_FONT.h4,
    fontSize: 15,
    fontFamily: FONTS.SemiBold,
  },
  contactListCodeText: {
    width: '20%',
    fontSize: 15,
    fontFamily: FONTS.SemiBold,
  },
});
