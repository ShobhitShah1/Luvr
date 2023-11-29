import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import GradientButton from '../../../Components/AuthComponents/GradientButton';
import LifestyleData from '../../../Components/Data/LifestyleData';
import CreateProfileHeader from './Components/CreateProfileHeader';
import CreateProfileStyles from './styles';

const AddLifestyle: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<{LoginStack: {}}>>();

  const [selectedItems, setSelectedItems] = useState<Record<string, string>>(
    {},
  );

  const handleOptionPress = useCallback((habitId: number, option: string) => {
    setSelectedItems(prevSelection => ({
      ...prevSelection,
      [habitId.toString()]: option,
    }));
  }, []);

  const renderItem = ({
    item,
  }: {
    item: {id: number; habit: string; options: string[]};
  }) => {
    const selectedOption = selectedItems[item.id.toString()];
    return <React.Fragment></React.Fragment>;
  };

  return (
    <View style={CreateProfileStyles.Container}>
      <CreateProfileHeader ProgressCount={6} Skip={true} />

      <View style={styles.DataViewContainer}>
        <View style={[styles.ContentView]}>
          <Text style={styles.TitleText}>
            Let’s talk about your daily habits!
          </Text>
          <Text style={styles.HabitsMatchText}>
            Share your daily lifestyle habits that best represent you.
          </Text>
        </View>

        <View style={{height: '70%'}}>
          <FlatList
            data={LifestyleData}
            renderItem={renderItem}
            style={{height: '100%'}}
            initialNumToRender={20}
            nestedScrollEnabled={false}
            keyExtractor={item => item.id.toString()}
            removeClippedSubviews={true}
          />
        </View>
      </View>

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

      {/* <View style={[styles.BottomButtonWidth]}>
        <View style={styles.ButtonContainer}>
          <GradientButton
            Title={'Next'}
            Disabled={false}
            Navigation={() => {
              navigation.navigate('LoginStack', {
                screen: 'WhatElseExtra',
              });
            }}
          />
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  DataViewContainer: {
    marginHorizontal: hp('1.2%'),
    marginTop: hp('1%'),
  },
  TitleText: {
    color: COLORS.Primary,
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
  HabitsMatchText: {
    ...GROUP_FONT.h3,
    marginTop: hp('1%'),
    fontFamily: FONTS.Regular,
  },
  optionsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  ContentView: {
    paddingHorizontal: hp('2.8%'),
  },

  habitContainer: {
    marginHorizontal: hp('1.9%'),
  },
  BottomLine: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: hp('0.5%'),
    marginBottom: hp('2%'),
    justifyContent: 'center',
    marginHorizontal: hp('1.9%'),
    borderBottomWidth: hp('0.05%'),
    borderBottomColor: COLORS.Gray,
  },
  habitTitle: {
    ...GROUP_FONT.h3,
  },
  optionButton: {
    borderRadius: hp('2%'),
    marginRight: hp('0.8%'),
    borderWidth: hp('0.09%'),
    borderColor: COLORS.Gray,
    marginVertical: hp('1%'),
    paddingHorizontal: hp('1%'),
    paddingVertical: hp('0.5%'),
    marginHorizontal: hp('0.5%'),
  },
  selectedOption: {
    borderColor: COLORS.Primary,
  },
  CategoriesText: {
    textAlign: 'center',
    ...GROUP_FONT.h4,
    color: COLORS.Gray,
  },
  SelectedCategoriesText: {
    ...GROUP_FONT.h4,
    color: COLORS.Gray,
  },
  checkMissingCategories: {
    marginTop: 16,
  },
  missingCategoriesText: {
    ...GROUP_FONT.h3,
    color: COLORS.White,
  },
  ButtonContainer: {
    width: '90%',
    alignSelf: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  BottomButtonWidth: {
    width: '100%',
    position: 'absolute',
    bottom: hp('1.5%'),
    overflow: 'hidden',
    paddingTop: hp('1.5%'),
  },
  OptionScrollViewContainer: {
    flexDirection: 'row',
    maxWidth: '100%',
    display: 'flex',
    flexWrap: 'wrap',
  },
});

export default AddLifestyle;
