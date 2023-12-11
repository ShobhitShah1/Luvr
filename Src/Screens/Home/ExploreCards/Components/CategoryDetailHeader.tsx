import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';
import {
  ActiveOpacity,
  COLORS,
  GROUP_FONT,
  SIZES,
} from '../../../../Common/Theme';

const CategoryDetailHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.Container}>
      <View style={styles.ContentView}>
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.BackIconView}>
          <Image
            resizeMode="contain"
            source={CommonIcons.TinderBack}
            style={styles.BackIcon}
          />
        </TouchableOpacity>
        <View style={styles.CategoryNameView}>
          <Text style={styles.CategoryNameText}>New friends</Text>
        </View>
        <View />
      </View>
    </View>
  );
};

export default CategoryDetailHeader;

const styles = StyleSheet.create({
  Container: {
    width: '100%',
    height: hp('8%'),
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
