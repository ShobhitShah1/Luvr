import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  ActiveOpacity,
  COLORS,
  FONTS,
  GROUP_FONT,
  SIZES,
} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import SearchSchoolModal from '../../../Components/Modals/SearchSchoolModal';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const YourStudy: FC = () => {
  let ProgressCount: number = 0.6;
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  const [SchoolNameText, setSchoolNameText] = useState<string>('');
  const [SearchSchoolModalVisible, setSearchSchoolModalVisible] =
    useState<boolean>(false);

  const openModal = () => {
    setSearchSchoolModalVisible(true);
  };

  const closeModal = () => {
    setSearchSchoolModalVisible(false);
  };

  const handleSchoolSelect = (school: string) => {
    setSchoolNameText(school);
    closeModal();
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={ProgressCount} Skip={true} />
      <View style={CreateProfileStyles.ContentView}>
        <Text style={CreateProfileStyles.TitleText}>
          If studying is your thing...?
        </Text>
      </View>
      <View style={styles.TextInputContainerView}>
        <View style={styles.TextInputTextView}>
          <TouchableOpacity
            onPress={openModal}
            activeOpacity={1}
            style={styles.SchoolInputStyle}>
            <Text style={styles.SchoolInputText}>
              {SchoolNameText.length !== 0
                ? SchoolNameText
                : 'Enter school name, past or current'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.CloseButtonView}
            activeOpacity={ActiveOpacity}>
            <AntDesign
              name="closecircle"
              color={COLORS.Gray}
              size={hp('1.8%')}
              style={styles.IconView}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.AppearInProfileText}>
          This is how it'll appear on your profile.
        </Text>
      </View>

      <SearchSchoolModal
        visible={SearchSchoolModalVisible}
        onClose={closeModal}
        onSelect={handleSchoolSelect}
      />

      <View style={CreateProfileStyles.BottomButton}>
        <GradientButton
          Title={'Next'}
          Disabled={false}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'AddLifestyle',
            });
          }}
        />
      </View>
    </View>
  );
};

export default YourStudy;

const styles = StyleSheet.create({
  TextInputContainerView: {
    justifyContent: 'center',
    marginVertical: hp('2%'),
    marginHorizontal: hp('1.9%'),
  },
  TextInputStyle: {
    padding: 0,
    width: '90%',
    color: COLORS.Black,
    fontSize: SIZES.body4,
    fontFamily: FONTS.Regular,
  },
  SchoolInputStyle: {
    width: '90%',
    marginVertical: hp('0.5%'),
  },
  SchoolInputText: {
    color: COLORS.Black,
    fontSize: SIZES.body4,
    fontFamily: FONTS.Regular,
  },
  CloseButtonView: {
    width: '10%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: hp('0.5%'),
  },
  IconView: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  AppearInProfileText: {
    ...GROUP_FONT.body4,
  },
  TextInputTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: hp('0.15%'),
    borderBottomColor: COLORS.Black,
  },
});
