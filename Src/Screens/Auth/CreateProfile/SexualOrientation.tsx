/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import CustomCheckBox from '../../../Components/CustomCheckBox';
import GendersData from '../../../Components/Data/genders';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';
import {useUserData} from '../../../Contexts/UserDataContext';
import {useFieldConfig} from '../../../Utils/StorageUtils';

const {width} = Dimensions.get('window');

const SexualOrientation: FC = () => {
  let ProgressCount: number = 0.3;
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  const {userData, dispatch} = useUserData();
  const StoreStringName = useFieldConfig(LocalStorageFields.sexualOrientation);

  const initialSexualOrientation: {id: number; name: string}[] = userData.sexualOrientation?.length
    ? userData.sexualOrientation
    : [];

  console.log('userData.sexualOrientation', userData);
  console.log('userData.sexualOrientation', userData.sexualOrientation);

  const [ShowOnProfile, setShowOnProfile] = useState<boolean>(false);
  const [SelectedGenderIndex, setSelectedGenderIndex] = useState<Object[]>(
    initialSexualOrientation,
  );

  const toggleCheckMark = useCallback(() => {
    setShowOnProfile(prev => !prev);
  }, []);

  const onPressGenders = useCallback(
    (item: string) => {
      if (SelectedGenderIndex.includes(item)) {
        setSelectedGenderIndex(prev => prev.filter(i => i !== item));
      } else if (SelectedGenderIndex.length < 3) {
        setSelectedGenderIndex(prev => [...prev, item]);
      }
    },
    [SelectedGenderIndex],
  );

  const isGenderSelected = (item: string) => SelectedGenderIndex.includes(item);

  const handleInputChange = (field: any, value: any) => {
    dispatch({type: 'UPDATE_FIELD', field, value});
  };

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity
      key={index}
      onPress={() => onPressGenders(item)}
      style={styles.GenderButtonView}>
      <View style={styles.GenderFlexView}>
        <Text
          style={[
            styles.SelectGenderText,
            {
              fontFamily: isGenderSelected(item) ? FONTS.Bold : FONTS.Medium,
            },
          ]}>
          {item.name}
        </Text>
        {isGenderSelected(item) && (
          <Feather name="check" size={20} color={COLORS.Primary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.EmptyViewStyle}>
      <Text style={styles.EmptyViewText}>We Don't Have Any Genders, Sorry</Text>
    </View>
  );

  const OnNextButtonClick = () => {
    handleInputChange(StoreStringName, SelectedGenderIndex);
    navigation.navigate('LoginStack', {
      screen: 'ImLookingFor',
    });
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={ProgressCount} Skip={true} />

      <View style={CreateProfileStyles.ContentView}>
        <Text style={CreateProfileStyles.TitleText}>
          Your sexual orientation?
        </Text>
        <Text style={styles.SelectUptoText}>Select upto 3</Text>
        <View style={styles.BorderBottomWidth} />
      </View>

      <View style={{height: '65%'}}>
        <FlatList
          data={GendersData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>

      <View style={[CreateProfileStyles.BottomButton, styles.BottomContainer]}>
        <View style={styles.BottomView}>
          <View style={styles.BorderBottomWidth} />
          <View style={styles.CheckBoxView}>
            <CustomCheckBox
              isChecked={ShowOnProfile}
              onToggle={toggleCheckMark}
            />
            <Text style={styles.CheckboxText}>
              Show my orientation on my profile
            </Text>
          </View>
          <GradientButton
            Title={'Next'}
            Disabled={SelectedGenderIndex.length !== 0 ? false : true}
            Navigation={OnNextButtonClick}
          />
        </View>
      </View>
    </View>
  );
};

export default SexualOrientation;

const styles = StyleSheet.create({
  SelectUptoText: {
    ...GROUP_FONT.h3,
    marginVertical: hp('1%'),
    fontFamily: FONTS.Regular,
  },
  BottomContainer: {
    zIndex: 1,
    width: '100%',
    overflow: 'hidden',
    borderStartColor: COLORS.White,
  },
  BottomView: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginHorizontal: hp('1.9%'),
  },
  BorderBottomWidth: {
    width: '110%',
    right: hp('1.5%'),
    marginTop: hp('1%'),
    borderBottomWidth: hp('0.1%'),
    borderBottomColor: COLORS.Black,
  },
  GenderButtonView: {
    width: width,
    height: hp('6%'),
    justifyContent: 'center',
    alignContent: 'center',
  },
  SelectGenderFlexView: {
    flexDirection: 'row',
    marginHorizontal: hp('2%'),
    justifyContent: 'space-between',
  },
  GenderFlexView: {
    flexDirection: 'row',
    marginHorizontal: hp('2%'),
    justifyContent: 'space-between',
  },
  SelectGenderText: {
    ...GROUP_FONT.h3,
  },
  CheckBoxView: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: hp('2%'),
  },
  CheckboxText: {
    ...GROUP_FONT.h4,
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: hp('0.5%'),
    fontFamily: FONTS.Medium,
  },
  EmptyViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  EmptyViewText: {
    ...GROUP_FONT.h2,
    textAlign: 'center',
  },
});
