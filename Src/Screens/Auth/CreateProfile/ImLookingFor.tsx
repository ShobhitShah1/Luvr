import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useCallback, useState} from 'react';
import CreateProfileStyles from './styles';
import CreateProfileHeader from './Components/CreateProfileHeader';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LookingFor from '../../../Components/Data/LookingFor';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useUserData} from '../../../Contexts/UserDataContext';
import {useFieldConfig} from '../../../Utils/StorageUtils';
import {LocalStorageFields} from '../../../Types/LocalStorageFields';

const ImLookingFor: FC = () => {
  let ProgressCount: number = 0.4;
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  const {userData, dispatch} = useUserData();
  const StoreStringName = useFieldConfig(LocalStorageFields.sexualOrientation);

  const [SelectedLookingForIndex, setSelectedLookingForIndex] = useState<
    string[]
  >([]);

  const onPressLookingFor = useCallback(
    (item: string) => {
      //* Check if the selected item is already in the array
      const isSelected = SelectedLookingForIndex.includes(item);

      //* If the selected item is already in the array, unselect it
      if (isSelected) {
        setSelectedLookingForIndex([]);
      } else {
        //* If the selected item is not in the array, select it and unselect the previous one
        setSelectedLookingForIndex([item]);
      }

      console.log('SelectedLookingForIndex', SelectedLookingForIndex);
    },
    [SelectedLookingForIndex],
  );

  const isGenderSelected = (item: string) =>
    SelectedLookingForIndex.includes(item);

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity
      onPress={() => onPressLookingFor(item)}
      style={
        isGenderSelected(item)
          ? styles.SelectedLookingForListView
          : styles.LookingForListView
      }
      key={index}>
      <View style={styles.TextView}>
        <Text style={styles.EmojiText}>{item.Emoji}</Text>
        <Text numberOfLines={2} style={styles.LookingForText}>
          {item.Title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={ProgressCount} Skip={false} />

      <View style={CreateProfileStyles.ContentView}>
        <Text style={CreateProfileStyles.TitleText}>I'm Looking For ...</Text>
        <Text style={styles.CompatibilityText}>
          increase compatibility by sharing yours!
        </Text>
      </View>

      <FlatList
        numColumns={3}
        data={LookingFor}
        renderItem={renderItem}
        contentContainerStyle={styles.FlatListContainer}
        keyExtractor={item => item.id.toString()}
      />

      <View style={CreateProfileStyles.BottomButton}>
        <GradientButton
          Title={'Next'}
          Disabled={SelectedLookingForIndex.length !== 0 ? false : true}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'DistancePreference',
            });
          }}
        />
      </View>
    </View>
  );
};

export default ImLookingFor;

const styles = StyleSheet.create({
  CompatibilityText: {
    ...GROUP_FONT.h3,
    marginVertical: hp('1%'),
    fontFamily: FONTS.Regular,
  },
  FlatListContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  SelectedLookingForListView: {
    width: '31%',
    left: hp('0.5%'),
    alignContent: 'center',
    marginHorizontal: hp('0.4%'),
    justifyContent: 'center',
    alignSelf: 'center',
    height: hp('15%'),
    borderRadius: hp('1%'),
    marginVertical: hp('0.5%'),
    overflow: 'hidden',
    borderWidth: hp('0.2%'),
    borderColor: COLORS.Primary,
  },
  LookingForListView: {
    width: '31%',
    left: hp('0.5%'),
    alignContent: 'center',
    marginHorizontal: hp('0.4%'),
    justifyContent: 'center',
    alignSelf: 'center',
    height: hp('15%'),
    borderRadius: hp('1%'),
    backgroundColor: 'rgba(97,106,118,0.1)',
    marginVertical: hp('0.5%'),
    overflow: 'hidden',
  },
  TextView: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '85%',
  },
  EmojiText: {
    ...GROUP_FONT.h1,
    textAlign: 'center',
    marginVertical: hp('0.5%'),
  },
  LookingForText: {
    marginVertical: hp('0.2%'),
    ...GROUP_FONT.body3,
    fontSize: hp('1.6%'),
    color: COLORS.Black,
    textAlign: 'center',
  },
});
