import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {COLORS, FONTS, GROUP_FONT} from '../../../../Common/Theme';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CommonIcons from '../../../../Common/CommonIcons';

const ContactSearch = () => {
  return (
    <View style={styles.SearchBarContainer}>
      <View style={styles.SearchImageView}>
        <Image style={styles.SearchIcon} source={CommonIcons.Search} />
      </View>
      <View style={styles.TextInputView}>
        <TextInput
          style={styles.TextInputStyle}
          placeholder="Search for a name or number"
          placeholderTextColor={'rgba(130, 130, 130, 1)'}
        />
      </View>
    </View>
  );
};

export default ContactSearch;

const styles = StyleSheet.create({
  SearchBarContainer: {
    width: '100%',
    height: hp('6.5%'),
    borderRadius: hp('3%'),
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.White,
  },
  SearchImageView: {
    width: '18%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SearchIcon: {
    width: hp('2.5%'),
    height: hp('2.5%'),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  TextInputView: {
    width: '68%',
    justifyContent: 'center',
  },
  TextInputStyle: {
    ...GROUP_FONT.h3,
    fontFamily: FONTS.SemiBold,
    fontSize: hp('1.8%'),
  },
});
