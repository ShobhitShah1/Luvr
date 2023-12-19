/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  ActiveOpacity,
  COLORS,
  FONTS,
  GROUP_FONT,
  SIZES,
} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import YourIntoData from '../../../Components/Data/YourIntoData';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const YourIntro: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>(
    {},
  );

  const handleOptionPress = useCallback((YourIntoID: number, name: string) => {
    setSelectedItems(prevSelection => {
      if (prevSelection[YourIntoID.toString()] === name) {
        const {[YourIntoID.toString()]: removedItem, ...rest} = prevSelection;
        return rest;
      }

      if (Object.keys(prevSelection).length >= 5) {
        return prevSelection;
      }

      return {
        ...prevSelection,
        [YourIntoID.toString()]: name,
      };
    });
  }, []);

  const renderItem = useMemo(
    () =>
      ({item}: {item: {id: number; name: string}}, index: number) => {
        const selectedOption = selectedItems[item.id.toString()];
        return (
          <View style={styles.YourIntoScrollViewContainer}>
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              key={index}
              style={[
                styles.YourIntoButton,
                selectedOption === item.name && styles.selectedOption,
              ]}
              onPress={() => handleOptionPress(item.id, item.name)}>
              <Text
                numberOfLines={2}
                style={[
                  styles.CategoriesText,
                  selectedOption === item.name && styles.SelectedCategoriesText,
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        );
      },
    [selectedItems, handleOptionPress],
  );

  const selectedItemsKeys = Object.keys(selectedItems);

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={8} Skip={true} />
      <View style={styles.DataViewContainer}>
        <View style={[styles.ContentView]}>
          <Text style={styles.TitleText}>What are you into?</Text>
          <Text style={styles.YourIntoMatchText}>
            You like what you like. Now, let everyone know.
          </Text>
        </View>

        <View style={[styles.FlatListContainer]}>
          <FlatList
            numColumns={3}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            data={YourIntoData}
            renderItem={renderItem}
            initialNumToRender={50}
            nestedScrollEnabled={false}
            style={styles.FlatListStyle}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.ContainerContainerStyle}
          />
        </View>
      </View>
      <View style={[CreateProfileStyles.BottomButton]}>
        <GradientButton
          Title={`Next ${selectedItemsKeys?.length || 0}/5`}
          Disabled={false}
          Navigation={() => {
            navigation.navigate('LoginStack', {
              screen: 'AddRecentPics',
            });
          }}
        />
      </View>
    </View>
  );
};

export default YourIntro;

const styles = StyleSheet.create({
  ContentView: {
    width: '100%',
    overflow: 'hidden',
    // paddingHorizontal: hp('2.8%'),
  },
  TitleText: {
    color: COLORS.Primary,
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
  DataViewContainer: {
    height: '90%',
    width: '84%',
    alignSelf: 'center',
    marginTop: hp('1%'),
    // marginHorizontal: hp('5%'),
  },
  FlatListStyle: {},
  ContainerContainerStyle: {
    width: '100%',
  },
  YourIntoMatchText: {
    ...GROUP_FONT.h3,
    marginTop: hp('1%'),
    fontFamily: FONTS.Regular,
  },
  ButtonContainer: {
    width: '90%',
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  BottomButtonWidth: {
    width: '100%',
    bottom: hp('1.5%'),
    position: 'absolute',
    paddingTop: hp('1.5%'),
    borderTopWidth: hp('0.07%'),
    borderTopColor: COLORS.Placeholder,
  },
  YourIntoScrollViewContainer: {},
  YourIntoButton: {
    width: hp('12%'),
    height: hp('6.8%'),
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    marginVertical: hp('1%'),
    backgroundColor: COLORS.White,
  },
  selectedOption: {
    backgroundColor: COLORS.Primary,
    borderWidth: 2,
    borderColor: COLORS.White,
  },
  CategoriesText: {
    width: '85%',
    justifyContent: 'center',
    alignSelf: 'center',
    ...GROUP_FONT.body4,
    fontSize: hp('1.5%'),
    color: 'rgba(130, 130, 130, 1)',
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
  },
  SelectedCategoriesText: {
    color: COLORS.White,
  },
  FlatListContainer: {
    height: '72%',
    marginTop: hp('1.5%'),
  },
});
