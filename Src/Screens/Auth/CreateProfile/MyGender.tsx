/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ActiveOpacity, COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomCheckBox from '../../../Components/CustomCheckBox';
import GenderListData from '../../../Components/Data/GenderListData';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';
import {useUserData} from '../../../Contexts/UserDataContext';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useFieldConfig} from '../../../Utils/StorageUtils';
interface GenderItem {
  id: number;
  name: string;
  navigate: boolean;
}

const MyGender: FC = () => {
  let ProgressCount: number = 0.3;
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const {userData, dispatch} = useUserData();
  const StoreStringName = useFieldConfig(LocalStorageFields.gender);

  const [UserGender, setUserGender] = useState<string>(userData.gender);
  const [ShowGenderOnProfile, setShowGenderOnProfile] =
    useState<boolean>(false);

  const toggleCheckMark = useCallback(() => {
    setShowGenderOnProfile(prev => !prev);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    dispatch({type: 'UPDATE_FIELD', field, value});
  };

  const OnSubmitGenderPress = () => {
    handleInputChange(StoreStringName, UserGender);
    navigation.navigate('LoginStack', {
      screen: 'SexualOrientationScreen',
    });
  };

  const RenderGender: FC<{item: GenderItem}> = ({
    item: {id, name, navigate},
  }) => {
    return (
      <TouchableOpacity
        key={id}
        activeOpacity={ActiveOpacity}
        onPress={() => {
          SelectGender(name, navigate);
        }}
        style={[styles.GenderButtonView(UserGender, name)]}>
        <Text style={styles.GenderButtonText}>{name}</Text>
      </TouchableOpacity>
    );
  };

  const SelectGender = async (name: string, navigate: boolean) => {
    if (navigate) {
      navigation.navigate('LoginStack', {
        screen: 'AllGendersSearch',
      });
    } else {
      setUserGender(name);
    }
  };

  console.log('UserGender', UserGender.length);
  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={ProgressCount} Skip={false} />

      <View style={CreateProfileStyles.ContentView}>
        <Text style={CreateProfileStyles.TitleText}>What's your gender?</Text>

        <FlatList
          style={styles.FlatListView}
          data={GenderListData.MainGenders}
          renderItem={RenderGender}
        />
      </View>

      <View style={CreateProfileStyles.BottomButton}>
        <View style={styles.CheckBoxView}>
          <CustomCheckBox
            isChecked={ShowGenderOnProfile}
            onToggle={toggleCheckMark}
          />
          <Text style={styles.CheckboxText}>
            Show my orientation on my profile
          </Text>
        </View>
        <GradientButton
          Title={'Next'}
          Disabled={UserGender.length !== 0 ? false : true}
          Navigation={OnSubmitGenderPress}
        />
      </View>
    </View>
  );
};

export default MyGender;

const styles = StyleSheet.create({
  GenderButtonView: (UserGender, name) => ({
    width: '100%',
    height: hp('6%'),
    marginTop: hp('1%'),
    alignSelf: 'center',
    borderWidth: hp('0.20%'),
    justifyContent: 'center',
    marginVertical: hp('1%'),
    borderRadius: hp('2.5%'),
    borderColor: UserGender === name ? COLORS.Primary : COLORS.Gray,
  }),
  FlatListView: {
    marginTop: hp('4%'),
  },
  GenderButtonText: {
    ...GROUP_FONT.h3,
    fontSize: wp('4%'),
    color: COLORS.Black,
    textAlign: 'center',
  },
  CheckBoxView: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: hp('2.5%'),
  },
  CheckboxText: {
    ...GROUP_FONT.body5,
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: hp('0.8%'),
    fontFamily: FONTS.Medium,
  },
});
