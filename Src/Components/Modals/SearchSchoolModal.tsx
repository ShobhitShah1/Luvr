import React, {FC, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS, FONTS, GROUP_FONT, SIZES} from '../../Common/Theme';
import CustomTextInput from '../CustomTextInput';
import SchoolsData from '../Data/SchoolsData';
interface SchoolModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (school: string) => void;
}

const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get(
        'REAL_WINDOW_HEIGHT',
      );

const SearchSchoolModal: FC<SchoolModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const [searchText, setSearchText] = useState<string>('');

  const filteredSchools = SchoolsData.filter(school =>
    school.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <Modal
      isVisible={visible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      onDismiss={onClose}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      avoidKeyboard={true}
      removeClippedSubviews={true}
      useNativeDriver={true}
      style={styles.ModalContainer}>
      <View style={styles.container}>
        <View style={styles.HeaderView}>
          <Text style={styles.HeaderText}>{`My \nuniversity is`}</Text>
          <TouchableOpacity
            onPress={() => onClose()}
            style={styles.CloseIconView}>
            <AntDesign
              name="close"
              color={COLORS.Gray}
              size={hp('3%')}
              style={styles.IconView}
            />
          </TouchableOpacity>
        </View>
        <CustomTextInput
          style={styles.TextInputStyle}
          placeholder="School"
          value={searchText}
          placeholderTextColor={COLORS.Placeholder}
          onChangeText={text => setSearchText(text)}
        />
        <FlatList
          data={filteredSchools}
          style={styles.FlatlistStyle}
          keyboardShouldPersistTaps="handled"
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.contentContainerStyle}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => onSelect(item.name)}>
              <Text style={styles.SearchedSchools}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: '3%',
    width: '95%',
    height: '97%',
    alignSelf: 'center',
    backgroundColor: COLORS.White,
  },
  ModalContainer: {
    width: '95%',
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  HeaderView: {
    margin: hp('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  HeaderText: {
    ...GROUP_FONT.h4,
    color: COLORS.Placeholder,
  },
  CloseIconView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  IconView: {
    alignSelf: 'flex-end',
  },
  TextInputStyle: {
    width: '90%',
    padding: 0,
    alignSelf: 'center',
    color: COLORS.Black,
    justifyContent: 'center',
    fontFamily: FONTS.Medium,
    borderBottomWidth: hp('0.15%'),
    borderBottomColor: COLORS.Black,
  },
  FlatlistStyle: {
    marginVertical: hp('1%'),
  },
  contentContainerStyle: {
    // marginVertical: hp('5%'),
  },
  SearchedSchools: {
    fontFamily: FONTS.Regular,
    fontSize: SIZES.h4,
    color: COLORS.Black,
    marginVertical: hp('1%'),
    marginHorizontal: hp('2%'),
  },
});

export default SearchSchoolModal;
