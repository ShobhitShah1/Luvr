/* eslint-disable react/no-unstable-nested-components */
import React, {FC, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GenderListData from '../../../Components/Data/GenderListData';
import AllGendersHeader from './Components/AllGendersHeader';

const AllGendersSearch: FC = () => {
  const [SearchText, setSearchText] = useState<string>('');
  const [filteredGenders, setFilteredGenders] = useState<any[]>([]);

  const filterGenders = (text: string) => {
    const lowercasedText = text.toLowerCase();
    const filtered = GenderListData.AllGenders.filter((gender: any) =>
      gender.name.toLowerCase().includes(lowercasedText),
    );
    setFilteredGenders(filtered);
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    filterGenders(text);
  };

  const NoGenderView = () => (
    <View style={styles.CantFindView}>
      <Text style={styles.CantFindText}>
        Apologies, <Text style={styles.CantFindSearchText}>{SearchText}</Text>{' '}
        cannot be found.
      </Text>
    </View>
  );

  const RenderGenderView = (item: any) => (
    <View style={styles.GenderItem}>
      <Ionicons
        name="search-outline"
        color={COLORS.Gray}
        size={wp('5%')}
        style={styles.SearchIconStyle}
      />
      <Text style={styles.GenderText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.AllGendersContainer}>
      <AllGendersHeader
        setSearchText={handleSearchChange}
        SearchText={SearchText}
      />

      {SearchText.length !== 0 && (
        <FlatList
          data={filteredGenders}
          ListEmptyComponent={NoGenderView}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => RenderGenderView(item)}
          contentContainerStyle={styles.ContentContainerStyle}
        />
      )}
    </View>
  );
};

export default AllGendersSearch;

const styles = StyleSheet.create({
  AllGendersContainer: {
    flex: 1,
  },
  GenderItem: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginHorizontal: wp('4%'),
    paddingVertical: hp('1.8%'),
    borderBottomColor: COLORS.LightGray,
  },
  ContentContainerStyle: {
    flex: 1,
  },
  SearchIconStyle: {
    marginRight: wp('1%'),
  },
  GenderText: {
    ...GROUP_FONT.body4,
    fontFamily: FONTS.SemiBold,
  },
  CantFindView: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  CantFindText: {
    ...GROUP_FONT.body2,
    textAlign: 'center',
  },
  CantFindSearchText: {
    fontFamily: FONTS.SemiBold,
  },
});
