import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ActiveOpacity, COLORS, GROUP_FONT} from '../../../../Common/Theme';
import CustomTextInput from '../../../../Components/CustomTextInput';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

interface GenderSearchProps {
  setSearchText: any;
  SearchText: string;
}

const AllGendersHeader: FC<GenderSearchProps> = ({
  setSearchText,
  SearchText,
}) => {
  const onChangeText = (value: string) => {
    setSearchText(value);
  };
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  return (
    <View style={styles.SearchHeaderContainer}>
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" color={COLORS.Primary} size={wp('6.5%')} />
      </TouchableOpacity>

      <View style={styles.SearchContainer}>
        <View style={styles.SearchIconContainerStyle}>
          <Ionicons
            name="search-outline"
            color={COLORS.Gray}
            size={wp('5%')}
            style={styles.SearchIconStyle}
          />
        </View>
        <View style={styles.TextInputContainerStyle}>
          <CustomTextInput
            value={SearchText}
            placeholder="Start Typing"
            placeholderTextColor={COLORS.Gray}
            onChangeText={onChangeText}
            style={styles.TextInputStyle}
          />
        </View>
      </View>
    </View>
  );
};

export default AllGendersHeader;

const styles = StyleSheet.create({
  SearchHeaderContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    height: hp('7%'),
    flexDirection: 'row',
    color: COLORS.White,
    shadowColor: COLORS.Black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 1,
  },
  SearchContainer: {
    width: '88%',
    height: '70%',
    borderRadius: hp('1%'),
    overflow: 'hidden',
    marginHorizontal: wp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.LightGray,
    paddingHorizontal: wp('2%'),
  },
  SearchIconContainerStyle: {
    width: '7%',
  },
  SearchIconStyle: {
    alignSelf: 'center',
  },
  TextInputContainerStyle: {
    width: '90%',
    top: hp('0.2%'),
    alignSelf: 'center',
    paddingLeft: wp('0.5%'),
    justifyContent: 'center',
  },
  TextInputStyle: {
    ...GROUP_FONT.body3,
    justifyContent: 'center',
  },
});
