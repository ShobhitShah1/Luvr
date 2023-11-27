import React, {FC, memo} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT} from '../../../../Common/Theme';

interface RenderCountryDataProps {
  data: any;
  index: number;
  onPress: (item: any, index: number) => void; // Add the onPress callback
}

const RenderCountryData: FC<RenderCountryDataProps> = ({
  data,
  index,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(data, index)}
      style={styles.CountryCodeContainerView}
      key={index}>
      <Text style={styles.ContactListNameText}>{data?.name}</Text>
      <Text style={styles.ContactListCodeText}>{data?.dialling_code}</Text>
    </TouchableOpacity>
  );
};

export default memo(RenderCountryData);

const styles = StyleSheet.create({
  CountryCodeContainerView: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: hp('0.5%'),
    justifyContent: 'space-between',
  },
  ContactListNameText: {
    width: '75%',
    ...GROUP_FONT.h4,
    color: COLORS.Black,
    fontFamily: FONTS.SemiBold,
  },
  ContactListCodeText: {
    width: '20%',
    ...GROUP_FONT.h4,
    color: COLORS.Black,
    fontFamily: FONTS.SemiBold,
  },
});
